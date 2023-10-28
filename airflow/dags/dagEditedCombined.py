from airflow import DAG
from airflow.operators.python_operator import PythonOperator, BranchPythonOperator
from airflow.utils.dates import days_ago
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
  'Update_and_Train_Model', # 통합된 DAG의 고유한 이름
  default_args=default_args,
  description='매일 데이터를 업데이트하고 매월 모델을 훈련하는 파이썬 작업',
  schedule_interval='@daily', # 스케줄 간격은 여기에서 설정합니다.
  catchup=False,
  tags=["daily", "monthly", "update", "train"],
)

def categoryUpdate():
  result = subprocess.run(['spark-submit', '--master', 'yarn', '--deploy-mode', 'client', '/home/ubuntu/Ditto/Egg/Collection/categoryUpdate.py'], stdout=subprocess.PIPE)
  print(result.stdout.decode('utf-8'))
  logging.info('Running categoryUpdate completed successfully')

def modelTrain():
  result = subprocess.run(['spark-submit', '--master', 'yarn', '--deploy-mode', 'client', '/home/ubuntu/Ditto/Egg/Model/modelTrain.py'], stdout=subprocess.PIPE)
  print(result.stdout.decode('utf-8'))
  logging.info('Running modelTrain completed successfully')

def decide_which_path():
    if pendulum.now().day == 1: # 매월 첫날에만 모델 훈련을 실행합니다.
        return 'run_modelTrain'
    else:
        return 'run_categoryUpdate'

# Python 함수를 실행하는 작업 정의
branch_operator = BranchPythonOperator(
    task_id='branch_task',
    python_callable=decide_which_path,
    dag=dag,
)

categoryUpdate_operator = PythonOperator(
  task_id='run_categoryUpdate',
  python_callable=categoryUpdate,
  dag=dag,
)

modelTrain_operator = PythonOperator(
  task_id='run_modelTrain',
  python_callable=modelTrain,
  dag=dag,
)

# 작업 실행 순서 정의
branch_operator >> [categoryUpdate_operator, modelTrain_operator]

if __name__ == "__main__":
  dag.cli()