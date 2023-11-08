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
    'monthly_dd_experiment',  # DAG의 고유한 이름
    default_args=default_args,
    description='매월 주기로 실행되는 파이썬 작업',
    schedule_interval='@monthly',  # 매월 실행하도록 설정
    catchup=False,  # 과거 작업 실행 여부
    tags=["csv", "graph"],
)

def dd1_success():
    logging.info('dd1 completed successfully')


# Python 함수 정의

def dd1():
    # 파이썬 파일 A를 실행하는 코드
    result = subprocess.run(['python3', '/home/ubuntu/example/dd1.py'], stdout=subprocess.PIPE) # subprocess.run 함수 사용
    print(result.stdout.decode('utf-8')) # 표준 출력 출력
    dd1_success()


# 각각의 Python 함수를 실행하는 작업 정의
dd1_operator = PythonOperator(
    task_id='run_dd1',
    python_callable=dd1, # 함수 이름만 전달
    dag=dag,
)


def dd2_success():
    logging.info('dd2 completed successfully')

 

def dd2():
    # 스파크 작업을 실행하는 코드
    result = subprocess.run(['python3', '/home/ubuntu/example/dd2.py'], stdout=subprocess.PIPE) # subprocess.run 함수 사용
    print(result.stdout.decode('utf-8')) # 표준 출력 출력
    dd2_success()


# Python 함수를 실행하는 작업 정의
dd2_operator = PythonOperator(
    task_id='run_dd2',
    python_callable=dd2, # 함수 이름만 전달
    dag=dag,
)



# 작업 실행 순서 정의
dd1_operator >> dd2_operator


if __name__ == "__main__":
    dag.cli()