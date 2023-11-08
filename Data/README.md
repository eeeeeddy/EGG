# EGG - Data

### 1. Technology Stack
<div align=center>
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white">  
<img src="https://img.shields.io/badge/pytorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white">
<img src="https://img.shields.io/badge/selenium-43B02A?style=for-the-badge&logo=selenium&logoColor=white">  
<img src="https://img.shields.io/badge/OpenJDK-437291?style=for-the-badge&logo=OepnJDK&logoColor=white">
<img src="https://img.shields.io/badge/KciAPI-3B00B9?style=for-the-badge&logo=KciAPI&logoColor=white">
<img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
<br>
<img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=Ubuntu&logoColor=white">  
<img src="https://img.shields.io/badge/apachehadoop-66CCFF?style=for-the-badge&logo=apachehadoop&logoColor=white">
<img src="https://img.shields.io/badge/Zookeeper-E95420?style=for-the-badge&logo=Zookeeper&logoColor=white">  
<img src="https://img.shields.io/badge/apachespark-E25A1C?style=for-the-badge&logo=apachespark&logoColor=white">
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
<img src="https://img.shields.io/badge/apacheairflow-017CEE?style=for-the-badge&logo=apacheairflow&logoColor=white">
</div>

### 2. System Architecture
![ProjectArchitecture](https://github.com/seongcheollee/EGG_Data/assets/71869717/6a412147-90ba-4b40-b4e8-03bd1324031d)

### 3. Environment configuration on Ec2

<div align=center>
<img width="700" alt="ec2" src="https://github.com/seongcheollee/EGG_Data/assets/59824783/e95dc848-d2c0-416d-b666-e3aee32c8738">
</div>

### 4. Data Flow

![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/8a6ad6f1-cb8f-4c76-a4b2-0ba6f3a1717d)

### 5. Graph Generate Method

- **Step 1:** Classification, Keyword Extraction, Embedding Transformation 

  ![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/297b0349-e2ff-4f6c-b65a-ec264a4a933f)

- **Step 2:** Create a Reference Map 

  ![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/dfc6eb32-f767-4c4e-867e-d4833731aee4)

- **Step 3:** Add a linking column to the Step 1 data using the Reference Map DataFrame 

  ![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/0a1accd7-6bea-4c71-b4f9-f3274cabf202)

- **Step 4:** Generate the Total Graph using networkX 

  ![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/7939c414-3ef0-4001-b72a-dbac7b3edb51)

- **Step 5:** Extract a subgraph when the user selects one paper 

  ![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/7df8c8f8-a13f-4a16-83be-987428b6ed55)

- **Step 6:** Extract a subgraph when the user selects more than two papers 

  ![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/3eaab726-32d8-461f-9b2c-c88566ffb6b4)

- **Step 7:** Extract Node, Edge data and Transfer Client 


### 6. PipeLine (Airflow)

- **APi Collection and Preprocessing**

  Cycle : 1 Month

  ![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/a80d90fb-2d7a-4920-b83e-b553602c6a9f)


- **Model Training**

  Crawling Cycle : 1 day

  Model Train Cycle : 1 Month

  ![image](https://github.com/seongcheollee/EGG_Data/assets/59824783/a9537180-b761-4531-8869-30172e6d0d2f)
