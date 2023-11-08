from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago
import logging
import datetime
import pendulum
import os

# DAG 정의
default_args = {
    'owner': 'Ditto',
    'start_date': pendulum.now(),  # DAG가 언제 시작할지 설정합니다.
    'retries': 1,  # 작업 실패 시 재시도 횟수
    'retry_delay': datetime.timedelta(minutes=5),  # 재시도 간격
}

dag = DAG(
    'monthly_python_tasks',  # DAG의 고유한 이름
    default_args=default_args,
    description='매월 주기로 실행되는 파이썬 작업',
    schedule_interval='@monthly',  # 매월 실행하도록 설정
    catchup=False,  # 과거 작업 실행 여부
    tags=["api", "graph"],
)

# Python 함수 정의
def task_a():
    # 파이썬 파일 A를 실행하는 코드
    os.system('~/Ditto/Egg/Collection/apiUpdate.py')
    logging.info('task_a completed')

# 각각의 Python 함수를 실행하는 작업 정의
run_task_a = PythonOperator(
    task_id='run_task_a',
    python_callable=task_a,
    dag=dag,
)

def spark_submit_task_success():
    logging.info('spark_submit_task completed successfully')

def spark_submit_task():
    # 스파크 작업을 실행하는 코드
    os.system('spark-submit —master yarn —deploy-mode client ~/Ditto/Egg/Preprocessing/MakeCcGraph.py')
    spark_submit_task_success()

# Python 함수를 실행하는 작업 정의
spark_submit_task_operator = PythonOperator(
    task_id='spark_submit_task',
    python_callable=spark_submit_task,
    dag=dag,
)

# 작업 실행 순서 정의
run_task_a >> spark_submit_task_operator

if __name__ == "__main__":
    dag.cli()