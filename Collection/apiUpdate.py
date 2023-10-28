# 0. 필요 라이브러리 호출
import requests
import urllib.parse
import bs4
import urllib3
import pandas as pd
import datetime

from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.sql import Row
from pymongo import MongoClient

# use spark interpreter
spark = SparkSession.builder.appName("apiUpdate").getOrCreate()

# 0. 기본
urllib3.disable_warnings()
key = '27625826'
institution = urllib.parse.quote_plus('한국정보과학회')
# 기본 url = f'https://open.kci.go.kr/po/openapi/openApiSearch.kci?apiCode=articleSearch&key={key}&page={page}&institution={institution}&displayCount={show}'


# 1. 공백 정의 함수
def handle_empty(value):
    if not value.strip():
        return "N/A"
    return value

# 2-1. 추가 데이터 : 논문 수, 페이지 수 설정
def getPage_dateTime():
    # 날짜를 원하는 형식으로 변환 (YYYYMMDD)
    currentDate = datetime.date.today()
    aMonthago = currentDate - datetime.timedelta(days=30)
    datefrom = aMonthago.strftime("%Y%m%d")
    dateto = currentDate.strftime("%Y%m%d")

    # 논문 수 확인
    url = f'https://open.kci.go.kr/po/openapi/openApiSearch.kci?apiCode=articleSearch&key={key}' \
          f'&regDateFrom={datefrom}&regDateTo={dateto}&institution={institution}'
    response = requests.get(url, verify=False)
    contents = response.text
    xml_obj = bs4.BeautifulSoup(contents, 'lxml-xml')
    totalArticle = xml_obj.find('result').text
    totalArticle = int(totalArticle)
    print("Get total articles: ", totalArticle)

    # 논문 수에 맞는 페이지 수 확인
    pages = 1
    displayCnt = [100, 50, 20, 10]
    for show in displayCnt:
        if totalArticle >= show:
            pages = totalArticle // show
            if totalArticle % show != 0:
                pages += 1
            break
    # 결론
    formerURL = f'https://open.kci.go.kr/po/openapi/openApiSearch.kci?apiCode=articleSearch&key={key}&page='
    latterURL = f'&regDateFrom={datefrom}&regDateTo={dateto}&institution={institution}&displayCount={show}'
    print("show: ", show, ", total pages: ", pages+1)
    print("URL ready to start.")

    return formerURL, latterURL, pages

# 3. 기본 정보
def basicAPI(formerURL, latterURL, pages):
    basicData = []
    for page in range(1, pages+1):
        exploreUrl = formerURL + str(page) + latterURL
        response = requests.get(exploreUrl, verify=False)
        contents = response.text
        xml_obj = bs4.BeautifulSoup(contents, 'lxml-xml')
        rows = xml_obj.findAll('record')

        if page % 10 == 0:
            print("page: ", page)

        for row in rows:
            j = row.find("journalInfo")
            jname = handle_empty(j.find("journal-name").text)
            jpub = handle_empty(j.find("publisher-name").text)
            jyear = handle_empty(j.find("pub-year").text)
            jmon = handle_empty(j.find("pub-mon").text)
            jvol = handle_empty(j.find("volume").text)
            jissue = handle_empty(j.find("issue").text)

            a = row.find("articleInfo")
            aID = a.get('article-id')
            aCate = handle_empty(a.find("article-categories").text)
            aRegul = handle_empty(a.find("article-regularity").text)
            fpage = handle_empty(a.find("fpage").text)
            lpage = handle_empty(a.find("lpage").text)
            # doi = handle_empty(a.find("doi").text)
            # uci = handle_empty(a.find("uci").text)
            cita = handle_empty(a.find("citation-count").text)
            url = handle_empty(a.find("url").text)
            verified = handle_empty(a.find("verified").text)

            # title
            t = a.find("title-group")
            tKor = handle_empty(t.find("article-title", lang="original").text)
            tEng = handle_empty(t.find("article-title", lang="english").text) if t.find(
                "article-title", lang="english") else "N/A"

            # abstract
            abstr = a.find("abstract-group")
            aKor = handle_empty(abstr.find("abstract", lang="original").text)
            aEng = handle_empty(abstr.find("abstract", lang="english").text) if abstr.find(
                "abstract", lang="english") else "N/A"

            # author
            ath = a.find_all("author")
            athG = [author.get_text() for author in ath]

            data = {'articleID': aID,
                    'journalName': jname,
                    'journalPublisher': jpub,
                    'pubYear': jyear,
                    'pubMon': jmon,
                    'volume': jvol,
                    'issue': jissue,
                    'articleCategories': aCate,
                    'articleRegularity': aRegul,
                    'titleKor': tKor,
                    'titleEng': tEng,
                    'authors': athG,
                    'abstractKor': aKor,
                    'abstractEng': aEng,
                    'fpage': fpage,
                    'lpage': lpage,
                    # 'doi': doi,
                    # 'uci': uci,
                    'citations': cita,
                    'url': url,
                    'verified': verified
                    }
            basicData.append(data)
    backDF = pd.DataFrame(basicData)
    return backDF

# 4. 기본 전처리
def preprocessing(backDF):

    back = backDF.copy()

    # 널 개수 확인
    print("Null Count: ", back.isnull().sum())

    # 'abstractEng'와 'titleEng' 열 값이 없는 행 제거
    back.dropna(subset=['abstractEng', 'titleEng'], inplace=True)

    # unique articleID의 개수 확인
    uniqueCount = len(back['articleID'].unique())
    print("backDF - uniqueCount is: ", uniqueCount)

    # 'articleID' 기준으로 중복 데이터 삭제
    back.drop_duplicates(subset=['articleID'], inplace=True)

    # 데이터프레임 정보 확인
    print("after drop duplicates: ")
    print(back.info())
    return back

# 5. 상세 정보
def detailAPI(back):
    articleIDs = back['articleID'].tolist()
    print(len(articleIDs), "IDs ready.")

    detailData = []
    count = 0
    # articleIDs = ['ART001652148', 'ART001642115']
    for id in articleIDs:
        url = f'https://open.kci.go.kr/po/openapi/openApiSearch.kci?apiCode=articleDetail&key={key}&id={id}'
        response = requests.get(url, verify=False)
        contents = response.text
        xml_obj = bs4.BeautifulSoup(contents, 'lxml-xml')
        rows = xml_obj.findAll('record')
        count += 1
        for row in rows:
            j = row.find('journalInfo')
            jID = handle_empty(j.get('journal-id'))
            issn = handle_empty(j.find('issn').text)
            jName = handle_empty(j.find('journal-name').text)
            kciRegi = handle_empty(j.find('kci-registration').text)
            pubYear = handle_empty(j.find('pub-year').text)
            pubMon = handle_empty(j.find('pub-mon').text)
            jVol = handle_empty(j.find('volume').text)
            jIssue = handle_empty(j.find('issue').text)

            a = row.find('articleInfo')
            category = a.find('article-categories').text.split(' > ')
            category1 = category[0] if len(category) > 0 else None
            category2 = category[1] if len(category) > 1 else None
            regularity = handle_empty(a.find('article-regularity').text)
            lang = handle_empty(a.find('article-language').text)

            keyword = [element.text for element in a.find('keyword-group').find_all('keyword')]
            f = handle_empty(a.find('fpage').text)
            l = handle_empty(a.find('lpage').text)
            doi = handle_empty(a.find('doi').text if a.find('doi') is not None else 'N/A')
            uci = handle_empty(a.find('uci').text if a.find('uci') is not None else 'N/A')
            citations = handle_empty(a.find('citation-count').text)
            url = handle_empty(a.find('url').text)
            verified = handle_empty(a.find('verified').text)

            # author 1
            authors = a.find('author-group')
            a1 = authors.find('author', {'author-division': '1'})
            aID = a1.get('author-id')
            aName = a1.find('name').text
            aInst = a1.find('institution').text

            # author 2
            authorG = authors.find_all('author', {'author-division': '2'})
            aG_id = [author.get('author-id') for author in authorG]
            aG_name = [author.find('name').text for author in authorG]
            aG_insts = [author.find('institution').text for author in authorG]

            # references
            ref = row.find('referenceInfo')
            if ref is not None:
                refG = ref.find_all('reference')
                rID = [reference.get('refebibl-id') for reference in refG]
                rTypeCode = [reference.get('type-code') for reference in refG]
                rTypeName = [reference.get('type-name') for reference in refG]
                rTitle = [reference.find('title').text for reference in refG]
                # rAuthor = [reference.find('author').text for reference in refG]
                rAuthor = [author.split(' ; ') if ' ; ' in author else [author] for author in
                           [reference.find('author').text for reference in refG]]
                rJournal = [reference.find('journal-name').text if reference.find('journal-name') else None for
                            reference in refG]
                rPublisher = [reference.find('pubilisher').text if reference.find('pubilisher') else None for reference
                              in refG]
                rDate = [reference.find('pubi-year').text if reference.find('pubi-year') else None for reference in
                         refG]
                rVol = [reference.find('volume').text if reference.find('volume') else None for reference in refG]
                rIssue = [reference.find('isseue').text if reference.find('isseue') else None for reference in refG]
                rVolIss = [f'{rVol[i] if rVol[i] else ""}({rIssue[i] if rIssue[i] else ""})' for i in range(len(rVol))]
                rPage = [reference.find('page').text if reference.find('page') else None for reference in refG]
            else:
                rID = rTypeCode = rTypeName = rTitle = rAuthor = rJournal = rPublisher = rDate = rVol = rIssue = rVolIss = rPage = []

            data = {'articleID': id,
                    'journalID': jID,
                    'issn': issn,
                    'journalName': jName,
                    'kciRegistration': kciRegi,
                    'pubYear': pubYear,
                    'pubMon': pubMon,
                    'pubDate': f'{pubYear}-{pubMon}',
                    'volume': jVol,
                    'issue': jIssue,
                    'vol_issue': f'{jVol}({jIssue})',
                    'category': category,
                    'category1': category1,
                    'category2': category2,
                    'articleRegularity': regularity,
                    'laguage': lang,

                    'author1ID': aID,
                    'author1Name': aName,
                    'author1Inst': aInst,
                    'author2IDs': aG_id,
                    'author2Names': aG_name,
                    'author2Insts': aG_insts,

                    'keywords': keyword,
                    'fpage': f, 'lpage': l, 'page': f'{f}-{l}',
                    'doi': doi, 'uci': uci,
                    'citations': citations,
                    'url': url, 'verified': verified,

                    'refereceID': rID,
                    'refereceTypeCode': rTypeCode,
                    'refereceTypeName': rTypeName,
                    'refereceTitle': rTitle,
                    'refereceAuthor': rAuthor,
                    'refereceConfJournal': rJournal,
                    'referecePublisher': rPublisher,
                    'referecePubDate': rDate,
                    'refereceVolume': rVol,
                    'refereceIssue': rIssue,
                    'refereceVolIss': rVolIss,
                    'referecePage': rPage,
                    }

            detailData.append(data)
    detail = pd.DataFrame(detailData)
    print("detail Information: ", count)

    # unique articleID의 개수 확인
    detailUniqueCount = len(detail['articleID'].unique())
    print("detailDF - uniqueCount is: ", detailUniqueCount)

    return detail

# 6. 레퍼런스 정보
def refDFcreate(detail):
    # reference 정보 추출
    references = []
    for index, row in detail.iterrows():
        articleID = row['articleID']
        referenceIDs = row['refereceID']
        referenceTypeCodes = row['refereceTypeCode']
        referenceTypeNames = row['refereceTypeName']
        referenceTitles = row['refereceTitle']
        referenceAuthors = row['refereceAuthor']
        referenceConfJournals = row['refereceConfJournal']
        referencePublishers = row['referecePublisher']
        referencePubDates = row['referecePubDate']
        referenceVolumes = row['refereceVolume']
        referenceIssues = row['refereceIssue']
        referenceVolIss = row['refereceVolIss']
        referencePages = row['referecePage']

        # 레퍼런스 정보가 여러 개인 경우 각각의 정보를 리스트로 묶어서 추가
        for i in range(len(referenceIDs)):
            references.append([
                articleID,
                handle_empty(referenceIDs[i]),
                handle_empty(referenceTypeCodes[i]),
                handle_empty(referenceTypeNames[i]),
                handle_empty(referenceTitles[i]),
                referenceAuthors[i],
                referenceConfJournals[i],
                referencePublishers[i],
                referencePubDates[i],
                referenceVolumes[i],
                referenceIssues[i],
                referenceVolIss[i],
                referencePages[i]
            ])

    # reference 데이터 프레임 생성
    refDF = pd.DataFrame(references, columns=[
        'articleID', 'referenceID', 'referenceTypeCode', 'referenceTypeName',
        'referenceTitle', 'referenceAuthor', 'referenceConfJournal', 'referencePublisher',
        'referencePubDate', 'referenceVolume', 'referenceIssue', 'referenceVolIss', 'referencePage'
    ])

    return refDF

# 7. kci
def mergeAPI(back, detail):
    # back <- 컬럼 추가
    doiuci = detail[['articleID', 'doi', 'uci']]
    newBack = pd.merge(back, doiuci, on='articleID', how='right')

    # kci = basic + detail 데이터 프레임 저장
    basic = back[['articleID', 'titleKor', 'titleEng', 'abstractKor', 'abstractEng']]
    newKci = pd.merge(basic, detail, on='articleID', how='inner')

    return newBack, newKci

# 8. 몽고db 전송
def sendTomongo(newBack, detail, newKci, refDF):

    # back 데이터 프레임 저장
    currentDate = datetime.datetime.now()
    back_name = "back_%Y%m"
    back_file = currentDate.strftime(back_name)
    newBack.to_csv(f'{back_file}.csv', index=False)
    print(f'{back_file}.csv', "saved.")

    # detail 데이터 프레임 저장
    detail_name = "detail_%Y%m"
    detail_file = currentDate.strftime(detail_name)
    detail.to_csv(f'{detail_file}.csv', index=False)
    print(f'{detail_file}.csv', "saved.")

    # kci 데이터 프레임 저장
    kci_name = "kci_%Y%m"
    kci_file = currentDate.strftime(kci_name)
    newKci.to_csv(f'{kci_file}.csv', index=False)
    print(f'{kci_file}.csv', "saved.")

    # ref 데이터 프레임 저장
    ref_name = "ref_%Y%m"
    ref_file = currentDate.strftime(ref_name)
    refDF.to_csv(f'{ref_file}.csv', index=False)
    print(f'{ref_file}.csv', "saved.")

    # client = MongoClient('localhost', 27017)
    client = MongoClient('mongodb://ditto:AbBaDittos!230910*@localhost', 27017)

    # back 데이터
    backDB = client.get_database('back')
    backClient = backDB.get_collection(back_file) #back_name
    newBack = newBack.to_dict('records')
    #backClient.insert_many(newBack)

    # ref 데이터
    backClient = backDB.get_collection(ref_file) #back_name
    refDF = refDF.to_dict('records')
    #backClient.insert_many(refDF)

    # kci 데이터
    kciDB = client.get_database('kci_api')
    kciClient = kciDB.get_collection(kci_file) #kci_name
    newKci = newKci.to_dict('records')
    #kciClient.insert_many(newKci)
    print(newKci[0])
    # testDB = client.get_database('test')
    # testClient = testDB.get_collection(back_file) #back_name
    # newBack = newBack.to_dict('records')
    # testClient.insert_many(newBack)

    # testClient = testDB.get_collection(kci_file) #back_name
    # newKci = newKci.to_dict('records')
    # testClient.insert_many(newKci)

    # listcheck = client.test.list_collection_names()
    # return listcheck

    backListcheck = client.back.list_collection_names()
    kciListcheck = client.kci_api.list_collection_names()
    return backListcheck, kciListcheck

def main():
    formerURL, latterURL, pages = getPage_dateTime()
    backDF = basicAPI(formerURL, latterURL, pages)
    back = preprocessing(backDF)
    detail = detailAPI(back)
    refDF = refDFcreate(detail)
    newBack, newKci = mergeAPI(back, detail)
    backListcheck, kciListcheck = sendTomongo(newBack, detail, newKci, refDF)
    print(backListcheck, kciListcheck)


main()


