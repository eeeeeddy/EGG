# EGG - Frontend

### 1. Stack

<div align=center>
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> 
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<br> 
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
<img src="https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=D3.js&logoColor=white">
<img src="https://img.shields.io/badge/Kibana-005571?style=for-the-badge&logo=Kibana&logoColor=white">
<br>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
<img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=Ubuntu&logoColor=white">  
</div>


### 2. WireFrame

<div align=center>

  | Main 페이지 | Search 페이지 | Deatil 페이지 |
  |-|-|-|
  | <img src="https://github.com/eeeeeddy/Final_Frontend/assets/71869717/573d3c0c-08a4-40d8-8b64-fcf00b8e1cb1" width="200" height="100"/> |  <img src="https://github.com/eeeeeddy/Final_Frontend/assets/71869717/c83e4c93-ce24-4001-85e8-d8ccf9e2f952" width="200" height="100"> | <img src="https://github.com/eeeeeddy/Final_Frontend/assets/71869717/0a3252b6-b9aa-4813-bebf-d3add7b2b209" width="200" height="100"> |

</div>

### 3. Project Architecture

```
├── README.md
├── .github/workflows
│    ├── deploy.yml
│    └── npm-publish.yml
├── .vscode
├── .env
├── .gitignore
├── Server.js
├── appspec.yml
├── deploy.sh
├── package-lock.json
├── package.json
│
├── public
│    ├── index.html
│    ├── EGG_logo.ico
│    └── Main.png
│
└── src
     ├── css
     │     ├── App.css
     │     ├── Author.css
     │     ├── Dashboard.css
     │     ├── Detail.css
     │     ├── History.css
     │     ├── index.css
     │     ├── Main.css
     │     ├── SavePaper.css
     │     └── Search.css
     ├── data
     │     ├── data.json 
     │     └── Institution.json
     ├── umm
     │     ├── logo.sgv
     │     ├── reportWebVitals.js
     │     └── setUpTests.js
     ├── About.js
     ├── App.js
     ├── Author.js
     ├── AxiosConfig.js
     ├── Dashboard.js
     ├── Detail_FilterTest.js
     ├── Detail.js
     ├── History.js
     ├── index.js
     ├── Login.js
     ├── Main.js
     ├── MainNavbar.js
     ├── Pricing.js
     ├── SavePaper.js
     ├── Search.js
     ├── SignUp.js
     └── UserContext.js
```

### 4. Role

- **UI/UX**
    - 공동 작업 (이승윤, 장수현)
- **이승윤**
    - **기능**
        - 논문, 저자 연관 관계 시각화
            - 네트워크 그래프 생성
            - 그래프 필터링 기능
            - 사용자 상호작용 기능 (zoom, drag 등)
        - Kibana 대시보드 구성 및 연동
            - Article 대시보드
            - Author 대시보드
            - Institution 대시보드
                - 기관별 필터링 기능
        - CI/CD 구성
            - AWS EC2 배포
- **장수현**
    - **기능**
        - 회원 기능
            - 회원 가입 유효성 및 중복성 검사
            - 로그인 유효성 및 중복성 검사
            - History 페이지
            - Save 페이지
        - 검색 결과 PDF Export 기능

### 5. Detail

- #### 논문

    - 단일 논문 그래프 <br><br>
    ![단일논문그래프](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/8a677224-4939-465c-bdc6-32389bcb236e)

    - 복수 논문 그래프 <br><br>
    ![복수논문그래프](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/da8ca138-8283-467d-993b-40739664f6ee)

    - 그래프 필터링 <br><br>
    ![필터링](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/8927f259-84bc-48e5-80a0-3c49ed73b506)

    - 논문 대시보드 <br><br>
    ![논문대시보드](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/636aa5f4-5c9b-4de4-bf3b-5689a30166ba)

- #### 저자

    - 저자 그래프 <br><br>
    ![저자그래프](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/44a7704c-b461-41ed-83e6-38e0c89c0920)

    - 저자 대시보드 <br><br>
    ![저자대시보드](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/d669a370-efda-4cd8-9074-21ba6d180ed6)


- #### 연구기관

    - 연구기관 대시보드 <br><br>
    ![연구기관대시보드](https://github.com/eeeeeddy/Final_Frontend/assets/71869717/51f86f17-dfce-4ef4-919f-2b426fb6d4b2)