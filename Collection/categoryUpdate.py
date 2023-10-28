# import libraries from selenium
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import datetime
import re
import time
from datetime import datetime
import pandas as pd
from pymongo import MongoClient
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("preprocessingSpark").getOrCreate()
# define category titles
category_mappings = {
#    "cs.AI": "AI",
    "cs.CC": "Computation",
    "cs.CE": "Computation",
    "cs.CV": "Computer Vision",
    "cs.CR": "Security",
    "cs.DS": "Data Structure",
    "cs.DB": "Databases",
    "cs.DM": "Mathematics",
    "cs.GR": "Graphics",
    "cs.AR": "Hardware",
    "cs.LG": "ML",
    # "cs.MM": "Multimedia", # exclude
    "cs.OS": "Operating System",
    # "cs.OH": "Other CS",
    "cs.PL": "Programming Language",
    "cs.RO": "Robotics",
    "cs.NI": "Network",
    "cs.SE": "Software"
}

queryList = [
#           "cs.AI", 
             "cs.DB", "cs.CV", "cs.CR"
             "cs.CC", "cs.CE", 
            "cs.DS", "cs.DM",
             "cs.GR", "cs.AR", 
            "cs.LG", # "cs.MM", "cs.OH",
             "cs.OS", "cs.PL", 
            "cs.RO", "cs.NI", "cs.SE"
             ]
             
data_list = []

# Chrome WebDriver 초기화 및 실행
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless')  # GUI 없이 실행할 경우 추가 (EC2에서 headless 모드 권장)
chrome_options.add_argument('--no-sandbox')  # Sandboxing 오류 해결을 위해 필요한 옵션
chrome_options.add_argument('--disable-dev-shm-usage')  # /dev/shm 사용 비활성화

driver = webdriver.Chrome(options=chrome_options)
wait = WebDriverWait(driver, 20)

# 월별 링크 출입
currentDate = datetime.now()
searchDate = currentDate.strftime("%y%m")
# currentDate = datetime.date.today().strftime("%y%m")

# 논문 링크 수집
for count in range(0, 101, 100):
# count = 0
    url = f'https://arxiv.org/list/cs/{searchDate}?skip={count}&show=25' 
    driver.get(url)
    
    linkList = []
    linkFind = driver.find_elements(By.CLASS_NAME, 'list-identifier')
    time.sleep(2)
    
    for link in linkFind:
        linkLoc = link.find_element(By.TAG_NAME, "a").get_attribute("href")
        linkList.append(linkLoc)
        # print(linkLoc)
    time.sleep(2)
    print(len(linkList))
    
    # 링크별 논문 정보 추출
    for abstract in linkList:
        driver.get(abstract)
        time.sleep(2)
    
        try:
            infoBox = wait.until(EC.presence_of_element_located((By.ID, "abs")))
            infoBox = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "abs")))
            time.sleep(4)
    
            # infoBox = wait.until(EC.presence_of_element_located((By.ID, "abs")))
            # infoBox = driver.find_element(By.ID, "abs")
    
            title = infoBox.find_element(By.TAG_NAME, "h1")
            abstract = infoBox.find_element(By.TAG_NAME, "blockquote")
            # mainSubject = infoBox.find_element(By.CLASS_NAME, "primary-subject")
            subjectGroup = infoBox.find_element(By.CLASS_NAME, "subjects")
            time.sleep(2)
            print("subject Group: ", subjectGroup.text)
    
            # 정규식 패턴을 사용하여 cs.으로 시작하는 단어 추출
            # 카테고리 네이밍
            namingCat = re.findall(r'cs\.[A-Z]+', subjectGroup.text)
            filteredCat = [category for category in namingCat 
                              if category.startswith('cs.')]
            print("filtered Category: ", filteredCat)
            if not filteredCat:
                continue
            else:
                data = {}
                for i in range(len(filteredCat)):
                    if filteredCat[i] in queryList:
                        cat = filteredCat[i]
                        data = {'titleEng': title.text,
                                'abstractEng': abstract.text,
                                'inCScategory': filteredCat,
                                'label': category_mappings.get(cat, cat)}
                        break
            data_list.append(data)
            time.sleep(2)
    
        except TimeoutException:
            # 요소가 발견되지 않았을 때 수행할 작업
            print(link, "요소를 찾을 수 없습니다. 다음 작업을 수행합니다.")
            break

driver.quit()

# DataFrame 생성 및 저장
df = pd.DataFrame(data_list)
fileName = currentDate.strftime("category_%y%m")  
#df.to_csv(f'{fileName}.csv', index=False, encoding='utf-8')
print(f'Data saved to {fileName}.csv')

# 몽고디비 전송
client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)
categoryDB = client.get_database('category')
categoryClient = categoryDB.get_collection(fileName) 
df = df.to_dict('records')
categoryClient.insert_many(df)
print("categoryDB's Collection: ", client.category.list_collection_names())
