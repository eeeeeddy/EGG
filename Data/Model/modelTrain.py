
from transformers import DistilBertModel, DistilBertTokenizer
import torch.nn as nn
import torch
import numpy as np
from transformers import DistilBertTokenizer, DistilBertModel
from torch.optim import Adam
from tqdm import tqdm
import datetime
from pymongo import MongoClient
import pandas as pd
import calendar

client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)

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
    "Computation": 0,
    "Computer Vision": 1,
    "Security": 2,
    "Data Structure": 3,
    "Databases": 4,
    "Mathematics": 5,
    "Graphics": 6,
    "Hardware": 7,
    "ML": 8,
    "Operating System": 9,
    #"Other CS": 10,
    "Programming Language": 10,
    "Robotics": 11,
    "Network": 12,
    "Software": 13
}

class Dataset(torch.utils.data.Dataset):

    def __init__(self, df):
        # label 리스트 생성
        self.labels = [labels[label] for label in df['label']]
        # df[posts]의 value를 순차적으로 가져와서 토큰화, padding = 512 설정
        self.texts = [tokenizer(text,
                                padding='max_length', max_length=512, truncation=True,
                                return_tensors="pt") for text in df['Title']]

    def classes(self):
        # 레이블 리스트 반환
        return self.labels

    def __len__(self):
        # 레이블 리스트 길이 반환
        return len(self.labels)

    def get_batch_labels(self, idx):
        # idx에 해당하는 배치 레이블을 numpy 배열로 변환
        return np.array(self.labels[idx])

    def get_batch_texts(self, idx):
        # idx에 해당하는 토큰화된 텍스트 배치를 반환
        return self.texts[idx]

    def __getitem__(self, idx):
        batch_texts = self.get_batch_texts(idx)
        batch_y = self.get_batch_labels(idx)

        return batch_texts, batch_y
        

def train(model, train_data, val_data, learning_rate, epochs):
    train, val = Dataset(train_data), Dataset(val_data)

   # 주어진 데이터셋을 배치 단위로 분할,셔플
    train_dataloader = torch.utils.data.DataLoader(train, batch_size=2, shuffle=True)
    val_dataloader = torch.utils.data.DataLoader(val, batch_size=2)

    # cpu 사용
    use_cuda = torch.cuda.is_available()
    device = torch.device("cuda" if use_cuda else "cpu")

    # 손실함수 및 최적화 설정
    # 소프트 맥스 내부적 |수행 -> 모델 출력을 확률값으로 변환 -> 손실 계산 -> 역전파 알고리즘을 통해 모델 가중치 업데이트
    criterion = nn.CrossEntropyLoss()
    # 경사 하강법
    optimizer = Adam(model.parameters(), lr= learning_rate)

    if use_cuda:
            # GPU 사용하여 모델 연산 가속화
            model = model.cuda()
            criterion = criterion.cuda()

    for epoch_num in range(epochs):

            total_acc_train = 0 # 총 정확도
            total_loss_train = 0 # 손실

            # train_input == batch_text
            # train_label == batch_y
            for train_input, train_label in tqdm(train_dataloader):

                # label을 gpu로 이동
                train_label = train_label.to(device)
                mask = train_input['attention_mask'].to(device)
                #차원 크기가 1인 차원을 제거하여, input_ids 텐서의 크기를 [batch_size(2),sequence_length(512)]로 조정
                #bert 사용을 위해 차원의 크기가 1인걸 제거해야함
                input_id = train_input['input_ids'].squeeze(1).to(device)


                output = model(input_id, mask) # fit

                # 출력과 정답 레이블 사이의 손실을 계산
                batch_loss = criterion(output, train_label.long())
                # 현재 배치의 손실을 전체 학습 손실에 누적
                total_loss_train += batch_loss.item()
                # 예측 결과와 정답 레이블을 비교하여 정확도를 계산
                acc = (output.argmax(dim=1) == train_label).sum().item()
                total_acc_train += acc

                # 모델의 기울기를 0으로 초기화합니다.
                model.zero_grad()
                #
                batch_loss.backward()
                #
                optimizer.step()

            total_acc_val = 0
            total_loss_val = 0

            # 검증 작업
            with torch.no_grad():

                for val_input, val_label in val_dataloader:

                    val_label = val_label.to(device)
                    mask = val_input['attention_mask'].to(device)
                    input_id = val_input['input_ids'].squeeze(1).to(device)

                    output = model(input_id, mask)

                    batch_loss = criterion(output, val_label.long())
                    total_loss_val += batch_loss.item()

                    acc = (output.argmax(dim=1) == val_label).sum().item()
                    total_acc_val += acc

            print(
                f'Epochs: {epoch_num + 1} | Train Loss: {total_loss_train / len(train_data): .3f} \
                | Train Accuracy: {total_acc_train / len(train_data): .3f} \
                | Val Loss: {total_loss_val / len(val_data): .3f} \
                | Val Accuracy: {total_acc_val / len(val_data): .3f}')

    
def split_data(df):
    # 데이터를 레이블(label)에 따라 정렬하여 그룹화
    def func(g):
        return g.sort_values(by='label', ascending=False)

    grouped_df = df.groupby(['label']).apply(func)

    # 데이터를 train, val, test 세트로 분할
    df_train, df_val, df_test = np.split(grouped_df.sample(frac=1), [int(.8*len(grouped_df)), int(.9*len(grouped_df))])

    return df_train, df_val, df_test

def get_arXiv_data(col_name):
    # 월 데이터 모아와서 합치기
    current_datetime = datetime.datetime.now()
    year = current_datetime.year
    month = current_datetime.month
    #col_name = "category_{:02d}{:02d}".format(year % 100, month)
    #print('Get ',col_name)
    kci_db_name = "category"
    kci_db = client[kci_db_name]
    kci_data = list(kci_db[col_name].find({}))

    if kci_data:
        print('True')
        df = pd.DataFrame(kci_data)
        df.rename(columns={'titleEng': 'Title', 'abstractEng': 'Abstract'}, inplace=True)

         # Title과 Abstract를 합침
        df['Title'] = df['Title'] + df['Abstract']
        df = df[df['label'] != 'AI']
         # Title이 문자열인 행만 유지
        df = df[df['Title'].apply(lambda x: isinstance(x, str))]
        return df
    else:
        df = pd.DataFrame()
        return df


current_datetime = datetime.datetime.now()
year = current_datetime.year
month = current_datetime.month

last_day = calendar.monthrange(year, month)[1]

df = pd.DataFrame()

# combined_df는 모든 데
for day in range(1, last_day + 1):
    col_name = "category_{:02d}{:02d}{:02d}".format(year % 100, month, day)
    temp = get_arXiv_data(col_name)
    if not temp.empty:  # temp가 빈 데이터 프레임이 아닌 경우에만 합칩니다.
        df = pd.concat([df, temp], ignore_index=True)


combined_df.head()

df_train, df_val, df_test = split_data(df)
print(len(df_train), len(df_val), len(df_test))

EPOCHS = 5
pretrained_model = DistilBertClassifier()
pretrained_model.load_state_dict(torch.load("Ditto/Egg/Model/Trained_Model/train_model.pt"))
LR = 1e-6
train(pretrained_model, df_train, df_val, LR, EPOCHS)
torch.save(model.state_dict(), 'Ditto/Egg/Model/Trained_Model/DistilBert_model.pt')
