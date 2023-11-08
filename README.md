# EGG : 논문 시각화 검색 서비스

**Frontend : https://github.com/eeeeeddy/EGG_Frontend.git**
**Backend : https://github.com/eeeeeddy/EGG_Backend.git**
**Data : https://github.com/eeeeeddy/EGG_Data.git**
**FastAPI : https://github.com/eeeeeddy/EGG_FastAPI.git**
**Docker : https://github.com/eeeeeddy/EGG_Docker.git**

### 1. 프로젝트 소개 + 개발 기간

개발 기간 : 23.07.31 ~ 23.10.23

본 프로젝트는 논문/저자/연구 기관의 연관 관계 시각화를 통한 논문 검색 서비스로 사용자가 보다 직관적이고 효율적으로 논문을 검색할 수 있고, 논문 검색의 접근성을 높이기 위한 서비스입니다.

### 2. 주제 선정 배경

국내에 기존에 서비스하는 여러 논문 검색 사이트가 존재하지만, 2가지 이상의 논문의 연관 관계를 시각적으로 보여주는 서비스는 존재하지 않았습니다.
더불어 저자와 연구 기관의 관계를 파악하기 위해서는 사용자가 각각의 논문을 통해 파악해야 했습니다.

논문/저자/연구 기관의 연관 관계를 파악하는 것은 각 분야의 트렌트 파악 및 논문 작성 시에 사용자에게 인사이트를 제공하는 방법이기 때문에 아래의 해외 서비스를 참고하여 국내에 제공하고자 해당 주제를 선정하게 되었습니다.

| ResearchRabbit | ConnectedPapers | 
|-|-|
|![ResearchRabbit](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/72bf9920-6970-4b70-966a-60b53c2c2a01)|![ConnectedPapers](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/4cc57a5f-c2e2-4bba-8b29-7dbba98542ec)|

### 3. 팀원 소개

- **이성철(팀장)**
    - 논문 데이터 크롤링
    - 논문 데이터 모델 학습 및 결과 분석
    - 논문/저자/연구기관 연관 관계 기준 수립
    - Hadoop 분산 환경 구축 (EC2, Docker)
    - FastAPI ↔ MongoDB 연동
- **이창희**
    - 데이터 적재 (MongoDB)
    - Airflow
- **김민희**
    - 논문 데이터 크롤링
    - 논문/저자/연구기관 연관 관계 기준 수립
    - Kibana 대시보드 구성
- **이승윤**
    - 프론트
        - 논문, 저자 연관 관계 시각화
        - Kibana 대시보드 구성 및 연동
        - CI/CD 구성
    - 백
        - ElasticSearch 검색엔진 연동
        - CI/CD 구성
        - Docker 세팅 (ElasticSearch, Kibana)
- **장수현**
    - 프론트
        - 회원 가입 유효성 및 중복성 검사
        - 로그인 유효성 및 중복성 검사
        - 검색 결과 PDF Export 기능
    - 백
        - 회원 가입 유효성 및 중복성 검사
        - 로그인 유효성 및 중복성 검사
        - JWT를 이용한 사용자 검증 토큰 발행
        - Redis를 이용한 토큰 저장 및 재발급

### 4. 시연 영상

[EGG 시연 영상](https://youtu.be/PhPxPKtndbI?si=Ywp87HYqcUDCkm_X)

### 5. 기술스택

- 공통
  
  <img src="https://img.shields.io/badge/KciAPI-3B00B9?style=for-the-badge&logo=KciAPI&logoColor=white">
  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=Ubuntu&logoColor=white">
  <img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">

- 데이터
  
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white">
  <img src="https://img.shields.io/badge/pytorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white">
  <img src="https://img.shields.io/badge/selenium-43B02A?style=for-the-badge&logo=selenium&logoColor=white">
  <img src="https://img.shields.io/badge/OpenJDK-437291?style=for-the-badge&logo=OepnJDK&logoColor=white">
  <img src="https://img.shields.io/badge/apachehadoop-66CCFF?style=for-the-badge&logo=apachehadoop&logoColor=white">
  <img src="https://img.shields.io/badge/Zookeeper-E95420?style=for-the-badge&logo=Zookeeper&logoColor=white">
  <img src="https://img.shields.io/badge/apachespark-E25A1C?style=for-the-badge&logo=apachespark&logoColor=white">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
  <img src="https://img.shields.io/badge/apacheairflow-017CEE?style=for-the-badge&logo=apacheairflow&logoColor=white">

- 프론트엔드
  
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> 
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
  <img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
  <img src="https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=D3.js&logoColor=white">
  <img src="https://img.shields.io/badge/Kibana-005571?style=for-the-badge&logo=Kibana&logoColor=white">

- 백엔드
  
  <img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
  <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
  <img src="https://img.shields.io/badge/jwt-FF9E0F?style=for-the-badge&logo=jsonwebtokens&logoColor=white">
  <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white">

### 6. 프로젝트 아키텍쳐

![ProjectArchitecture](https://github.com/seongcheollee/EGG_Data/assets/71869717/6a412147-90ba-4b40-b4e8-03bd1324031d)

### 7. 주요 기능

  **7-1. Methodology**
  
  - 문서 유사도, Classification 기반 추천
      - ArXiv의 논문 제목, 초록 크롤링
      - Bert를 사용하여 학습
      - KeyBert를 사용하여 키워드 분류
      - BertClassification 을 통해 embedding 값 추출
      - KCI 논문 제목과 초록을 합쳐서 Classification
  - 문제점
      - 부모 노드와 자식 노드의 관계가 1 : N 으로 밖에 생성되지  않아 다양한 관계에 대해서 시각화 불가능
      - Bert Classification 의 분류 정확도가 높지 않은 현상
          - “같은 Class일 경우 문서 유사도가 높을 것”이라는 가설 → 분류한 Class와 상관없이 유사도가 정해짐
  - 해결 방법
      - 데이터 수 부족과 모델 성능 향상을 단기간에 향상 시킬 수 없음
      - “같은 참조 논문을 갖고 있는 논문들 끼리는 유사도가 높을 것이다”라는 가설을 바탕으로
          
          같은 참조 논문을 가지고 있는 논문들에 한해서 유사도 생성 및 그래프 확인
          
      - 부모 노드와 자식 노드들의 관계가 n:m으로 다양한 관계 시각화 가능
      - 논문들이 같은 참조 논문을 기반으로 하였기에 기본적으로 높은 유사도로 형성되어 있음
      - 이전에 Classification 한 결과물로 그래프 생성 → 생성된 그래프에서 class에 따른 **filtering을 통하여 시각화 추가 기능으로 변경**
   
  **7-2. Detail**
      
  - 논문 검색 기능
      
      ![search.png](https://github.com/seongcheollee/EGG_Data/assets/71869717/98723697-0df5-4e00-86c6-5da5be54b7f7)
      
  - 연관 관계 시각화
      - 단일 논문 연관 관계 그래프
          
          ![단일논문그래프.png](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/8a677224-4939-465c-bdc6-32389bcb236e)
          
      - 복수 논문 연관 관계 그래프
          
          ![복수논문그래프](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/da8ca138-8283-467d-993b-40739664f6ee)
          
  - 논문 Dashboard
      
      ![논문대시보드](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/636aa5f4-5c9b-4de4-bf3b-5689a30166ba)
      
  - 저자 연관 관계 그래프
      
      ![저자그래프](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/44a7704c-b461-41ed-83e6-38e0c89c0920)
      
  - 저자 정보 PDF Export
      
      ![pdf_export.png](https://github.com/eeeeeddy/Final_Backend/assets/71869717/d1955e6d-3c8e-4b61-bfc1-ffca77627a1f)
      
  - 저자 Dashboard
      
      ![저자대시보드](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/d669a370-efda-4cd8-9074-21ba6d180ed6)
      
  - 연구기관 Dashboard
      
      ![연구기관대시보드](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/51f86f17-dfce-4ef4-919f-2b426fb6d4b2)
      
  - 회원 기능
      - 논문 Save
          
          ![save](https://github.com/eeeeeddy/Final_Backend/assets/71869717/5fb79c52-a9ce-4bc5-8715-b21a36e80c2f)
          
      - 논문 History
          
          ![history](https://github.com/eeeeeddy/Final_Backend/assets/71869717/2a79ffaa-8985-4020-8c4a-b5c04d7ac1b2)
          

### 8. 개선 방향

- 현재는 KCI에서 제공하는 논문 정보를 통해 한국 정보 과학회만을 한정지어 개발했기 때문에,
추후 제공하는 논문 범위를 전 학회, 전 분야로의 확대
- 신속하고, 정확한 검색을 위한 ElasticSearch의 검색 기능 개선
- 현재는 참고 논문을 기준으로 연관 관계 그래프를 생성하지만, 다양한 파라미터를 추가하여 
논문/저자/연구 기관의 연관 관계 그래프 생성 시의 연결 기준을 개선
- 기타 개선 방향
    - 트래픽 처리
    - 논문 크롤링봇 개발
    - 시스템 최적화
        - 그래프 전용 DB 구축
        - Spark SQL 적용
    - 논문 최적화 NLP 모델 개발
    - 스트리밍 데이터 파이프라인 개설

### 9. 회고 및 후기
