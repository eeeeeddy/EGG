from pyspark.sql import SparkSession
import pyspark.sql.functions as F
from pyspark.sql.functions import udf, explode, collect_list, size, expr, struct, col, when, array_contains , flatten
from pyspark.sql.types import StringType, ArrayType, StructType, StructField,FloatType
import numpy as np
import pandas as pd
import ast
from pymongo import MongoClient
import datetime
import matplotlib.pyplot as plt
import networkx as nx

# 세션 생성 및 디비 연동
spark = SparkSession.builder.appName("preprocessingSpark").getOrCreate()
client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)

pd.DataFrame.iteritems = pd.DataFrame.items

current_datetime = datetime.datetime.now()
year = current_datetime.year
month = current_datetime.month
one_month_ago = current_datetime - datetime.timedelta(days=current_datetime.day)
one_month_ago = one_month_ago.month

def parse_list(value):
    return ast.literal_eval(value) if value else []
    
parse_list_udf = udf(parse_list, ArrayType(StringType()))

def get_kci_data(df_name):
    
    print('Get ',df_name,"!")
    kci_db_name = "kci_trained_api"
    kci_db = client[kci_db_name]
    kci_data = list(kci_db[df_name].find({}))

    pandas_df = pd.DataFrame(kci_data)
    pandas_df = pandas_df[['articleID','titleEng','abstractEng','journalID','pubYear','refereceTitle', 'keys', 'ems']]
    pandas_df = pandas_df.astype(str)

    spark_df = spark.createDataFrame(pandas_df)
    spark_df = spark_df.withColumn("refereceTitle", parse_list_udf(spark_df["refereceTitle"]))
    spark_df = spark_df.withColumn("keys", parse_list_udf(spark_df["keys"]))


    return spark_df

def get_reference_map_data():
    print('Get Reference Map!')

    reference_map_db = client['reference_map'] 
    previous_refer_col_name = "reference_map_{:04d}{:02d}".format(year, one_month_ago)

    reference_map = list(reference_map_db[previous_refer_col_name].find({}))
    # dataFrame 변환
    reference_map_df = pd.DataFrame(reference_map)
    reference_map_df = reference_map_df[['reference_title','article_list']]
    # sparkDataFrame 변환
    reference_map_df = reference_map_df.astype(str)
    reference_map_df = spark.createDataFrame(reference_map_df)

    reference_map_df = reference_map_df.withColumn("article_list", parse_list_udf(reference_map_df["article_list"]))
    return reference_map_df


def renew_reference_map_data(ndf, reference_map_df):
    print('Renew Progress!')
    
    # 새로운 레퍼런스를 레퍼런스맵에 적용
    result_df = ndf.select("articleID", explode(col("refereceTitle")).alias("reference_title"))
    result_df = result_df.groupBy("reference_title").agg(collect_list("articleID").alias("article_list"))
    result_df = reference_map_df.union(result_df)
    result_df = result_df.withColumn("article_list", explode("article_list"))
    result_df = result_df.groupBy("reference_title").agg(collect_list("article_list").alias("article_list"))

    print('Saved and Renewed Reference Map!')
    refer_final = result_df.toPandas()
    output_refer_col_name = "reference_map_{:04d}{:02d}".format(year, month)

    db = client.get_database('reference_map')
    cl = db.get_collection(output_refer_col_name)
    refer_final = refer_final.to_dict('records')
    #cl.insert_many(refer_final)

    return result_df
    
    
def merge_origin_new_df(origin_df, new_df, reference_df):
    print('Merge Progress!')

    union_df = origin_df.union(new_df)
    merged_df = union_df.join(reference_df, array_contains(union_df.refereceTitle, reference_df.reference_title), "left")
    merged_df = merged_df.drop("reference_title")
    return merged_df

def process_grouped_dataframe(input_df):
    print('Final Progress!')
    
    grouped_df = input_df.groupBy("articleID").agg(
    F.first("titleEng").alias("titleEng"),
    F.first("abstractEng").alias("abstractEng"),
    F.first("journalID").alias("journalID"),
    F.first("pubYear").alias("pubYear"),
    F.first("refereceTitle").alias("refereceTitle"),
    F.first("keys").alias("keys_list"),
    F.first("ems").alias("ems_list"),
    collect_list("article_list").alias("article_list")
    )

    # "article_list" 컬럼에서 중복 제거 및 고유 값으로 변환하는 함수 정의
    @udf(ArrayType(StringType()))
    def remove_duplicates_and_make_unique(arr):
        unique_values = set()
        for sublist in arr:
            for item in sublist:
                unique_values.add(item)
        return list(unique_values)

    grouped_df = grouped_df.withColumn("article_list", remove_duplicates_and_make_unique("article_list"))

    # "articleID"가 "article_list" 컬럼 내에 있는 경우 제거하는 함수 정의
    @udf(ArrayType(StringType()))
    def remove_article_id_from_list(article_list, article_id):
        return [item for item in article_list if item != article_id]

    # "articleID"가 "article_list" 컬럼 내에 있는 경우 제거
    grouped_df = grouped_df.withColumn("article_list",remove_article_id_from_list("article_list", grouped_df["articleID"]))

    return grouped_df
    
    
def save_final_kci_data(final_df):
    final = final_df.toPandas()
    output_col_name = "kci_CcGraph{:04d}{:02d}".format(year, month)
    db = client.get_database('kci_ccGraph')
    cl = db.get_collection(output_col_name)
    final = final.to_dict('records')
    cl.insert_many(final)
    print("saved ",output_col_name,"!")

def generate_and_save_graph(df):
    print("Generate CcGrpah")
    G = nx.Graph()

    for row in df.rdd.collect():
        article_id = row['articleID']
        G.add_node(article_id)

    # 아티클 리스트를 기준으로 엣지(링크)를 추가
    for row in df.rdd.collect():
        article_id = row['articleID']
        article_list = row['article_list']
        for reference in article_list:
            G.add_edge(article_id, reference)
            
    graphname = "CcGraph{:04d}{:02d}.graphml".format(year, month)
    nx.write_graphml(G, graphname)
    print('Saved',graphname)

previous_col_name = "kci_trained_{:04d}{:02d}".format(year, one_month_ago)
current_col_name = "kci_trained_{:04d}{:02d}".format(year, month)


origin_df = get_kci_data(previous_col_name)
new_df = get_kci_data(current_col_name)
refer_df = get_reference_map_data()
renew_df = renew_reference_map_data(new_df, refer_df)
merged_df = merge_origin_new_df(origin_df, new_df, refer_df)
result_df = process_grouped_dataframe(merged_df)
#save_final_kci_data(result_df)
#generate_and_save_graph(result_df)
