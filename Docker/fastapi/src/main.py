from fastapi import FastAPI
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import pandas as pd
import ast
import numpy as np
import networkx as nx
import json
from fastapi.middleware.cors import CORSMiddleware
from sklearn.preprocessing import MinMaxScaler


from Dto.GraphDTO import GraphDTO
from Dto.AuGraphDTO import AuGraphDTO
from Dto.nodeDTO import NodeDTO
from Dto.LinkDTO import LinkDTO
from Dto.AuthorDTO import AuthorDTO

# app = FastAPI(
#         title ="Egg",
#         description="Egg Graph API",
#         version="0.1.0",
#         docs_url="/docs",
#         redoc_url="/redoc",
#         openapi_url='/openapi.json'
#         )

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://egg.co.kr","http://15.165.247.85:8000/docs","http://localhost:3000","http://3.37.110.13:3000","https://fdda-211-209-60-55.ngrok-free.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB 연결 정보 설정
#client = MongoClient('mongodb://ditto:AbBaDittos!230910*@3.37.153.14', 27017)
client = MongoClient("mongodb://root:1234@mongodb:27017/admin")


loaded_Au_G = nx.read_graphml('Authorgraph.graphml')
loaded_CC_G = nx.read_graphml('CCgraph202310.graphml')

def get_CC_Graph():
    kci_db_name = "Egg_"
    kci_db = client[kci_db_name]
    kci_db_col = "Egg_CCgraph_Data"
    kci_data = list(kci_db[kci_db_col].find({}))
    df = pd.DataFrame(kci_data)
    print(df.columns)
    convert_col_name =['articleID', 'titleKor', 'author1Name', 'author1ID','author1Inst', 'author2IDs','author2Names','author2Insts' ,'journalName', 'pubYear', 'citations','class', 'abstractKor','keywords','ems']
    df = df[convert_col_name]
    df = df.rename(columns={
        'articleID': 'article_id',
        'titleKor': 'title_ko',
        'author1Name': 'author_name',
        'author1ID': 'author_id',
        'author1Inst': 'author_inst',
        'journalName': 'journal_name',
        'pubYear': 'pub_year',
        'citations': 'citation',
        'abstractKor': 'abstract_ko',
        'author2IDs' : 'author2_id',
        'author2Names': 'author2_name',
        'author2Insts' : 'author2_inst',
        'keywords': 'keys',
        'class' : 'category',
        'ems': 'ems'
    })
    df['ems'] = df['ems'].apply(lambda x: np.array([float(val) for val in x.strip('[]').split()]))
    df['keys'] = df['keys'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['author2_id'] = df['author2_id'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['author2_name'] = df['author2_name'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['author2_inst'] = df['author2_inst'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    print(df.columns)
    return df

def get_AU_Graph():
    kci_db_name = "Egg_"
    kci_db = client[kci_db_name]
    kci_db_col_au = "Egg_Augraph_Data"
    kci_data = list(kci_db[kci_db_col_au].find({}))
    df = pd.DataFrame(kci_data)
    print(df.columns)
    
    df['articleIDs'] = df['articleIDs'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['titleKor'] = df['titleKor'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['with_author2IDs'] = df['with_author2IDs'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['citations'] = df['citations'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['journalIDs'] = df['journalIDs'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['word_cloud'] = df['word_cloud'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    df['category'] = df['category'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

    df['kiiscArticles'] = df['kiiscArticles'].astype(float)
    df['totalArticles'] = df['totalArticles'].astype(float)
    df['impactfactor'] = df['impactfactor'].astype(float)
    df['H_index'] = df['H_index'].astype(float)
    return df

def get_unique_nodes(search_list, G):
    subgraph_nodes = []
    subgraph_edges = []
    for search in search_list:
        subgraph = nx.ego_graph(G, search, radius=1)
        subgraph_nodes.extend(list(subgraph.nodes()))
        subgraph_edges.extend(list(subgraph.edges()))

    unique_nodes = list(set(subgraph_nodes))
    return unique_nodes

def filtering_df(df, search_list, unique_nodes, indicator):
    filtered_df = df[df['article_id'].isin(unique_nodes)]

    for search in search_list:
        col_name = f'Similarity_{search}'
        filtered_df.loc[:, col_name] = calculate_cosine_similarity(filtered_df, search)

    # 각 Similarity_{search} 컬럼의 평균 계산하여 Similarity_AVG 컬럼 생성
    filtered_df['Similarity_AVG'] = filtered_df[[f'Similarity_{search}' for search in search_list]].mean(axis=1)

    # search_list에 있는 articleID와 일치하는 행의 Similarity_AVG 값을 1로 설정
    for search in search_list:
        filtered_df.loc[filtered_df['article_id'] == search, 'Similarity_AVG'] = 1

    # Similarity_AVG가 indicator 보다 큰 행 선택
    filtered_df = filtered_df[filtered_df['Similarity_AVG'] > indicator]
    filtered_df.reset_index(inplace=True, drop=True)
    filtered_df['id'] = range(0, len(filtered_df))
    print("filter : ",filtered_df.columns)
    desired_column_order = ['id', 'article_id', 'title_ko', 'author_name', 'author_id','author_inst','author2_id','author2_name','author2_inst','journal_name', 'pub_year', 'category','keys'
                            ,'citation', 'abstract_ko', 'Similarity_AVG']
    filtered_df['Similarity_AVG'] = filtered_df['Similarity_AVG'].round(2)
    filtered_df = filtered_df[desired_column_order]
    filtered_df['origin_check'] = 0

    filtered_df['origin_check'] = filtered_df['article_id'].apply(lambda x: search_list.index(x) + 1 if x in search_list else 0)


    return filtered_df

def set_link_data_form(filtered_df,search_list,final_ids):
    filtered_subgraph = loaded_CC_G.subgraph(final_ids)
    filtered_subgraph = filtered_subgraph.copy()
    edges_with_weights = []

    # search_list의 요소(u) 를 기준으로 다른 articleID(v)와 가중치 설정
    for u in search_list:
        for v in filtered_df['article_id']:
            if u != v:  # u와 v가 다른 경우에 만 추가
                similarity_avg = round(filtered_df[filtered_df['article_id'] == v]['Similarity_AVG'].values[0], 2)
                edges_with_weights.append(((u, v), similarity_avg))

    for (u, v), weight in edges_with_weights:
        filtered_subgraph.add_edge(u, v, weight=weight)

    # front-end 전달을 위한 Form 변환
    replace_mapping = dict(enumerate(filtered_df['article_id'].unique()))
    reverse_mapping = {v: k for k, v in replace_mapping.items()}
    edge_list_as_indices = [(reverse_mapping[node1], reverse_mapping[node2], data.get('weight', 0.0)) for
                            node1, node2, data in filtered_subgraph.edges(data=True)]
    edge_list_as_indices_json = json.dumps(edge_list_as_indices)
    edge_list_as_indices = json.loads(edge_list_as_indices_json)
    edge_list_as_objects = [{"source": source, "target": target, "distance": dist} for source, target, dist in
                            edge_list_as_indices]
    return edge_list_as_objects


def set_node_data_form(filtered_df):
    node_data = filtered_df.to_json(orient='records', force_ascii=False)
    nodes = json.loads(node_data)
    return nodes
def get_graph_by_article_id(item_id):

    search_list = item_id.split('+')
    df = get_CC_Graph()
    unique_nodes = get_unique_nodes(search_list, loaded_CC_G)
    filtered_df = filtering_df(df, search_list, unique_nodes, 0.93)
    final_ids = list(filtered_df['article_id'])

    links_data = set_link_data_form(filtered_df, search_list, final_ids)
    nodes_data = set_node_data_form(filtered_df)

    nodes = [NodeDTO(**node) for node in nodes_data]
    links = [LinkDTO(**link) for link in links_data]

    return GraphDTO(nodes=nodes, links=links)

def calculate_cosine_similarity(df, search):
    res = []
    standard = df[df['article_id'] == search]
    p = np.array(standard['ems'].values[0])

    # 유사도 계산
    for _, row in df.iterrows():
        q = row['ems']
        dot_product = np.dot(p, q)

        # 벡터 A와 B의 크기를 계산합니다.
        magnitude_A = np.linalg.norm(p)
        magnitude_B = np.linalg.norm(q)

        # 코사인 유사도를 계산합니다.
        cosine_similarity = dot_product / (magnitude_A * magnitude_B)
        res.append(cosine_similarity)

    return res
def filtering_au_data(df, subgraph_nodes):
    filtered_df = df[df['authorID'].isin(subgraph_nodes)]
    filtered_df.reset_index(inplace=True, drop=True)
    filtered_df['id'] = range(0, len(filtered_df))
    print(filtered_df.columns)
    desired_column_order = ['id', 'authorID', 'author1Name', 'author1Inst', 'articleIDs', 'titleKor','with_author2IDs', 'citations', 'journalIDs','pubYears','category', 'word_cloud', 'kiiscArticles','totalArticles','impactfactor','H_index' ]
    filtered_df = filtered_df.rename(columns={
        'id': 'id',
        'authorID': 'authorID',
        'author1Name': 'author1Name',
        'author1Inst': 'author1Inst',
        'articleIDs': 'articleIDs',
        'titleKor' : 'titleKor',
        'with_author2IDs': 'with_author2IDs',
        'citations': 'citations',
        'journalIDs': 'journalIDs',
        'word_cloud': 'word_cloud',
        'kiiscArticles' : 'kiiscArticles',
        'totalArticles': 'totalArticles',
        'impactfactor' : 'impactfactor',
        'category' : 'category',
        'H_index': 'H_index'
    })

    filtered_df = filtered_df[desired_column_order]
    scaler = MinMaxScaler(feature_range=(10,30))

    filtered_df['scaled_impactfactor'] = scaler.fit_transform(filtered_df[['impactfactor']])
    filtered_df['scaled_impactfactor'] = filtered_df['scaled_impactfactor'].round(1)

# 결과 출력
    return filtered_df


def set_link_data_form_au(filtered_df,subgraph_edges):
       
    replace_mapping = dict(enumerate(filtered_df['authorID'].unique()))
    reverse_mapping = {v: k for k, v in replace_mapping.items()}
    edge_list_as_indices = [(reverse_mapping[node1], reverse_mapping[node2], data.get('weight', 1.0)) for
                            node1, node2, data in subgraph_edges]

    edge_list_as_indices_json = json.dumps(edge_list_as_indices)
    edge_list_as_indices = json.loads(edge_list_as_indices_json)
    edge_list_as_objects = [{"source": source, "target": target, "distance": dist} for source, target, dist in
                            edge_list_as_indices]

    return edge_list_as_objects


def get_item_by_author_id(author_id):
    df = get_AU_Graph()
    subgraph = nx.ego_graph(loaded_Au_G, author_id, radius=1)
    subgraph_nodes = subgraph.nodes()
    subgraph_edges = subgraph.edges(data=True)

    filtered_df = filtering_au_data(df, subgraph_nodes)

    links_data = set_link_data_form_au(filtered_df, subgraph_edges)
    nodes_data = set_node_data_form(filtered_df)

    nodes = [AuthorDTO(**node) for node in nodes_data]
    links = [LinkDTO(**link) for link in links_data]

    return AuGraphDTO(nodes=nodes, links=links)


def check_mongodb_connection():
    try:
        client.server_info()
        return True
    except ServerSelectionTimeoutError:
        return False


@app.get("/")
def test_mongodb_connection():
    if check_mongodb_connection():
        return {"message": "성공"}
    else:
        return {"message": "실패"}


@app.get("/Detail/{article_id}")
def get_CcGarph(article_id: str):
    graph = get_graph_by_article_id(article_id)

    if graph:
        return graph
    else:
        return {"message": "graph not found"}


@app.get("/Author/{author_id}")
def get_AuGarph(author_id: str):
    print('author' , author_id)
    graph = get_item_by_author_id(author_id)
    if graph:
        return graph
    else:
        return {"message": "graph not found"}
