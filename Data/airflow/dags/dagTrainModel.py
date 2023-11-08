from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
import logging
import datetime
import pendulum
import subprocess # subprocess 모듈 추가


# DAG 정의
default_args = {
    'owner': 'Ditto',
    'start_date': pendulum.now(),  # DAG가 언제 시작할지 설정합니다.
    'retries': 1,  # 작업 실패 시 재시도 횟수
    'retry_delay': datetime.timedelta(minutes=5),  # 재시도 간격
}


dag = DAG(
    'Update_Train_Model_Final',  # DAG의 고유한 이름
    default_args=default_args,
    description='매월 트레인 하는 파이썬 작업',
    schedule_interval='@monthly',  # 매일 실행하도록 설정
    catchup=False,  # 과거 작업 실행 여부
    tags=["monthly", "train"],
)



def modelTrain():
    # 스파크 환경에서 파이썬 파일 B를 실행하는 코드
    result = subprocess.run(['spark-submit', '--master', 'yarn', '--deploy-mode', 'client', '/home/ubuntu/Ditto/Egg/Model/modelTrain.py'], stdout=subprocess.PIPE) # subprocess.run 함수 사용
    print(result.stdout.decode('utf-8')) # 표준 출력 출력
    logging.info('Running modelTrain completed successfully')


# Python 함수를 실행하는 작업 정의
modelTrain_operator = PythonOperator(
    task_id='run_modelTrain',
    python_callable=modelTrain, # 함수 이름만 전달
    dag=dag,

)

# 작업 실행 순서 정의
modelTrain_operator


if __name__ == "__main__":
    dag.cli()