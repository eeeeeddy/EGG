# EGG : 논문 시각화 검색 서비스

### 1. Stack

<div align=center>
<img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
<br>
<img src="https://img.shields.io/badge/jwt-FF9E0F?style=for-the-badge&logo=jsonwebtokens&logoColor=white">
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<br>
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
<img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=Ubuntu&logoColor=white"> 
<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
</div>

### 2. DataBase 

추후 ERD 추가 예정

### 3. API

- **users-controller** <br>

  | POST                  | Request                                  | Return  |
  |-----------------------|------------------------------------------|---------|
  | /api/v1/users/sign-up | email, password, userName, gender, birth | 회원가입 결과 |
  | /api/v1/users/reissue | accessToken, refreshToken                |         |
  | /api/v1/users/logout  | accessToken, refreshToken                | 로그아웃 결과 |
  | /api/v1/users/login   | email, password                          | 로그인 결과  |

  | GET                     | Request | Return   |
  |-------------------------|---------|----------|
  | /api/v1/users/userTest  |         | 로그 기록 결과 |
  | /api/v1/users/authority |         | 권한 부여 결과 |
  | /api/v1/users/adminTest |         | 로그 기록 결과 |

- **save-controller** <br>

  | POST             | Request                                                                                                                                                                                          | Return   |
  |------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
  | /api/save/papers | articleId <br> title_ko <br> title_en <br> author_name <br> author_id <br> institution <br> journal_name <br> publisher <br> pub_year <br> major <br> abstract_ko <br> abstract_en <br> category | 논문 저장 결과 |

  | GET              | Request | Return                                                                                                                                                                                           |
  |------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | /api/save/papers | email   | articleId <br> title_ko <br> title_en <br> author_name <br> author_id <br> institution <br> journal_name <br> publisher <br> pub_year <br> major <br> abstract_ko <br> abstract_en <br> category |

  | DELETE                        | Request   | Return        |
  |-------------------------------|-----------|---------------|
  | /api/save/papers/{article_id} | articleId | 저장된 논문의 삭제 결과 |

- **elastic-search-controller** <br>

  | GET                       | Request | Return                                                                                                                                                               |
  |---------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | /search/_search/{keyword} | keyword | articleId <br> journalName <br> journalPublisher <br> pubYear <br> titleKor <br> titleEng <br> authors <br> abstractKor <br> abstractEng <br> citations <br> keyword | 

- **auth-controller** <br>

  | GET                         | Request | Return        |
  |-----------------------------|---------|---------------|
  | /check-email-authentication | email   | 이메일 인증 결과     |
  | /check-authentication       | email   | 현재 사용자의 인증 결과 |

- **check-email-controller** <br>

  | GET                      | Request | Return           |
  |--------------------------|---------|------------------|
  | /api/v1/users/checkEmail | email   | 중복 이메일에 대한 검증 결과 |

### 4. Function

- **DB 설계**
  - 공동 작업 (이승윤, 장수현)
- **이승윤**
    - **기능**
        - ElasticSearch 검색엔진 연동
          - Nori Tokenizer를 활용한 한국어 검색 기능
          - EC2 연동 (프로젝트 기간 중)
          - Docker 연동 (프로젝트 종료 후)
        - CI/CD 구성
            - AWS EC2 배포
- **장수현**
    - **기능**
        - 회원 기능
            - 회원 가입 유효성 및 중복성 검사
            - 로그인 유효성 및 중복성 검사
            - JWT를 이용한 사용자 검증 토큰 발행
            - Redis를 이용한 토큰 저장 및 재발급
            - History 페이지
              - 사용자가 열어 본 논문 기록 저장
            - Save 페이지
              - 사용자가 저장한 논문 저장
