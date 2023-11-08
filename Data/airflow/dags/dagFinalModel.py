from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from airflow.sensors.external_task import ExternalTaskSensor  # ExternalTaskSensor import 추가
import logging
import datetime
import pendulum
import subprocess

# DAG 정의
default_args = {
    'owner': 'Ditto',
    'start_date': pendulum.now(),
    'retries': 1,
    'retry_delay': datetime.timedelta(minutes=5),
}

dag = DAG(
    'UpTrain_Model_Final',
    default_args=default_args,
    description='매일 주기로 업데이터 하는 파이썬 작업',
    schedule_interval='@daily',
    catchup=False,
    tags=["daily", "update"],
)

def categoryUpdate():
    result = subprocess.run(['spark-submit', '--master', 'yarn', '--deploy-mode', 'client', '/home/ubuntu/Ditto/Egg/Collection/categoryUpdate.py'], stdout=subprocess.PIPE)
    print(result.stdout.decode('utf-8'))
    logging.info('Running categoryUpdate completed successfully')

categoryUpdate_operator = PythonOperator(
    task_id='run_categoryUpdate',
    python_callable=categoryUpdate,
    dag=dag,
)

# ExternalTaskSensor를 사용하여 월별 DAG의 완료를 대기
wait_for_monthly_dag = ExternalTaskSensor(
    task_id='wait_for_monthly_dag',
    external_dag_id='Update_Train_Model_Final',  # 월별 DAG 이름
    external_task_id='run_modelTrain',  # 월별 DAG의 작업 ID
    mode='reschedule',  # 월별 DAG가 실행되기를 기다림
    timeout=600,  # 최대 대기 시간 설정 (초)
    dag=dag,
)

# 작업 실행 순서 정의
categoryUpdate_operator >> wait_for_monthly_dag

if __name__ == "__main__":
    dag.cli()