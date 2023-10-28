from pyspark.sql import SparkSession
import pyspark.sql.functions as F
from pyspark.sql.functions import explode_outer,explode, col, when, size,concat,array, first,arrays_zip
from pyspark.sql.functions import udf, explode, collect_list, size, expr, struct, col, when, array_contains, flatten
from pyspark.sql.types import StringType, ArrayType, StructType, StructField, DoubleType
import numpy as np
import pandas as pd
import ast
import networkx as nx
from pymongo import MongoClient
import datetime

# SparkSession을 생성
spark = SparkSession.builder.appName("PreprocessingSpark").getOrCreate()

# 몽고디비 클라이언트 연결

client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)

# 날짜
current_datetime = datetime.datetime.now()
year = current_datetime.year
month = current_datetime.month
one_month_ago = current_datetime - datetime.timedelta(days=current_datetime.day)
one_month_ago = one_month_ago.month

pd.DataFrame.iteritems = pd.DataFrame.items

# UDF 정의
def parse_lists(list_str):
    return ast.literal_eval(list_str) if list_str.strip() else ['None']

def parse_ems(ems):
    ems = ems.strip('[]').split()
    return [float(val) for val in ems]

# UDF 등록
parse_lists_udf = udf(parse_lists, ArrayType(StringType()))
parse_ems_udf = udf(parse_ems, ArrayType(DoubleType()))


def get_kci_data(df_name):
    print('Get',df_name,"!")
    kci_db_name = "kci_trained_api"
    kci_db = client[kci_db_name]
    kci_data = list(kci_db[df_name].find({}))
    
    pandas_df = pd.DataFrame(kci_data)
    print(pandas_df.columns)
    pandas_df = pandas_df[['articleID','titleKor','journalID','journalName','issn','citations','pubYear','author1ID','author1Name','author1Inst','author2IDs','author2Names','author2Insts', 'class','keywords', 'ems']]

    pandas_df = pandas_df.astype(str)

    spark_df = spark.createDataFrame(pandas_df)
    spark_df = spark_df.withColumn("keywords", parse_lists_udf(spark_df['keywords']))
    spark_df = spark_df.withColumn("ems", parse_ems_udf(spark_df["ems"]))
    spark_df = spark_df.withColumn("author2IDs", parse_lists_udf(spark_df["author2IDs"]))
    spark_df = spark_df.withColumn("author2Names", parse_lists_udf(spark_df["author2Names"]))
    spark_df = spark_df.withColumn("author2Insts", parse_lists_udf(spark_df["author2Insts"]))

    return spark_df


def get_kci_auInfo_data(df_name):
    print('Get',df_name,"!")
    kci_db_name = "kci_author_info"
    kci_db = client[kci_db_name]
    kci_data = list(kci_db[df_name].find({}))

    pandas_df = pd.DataFrame(kci_data)
    print(pandas_df.columns)
    pandas_df = pandas_df[['authorID', 'kiiscArticles','totalArticles', 'if', 'H-index']]
    pandas_df = pandas_df.astype(str)
    spark_df = spark.createDataFrame(pandas_df)

    return spark_df

def merge_df(origin_df , new_df):
    print("Merge!")
    union_df = origin_df.union(new_df)
    return union_df

def exploded_df(df):
    print('Exploded!')
    exploded_df = df.withColumn("temp", explode_outer(arrays_zip("author2IDs", "author2Names", "author2Insts"))) \
        .drop("author2IDs", "author2Names", "author2Insts") \
        .selectExpr("*", "temp.*") \
        .withColumnRenamed("author2IDs", "author2ID") \
        .withColumnRenamed("author2Names", "author2Name") \
        .withColumnRenamed("author2Insts", "author2Inst") \
        .drop("temp")
        
    print(exploded_df.columns)
    result_df = exploded_df.select(
        "articleID",
        "titleKor",
        "journalID",
        "journalName",
        "issn",
        "citations",
        "pubYear",
        "author1ID",
        "author1Name",
        "author1Inst",
        "author2ID",
        "author2Name",
        "author2Inst",
        'class',
        'keywords',
        'ems'
        )
#    result_df = result_df.dropDuplicates(["articleID", "author1ID","author1Name", "author2ID","author2Name"])
    return result_df


def joined_df(df):
    print("Outer join")
    df = df.dropDuplicates(["articleID", "author1ID", "author2ID"])

    # authorID 종합
    df1 = df.select("author1ID","author1Name","author1Inst")
    df2 = df.select("author2ID","author2Name","author2Inst")
    merged_df = df1.union(df2).withColumnRenamed("author1ID", "authorID")
    merged_df = merged_df.dropDuplicates(["authorID"])
    merged_df = merged_df.distinct().na.drop()

    selected_columns = df.select(
        "author1ID",
        "author2ID",
        "articleID",
        "titleKor",
        "journalID",
        "journalName",
        "pubYear",
        "citations",
        "class",
        "keywords",
        "ems"
    )
    joined_df = merged_df.join(selected_columns, merged_df.authorID == selected_columns.author1ID, "outer")

    return joined_df

def grouping(df):
    print("Grouping")
    grouped_df = df.groupBy("authorID", "author1Name","author1Inst").agg(
        collect_list("articleID").alias("articleIDs"),
        collect_list("titleKor").alias("titleKor"),
        collect_list("author2ID").alias("with_author2IDs"),
        collect_list("author1ID").alias("with_author1IDs"),
        collect_list("citations").alias("citations"),
        collect_list("journalID").alias("journalIDs"),
        collect_list("pubYear").alias("pubYears"),
        collect_list("class").alias("class"),
        collect_list("keywords").alias("word_cloud"),
        first("ems").alias("ems")

    )
    grouped_df = grouped_df.withColumn("with_author1IDs", array())
    grouped_df = grouped_df.withColumn("word_cloud", flatten(grouped_df["word_cloud"]))

    return grouped_df
    

def join_author_info(grouped_df, author_info_df):
    joined_df = grouped_df.join(author_info_df, on="authorID", how="left")
    drop_column = ['authorName','authorInst']
    joined_df = joined_df.drop(*drop_column)
    joined_df = joined_df.withColumnRenamed("if", "impactfactor")
    joined_df = joined_df.withColumnRenamed("H-index", "H_index")
    joined_df = joined_df.withColumnRenamed("class", "category")
    return joined_df


def save_final_kci_data(final_df):
    final = final_df.toPandas()
    output_col_name = "kci_AuGraph_{:04d}{:02d}".format(year, month)
    db = client.get_database('kci_AuGraph')
    cl = db.get_collection(output_col_name)
    final = final.to_dict('records')
    cl.insert_many(final)
    print("saved ",output_col_name,"!")


def generate_and_save_graph(df):
    print("Generate AuGraph")
    G = nx.Graph()

    # 저자 아이디 노드 추가
    for row in df.rdd.collect():
        article_id = row['authorID']
        G.add_node(article_id)

    # with_author2IDs를 기준으로 엣지 추가
    for row in df.rdd.collect():
        author_id = row['authorID']
        author_list = row['with_author2IDs']
        for reference in author_list:
            G.add_edge(author_id, reference)
    
    graphname = "AuGraph{:04d}{:02d}.graphml".format(year, month)
    nx.write_graphml(G, graphname)
    print('Saved', graphname)


previous_col_name = "kci_trained_{:04d}{:02d}".format(year, one_month_ago)
current_col_name = "kci_trained_{:04d}{:02d}".format(year, month)
previous_col_name_author_info = "author_{:04d}{:02d}".format(year, month)

origin_df = get_kci_data(previous_col_name)
new_df = get_kci_data(current_col_name)
author_df = get_kci_auInfo_data(previous_col_name_author_info)
merged_df = merge_df(origin_df, new_df)
exploded_df = exploded_df(merged_df)
joined_df = joined_df(exploded_df)
grouped_df = grouping(joined_df)
final_df = join_author_info(grouped_df, author_df)
#save_final_kci_data(final_df)
#generate_and_save_graph(grouped_df)
