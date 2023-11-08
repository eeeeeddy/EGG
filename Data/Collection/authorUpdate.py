from selenium.webdriver.common.by import By
import re
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
import time
import ast
import pandas as pd
import datetime
from pyspark.sql import SparkSession
from pymongo import MongoClient

spark = SparkSession.builder.appName("preprocessingSpark").getOrCreate()

# 저자 정보 크롤링
# 0. 저자 리스트
# 초기 파일
# kci = pd.read_csv('kci_00to22.csv')
client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)
# 업데이트 이후 파일
currentDate = datetime.datetime.now()
kci_file = currentDate.strftime ("kci_%Y%m")
#kci = pd.read_csv(f'{kci_file}.csv')
kci_db_name = "kci_api"
kci_db = client[kci_db_name]
kci_data = list(kci_db[kci_file].find({}))
kci = pd.DataFrame(kci_data)





authorID = kci['author1ID'].tolist()

# 1. 저자 정보 크롤링 접속
from selenium import webdriver
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless')  # GUI 없이 실행할 경우 추가 (EC2에서 headless 모드 권장)
chrome_options.add_argument('--no-sandbox')  # Sandboxing 오류 해결을 위해 필요한 옵션
chrome_options.add_argument('--disable-dev-shm-usage')  # /dev/shm 사용 비활성화

driver = webdriver.Chrome(options=chrome_options)

wait = WebDriverWait(driver, 20)
loginUrl = 'https://www.kci.go.kr/kciportal/po/member/popup/loginForm.kci'
driver.get(loginUrl)

# 2. 로그인 정보
username = 'tomoo56'
password = 'kmhalsgml1!'

# 3. 로그인 정보 입력 및 전송
userID = driver.find_element(By.NAME, "uid")
userPW = driver.find_element(By.NAME, "upw")
userID.send_keys(username)
userPW.send_keys(password)
loginBtn = driver.find_element(By.CSS_SELECTOR, '.login_bt01.individual_type a.btns.blueBtn')
loginBtn.click()
time.sleep(2)


# 4. 저자 정보 수집 리스트 선언
name = []
finalData = []

# 5. 크롤링 시작
# authorID = ['CRT001880839', 'CRT001880851']
for id in authorID:
    targetUrl = f'https://www.kci.go.kr/kciportal/po/citationindex/poCretDetail.kci?citationBean.cretId={id}'
    driver.get(targetUrl)
    time.sleep(2)
 
    rightArea = driver.find_elements(By.CSS_SELECTOR,'div.table_wrap table.table_dotted tbody tr')
    time.sleep(2)
    data = {}
    
    for i in rightArea:
        data['authorID'] = id
        if 'authorID' not in name:
            name.append('authorID')
        
        colName = i.find_element(By.CSS_SELECTOR, 'th').text
        colVal = i.find_element(By.CSS_SELECTOR, 'td').text

        if colName == '총 논문 수 (전체년도)':
            colName = 'totalArticles'
            data[colName] = colVal
            if colName not in name:
                name.append(colName)

        elif colName == '총 피인용 횟수':
            colName = 'if'
            data[colName] = colVal
            if colName not in name:
                name.append(colName)

        elif colName.startswith('H 지수'):
            colName = 'H-index'
            data[colName] = colVal
            if colName not in name:
                name.append(colName)

    finalData.append(data)
    print(finalData)

driver.quit()


authorUpdate = pd.DataFrame(finalData, columns = name)

client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)

current_datetime = datetime.datetime.now()
year = current_datetime.year
one_month_ago = current_datetime - datetime.timedelta(days=current_datetime.day)
one_month_ago = one_month_ago.month

author_file =  "author_{:04d}{:02d}".format(year, one_month_ago)

kci_db_name = "kci_author_info"
authorDB = client[kci_db_name]
kci_data = list(authorDB[author_file].find({}))

authorClient = authorDB.get_collection(author_file)
original = pd.DataFrame(kci_data)
new_data_list = [] 


for entry in finalData:
    authorID = entry['authorID']
    if authorID in original['authorID'].tolist():
        # Update existing data with new data based on 'authorID'
        original.loc[original['authorID'] == authorID, 'totalArticles'] = entry['totalArticles']
        original.loc[original['authorID'] == authorID, 'if'] = entry['if']
        original.loc[original['authorID'] == authorID, 'H-index'] = entry['H-index']
    else:
        # Add new data as a new row
        #original = original.append(entry, ignore_index=True)
        new_data_list.append(entry)

new_data = pd.DataFrame(new_data_list)

original = pd.concat([original, new_data], ignore_index=True)        

# Save the updated data back to the CSV file
#original.to_csv('authorOriginal.csv', index=False)

print(original.head(3))

currentDate = datetime.datetime.now()
author_file = currentDate.strftime("author_%Y%m")
client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)
authorDB = client.get_database('kci_author_info')
authorClient = authorDB.get_collection(author_file)
#originalData = .to_dict('records')




print(client.list_database_names())

print(client.kci_author_info.list_collection_names())
