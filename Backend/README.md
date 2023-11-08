# EGG - Backend

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

<img width="796" src="https://github.com/eeeeeddy/Final_Backend/assets/132035053/a0372681-4feb-49f0-8b4d-2d719359c67c">


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
        - 사용자 기능
            - 회원 가입 유효성 및 중복성 검사
            - 로그인 유효성 및 중복성 검사
            - JWT를 이용한 사용자 검증 토큰 발행
            - Redis를 이용한 토큰 저장 및 재발급
            - History 페이지
              - 사용자가 열어 본 논문 기록 저장
            - Save 페이지
              - 사용자가 저장한 논문 저장
                
### 5. Detail

- 사용자 기능

    SpringSecurity+JWT+Redis를 활용한 토큰 기반 사용자 기능 <br>

    <details>
    <summary> 개념</summary>
    
    + 토큰 기반 인증 시스템
    
       - 웹 보안은 요청하는 사용자를 식별하는 인증(Authenticate)와 인증된 사용자가 보호된 리소스에 접근할 권한이 있는지 확인하는 인가(Authorize)가 바탕이 된다.
    
       - Token기반 인증 시스템은 인증을 받은 사용자에게 토큰을 전달하고, 사용자가 서버에 요청할 때 Header에 발급 받은 토큰을 함께 보내어 유효성을 검사한다.</br> * stateless구조를 갖는다.
    
       - 따라서 클라이언트가 요청했을 때 클라이언트의 Header에 담긴 Toekn만으로 인증 정보를 확인할 수 있기에 세션 관리를 요하지 않아 자원을 아낄 수 있다.
    
      + JWT란 (Json Web Token)
    
         - JSON 객체를 사용해서 토큰 자체에 정보를 저장하는 Web Token이다.
    
         - JWT는 Header, Payload, Signature 3 개의 부분으로 구성되어 있으며 쿠키나 세션을 이용한 인증보다 안전하고 효율적이며, 웹 응용 프로그램, 모바일 애플리케이션, 마이크로서비스 및 다양한 분산 시스템에서 인증 및 권한 부여를 위한 강력한 도구로 사용되며, 사용자 관리 및 보안을 향상시키는 데 기여한다.
    </details>
    
    <details>
    <summary>처리 과정</summary>

    Security + JWT + Redis 기본 동작 원리
       
    ![jwt처리과정](https://github.com/eeeeeddy/Final_Backend/assets/71869717/30a5fd62-763c-495e-ab35-4cb306b8671c)
    *Login ID/PW 를 기반으로 Authentication 객체 생성*
    
    </details>
