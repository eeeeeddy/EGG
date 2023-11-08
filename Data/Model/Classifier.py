from transformers import DistilBertModel, DistilBertTokenizer
import torch.nn as nn
import torch
import numpy as np
import datetime
import pandas as pd
from keybert import KeyBERT
from pymongo import MongoClient
from tqdm import tqdm
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("preprocessingSpark").getOrCreate()

class DistilBertClassifier(nn.Module):
    def __init__(self, dropout=0.5):
        super(DistilBertClassifier, self).__init__()
        self.distilbert = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.dropout = nn.Dropout(dropout)
        self.linear = nn.Linear(768, 14)
        self.relu = nn.ReLU()

    def forward(self, input_ids, attention_mask):
        outputs = self.distilbert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.last_hidden_state.mean(dim=1)  # Use mean pooling for sentence representation
        dropout_output = self.dropout(pooled_output)
        linear_output = self.linear(dropout_output)
        final_layer = self.relu(linear_output)
        return final_layer

# 토크나이저 설정 : distilbert-base-uncased 모델
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
labels = {
    0: "Computation",
    1: "Computer Vision",
    2: "Security",
    3: "Data Structure",
    4: "Databases",
    5: "Mathematics",
    6: "Graphics",
    7: "Hardware",
    8: "ML",
    9: "Operating System",
    10: "Programming Language",
    11: "Robotics",
    12: "Network",
    13: "Software"
}
def import_dataframe():
    current_datetime = datetime.datetime.now()
    year = current_datetime.year
    month = current_datetime.month
    input_col_name = "kci_{:04d}{:02d}".format(year, month)
    kci_db_name = "kci_api"
    
    kci_db = client[kci_db_name]
    kci_data = list(kci_db[input_col_name].find({}))
    
    df = pd.DataFrame(kci_data)
    df['posts'] = df['titleEng'] + df['abstractEng']
    
    return df



def predict_class(text):
    # GPU 사용 가능 여부 확인
    if torch.cuda.is_available():
        device = torch.device('cuda')
    else:
        device = torch.device('cpu')

    # 텍스트 토큰화 및 패딩
    inputs = tokenizer(text, padding='max_length', max_length=512, truncation=True, return_tensors="pt")

    # 모델 예측
    with torch.no_grad():
        inputs = inputs.to(device)
        outputs = model(inputs['input_ids'], inputs['attention_mask'])

    # 예측 결과
    predicted_class = torch.argmax(outputs, dim=1).item()

    
    # 레이블 딕셔너리를 이용하여 클래스 이름 가져오기
    predicted_label = labels[predicted_class]

    return predicted_label


def categori_classifier(df):
    res_class = []
    for i in tqdm(range(len(df))):
        res_class.append(predict_class(df['posts'][i]))
    
    df['class'] = res_class
    return df
    
    
def extract_keywords(text, ngram_range=(1, 5), use_mmr=True, top_n=5, diversity=1):
    # 텍스트를 GPU로 이동
    keywords = Kmodel.extract_keywords(
        text, keyphrase_ngram_range=ngram_range, use_mmr=use_mmr, top_n=top_n, diversity=diversity
    )
    return [keyword[0] for keyword in keywords]


def extract_keywords_for_df(df):
    res_keywords = []
    for i in tqdm(range(len(df))):
        res_keywords.append(extract_keywords(df['posts'][i]))
    df['keys'] = res_keywords
    return df
    
    
def trans_embeding(k1):
    # GPU 사용 가능 여부 확인
    if torch.cuda.is_available():
        device = torch.device('cuda')
        model.to(device)
    else:
        device = torch.device('cpu')

    # 입력 문장을 하나의 문자열로 결합
    word_str = ' '.join(k1)

    # 토크나이저로 입력 데이터 준비
    inputs1 = tokenizer(word_str, padding='max_length', max_length=512, truncation=True, return_tensors="pt")

    # 모델 예측
    
    with torch.no_grad():
        inputs1 = inputs1.to(device)
        outputs1 = model(inputs1['input_ids'], inputs1['attention_mask'])

    # 결과를 CPU로 이동 (만약 GPU에서 처리한 결과를 CPU로 가져오려면)
    outputs1 = outputs1.to('cpu')

    word_embeddings1 = outputs1[0]

    # 벡터 리스트를 NumPy 배열로 변환
    vector1 = np.array(word_embeddings1)

    return vector1



def extract_embedding_for_df(df):
    res_keywords_em = []
    for i in tqdm(range(len(df))):
        res_keywords_em.append(trans_embeding(df['keys'].iloc[i]))
    df['ems'] = res_keywords_em
    df['ems'] = df['ems'].apply(lambda x: x.tolist())
    return df


def save_df(df):
    current_datetime = datetime.datetime.now()
    year = current_datetime.year
    month = current_datetime.month
    output_col_name = "kci_trained_{:04d}{:02d}".format(year, month)
    
    db = client.get_database('kci_trained_api')
    cl = db.get_collection(output_col_name)
    dict_df = df.to_dict('records')
    cl.insert_many(dict_df)
    print('save : ',output_col_name)

    

model = DistilBertClassifier()
model.load_state_dict(torch.load('/home/ubuntu/Ditto/Egg/Model/train_model.pt',map_location='cpu'))
Kmodel = KeyBERT(model)

client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)

df = import_dataframe()
cdf = categori_classifier(df)
kdf = extract_keywords_for_df(cdf)
edf = extract_embedding_for_df(kdf)
save_df(edf)
