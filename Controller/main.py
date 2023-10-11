from fastapi import FastAPI
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import pandas as pd
import ast
import numpy as np
import networkx as nx
import json
from fastapi.middleware.cors import CORSMiddleware
import sys
sys.path.append('/home/ubuntu/Egg')
from Dto.GraphDTO import GraphDTO
from Dto.nodeDTO import NodeDTO
from Dto.LinkDTO import LinkDTO
app = FastAPI()
app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        )


# MongoDB 연결 정보 설정
client = MongoClient( 'mongodb://ditto:AbBaDittos!230910*@3.37.153.14', 27017)
kci_db_name = "Egg_"
kci_db = client[kci_db_name]
kci_db_col = "egg_CCgraph_data"
kci_data = list(kci_db[kci_db_col].find({}))

kci_db_col_au = "egg_Augraph_Data"
kci_data_au = list(kci_db[kci_db_col_au].find({}))

loaded_Au_G = nx.read_graphml('Authorgraph.graphml')
loaded_G = nx.read_graphml('CCgraph202310.graphml')

df = pd.DataFrame(kci_data)
#df = df[['articleID','author1ID','titleKor','citations','journalID','journalName','abstractKor','pubYear', 'keys', 'ems']]
df = df[['articleID','titleKor','author1Name','author1ID','journalName','pubYear','citations' ,'abstractKor','keys', 'ems']]
df = df.rename(columns={
    'articleID': 'article_id',
    'titleKor': 'title_ko',
    'author1Name': 'author_name',
    'author1ID': 'author_id',
    'journalName': 'journal_name',
    'pubYear': 'pub_year',
    'citations': 'citation',
    'abstractKor': 'abstract_ko',
    'keys': 'keys',
    'ems': 'ems'
})
df['ems'] = df['ems'].apply(lambda x: np.array([float(val) for val in x.strip('[]').split()]))

def get_item_by_article_id(item_id):
    search_list = item_id.split('+')
    print(search_list)
    #search_list.append(item_id)
    # search_list = ['ART002742767','ART002895765','ART002514031','ART002744016']
    subgraph_nodes = []
    subgraph_edges = []
    for search in search_list:
        subgraph = nx.ego_graph(loaded_G, search, radius=1)
        subgraph_nodes.extend(list(subgraph.nodes()))
        subgraph_edges.extend(list(subgraph.edges()))
    unique_nodes = list(set(subgraph_nodes))
    unique_edges = list(set(subgraph_edges))

    filtered_df = df[df['article_id'].isin(unique_nodes)]
    for search in search_list:
        col_name = f'Similarity_{search}'
        filtered_df.loc[:, col_name] = calculate_cosine_similarity(filtered_df, search)

    # 각 Similarity_{search} 컬럼의 평균 계산하여 Similarity_AVG 컬럼 생성
    filtered_df['Similarity_AVG'] = filtered_df[[f'Similarity_{search}' for search in search_list]].mean(axis=1)

    # search_list에 있는 articleID와 일치하는 행의 Similarity_AVG 값을 1로 설정
    for search in search_list:
        filtered_df.loc[filtered_df['article_id'] == search, 'Similarity_AVG'] = 1

    # Similarity_AVG가 0.95보다 큰 행 선택
    filtered_df = filtered_df[filtered_df['Similarity_AVG'] > 0.93]
    print(len(filtered_df))
    

    filtered_df.reset_index(inplace=True,drop=True)
    filtered_df['id'] = range(0, len(filtered_df))
  #  desired_column_order = ['id','articleID', 'author1ID', 'titleKor', 'citations', 'journalID',    'journalName', 'abstractKor', 'pubYear', 'keys', 'Similarity_AVG']

    desired_column_order = ['id','article_id', 'title_ko', 'author_name', 'author_id', 'journal_name','pub_year', 'citation', 'abstract_ko','Similarity_AVG']    
    filtered_df = filtered_df[desired_column_order]


    final_ids = list(filtered_df['article_id'])
    filtered_subgraph = loaded_G.subgraph(final_ids)
    filtered_subgraph = filtered_subgraph.copy()
    edges_with_weights = []

    # search_list의 요소(u) 를 기준으로 다른 articleID(v)와 가중치 설정
    for u in search_list:
        for v in filtered_df['article_id']:
            if u != v:  # u와 v가 다른 경우에만 추가
                similarity_avg = round(filtered_df[filtered_df['article_id'] == v]['Similarity_AVG'].values[0],2)
                edges_with_weights.append(((u, v), similarity_avg))

    for (u, v), weight in edges_with_weights:
        filtered_subgraph.add_edge(u, v, weight=weight)
    replace_mapping = dict(enumerate(filtered_df['article_id'].unique()))
    reverse_mapping = {v: k for k, v in replace_mapping.items()}
    edge_list_as_indices = [(reverse_mapping[node1], reverse_mapping[node2], data.get('weight', 0.0)) for node1, node2, data in filtered_subgraph.edges(data=True)]
    edge_list_as_indices_json = json.dumps(edge_list_as_indices)
    edge_list_as_indices = json.loads(edge_list_as_indices_json)
    edge_list_as_objects = [{"source": source, "target": target, "distance": dist} for source, target, dist in edge_list_as_indices]
    

    json_data = filtered_df.to_json(orient='records', force_ascii=False)
    jj = json.loads(json_data)

    combined_data = {"nodes": jj, "links": edge_list_as_objects}

    return combined_data

def calculate_cosine_similarity(df, search):
    res = []
    standard = df[df['article_id'] == search]
    p = np.array(standard['ems'].values[0])

    # 유사도 계산
    for _,row in df.iterrows():
        q = row['ems']
        dot_product = np.dot(p, q)

        # 벡터 A와 B의 크기를 계산합니다.
        magnitude_A = np.linalg.norm(p)
        magnitude_B = np.linalg.norm(q)

        # 코사인 유사도를 계산합니다.
        cosine_similarity = dot_product / (magnitude_A * magnitude_B)
        res.append(cosine_similarity)
    
    return res


def get_item_by_author_id(author_id):
    adf = pd.DataFrame(kci_data_au)
    subgraph = nx.ego_graph(loaded_Au_G, author_id, radius=1)
    subgraph_nodes = subgraph.nodes()
    subgraph_edges = subgraph.edges(data=True)
    
    filtered_df = adf[adf['authorID'].isin(subgraph_nodes)]
    filtered_df.reset_index(inplace=True,drop=True)
    filtered_df['id'] = range(0, len(filtered_df))
    desired_column_order = ['id','authorID', 'author1Name', 'author1Inst', 'articleIDs','with_author2IDs', 'with_author1IDs', 'citations', 'journalIDs', 'pubYears', 'word_cloud']
    filtered_df = filtered_df[desired_column_order]
    replace_mapping = dict(enumerate(filtered_df['authorID'].unique()))
    reverse_mapping = {v: k for k, v in replace_mapping.items()}
    edge_list_as_indices = [(reverse_mapping[node1], reverse_mapping[node2], data.get('weight', 1.0)) for node1, node2, data in subgraph_edges]
    
    edge_list_as_indices_json = json.dumps(edge_list_as_indices)
    edge_list_as_indices = json.loads(edge_list_as_indices_json)
    edge_list_as_objects = [{"source": source, "target": target, "distance": dist} for source, target, dist in edge_list_as_indices]
    
    json_data = filtered_df.to_json(orient='records', force_ascii=False)
    jj = json.loads(json_data)
    combined_data = {"nodes": jj, "links": edge_list_as_objects}

    return combined_data


def check_mongodb_connection():
    try:
        # MongoDB 서버에 연결을 시도하고 1초 동안 대기
        client.server_info()
        return True
    except ServerSelectionTimeoutError:
        return False

@app.get("/")
def test_mongodb_connection():
    if check_mongodb_connection():
        return pandas_df.head(1).to_dict(orient='records')
    else:
        return {"message": "실패"}

@app.get("/Detail/{article_id}")
def get_item(article_id: str):
    print(article_id)
    item = get_item_by_article_id(article_id)
    if item:
        nodes_data = item["nodes"]
        links_data = item["links"]
        nodes = [NodeDTO(**node) for node in nodes_data]
        links = [LinkDTO(**link) for link in links_data]
        graph_data = GraphDTO(nodes=nodes, links=links)
        #print(links_data)

        return graph_data #graph_data  # item은 리스트 형태이므로 첫 번째 요소 반환
    else:
        return {"message": "Item not found"}

@app.get("/author/{author_id}")
def get_item(author_id: str):
    item = get_item_by_author_id(author_id)
    if item:
        return item  # item은 리스트 형태이므로 첫 번째 요소 반환
    else:
        return {"message": "Item not found"}
