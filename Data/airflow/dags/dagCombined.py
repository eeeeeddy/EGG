from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.utils.dates import days_ago
from datetime import datetime, timedelta
import logging
import datetime

# 공통 설정
default_args = {
    'owner': 'Ditto',
    'start_date': days_ago(1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# 최상위 DAG 정의
top_level_dag = DAG(
    'Combined_DAG',
    default_args=default_args,
    description='Combined DAG for daily and monthly tasks',
    schedule_interval=timedelta(days=1),  # 매일 실행
    catchup=False,
    tags=["combined"],
)

# 일별 실행 DAG 정의
daily_dag = DAG(
    'Update_Model_Final',
    default_args=default_args,
    schedule_interval=timedelta(days=1),  # 매일 실행
    catchup=False,
    tags=["daily", "update"],
)

# 월별 실행 DAG 정의
monthly_dag = DAG(
    'Update_Train_Model_Final',
    default_args=default_args,
    schedule_interval=timedelta(days=30),  # 매월 한 번 실행 (약 30일 간격)
    catchup=False,
    tags=["monthly", "train"],
)

# 일별 실행 DAG의 작업 정의
def categoryUpdate():
    result = subprocess.run(['spark-submit', '--master', 'yarn', '--deploy-mode', 'client', '/home/ubuntu/Ditto/Egg/Collection/categoryUpdate.py'], stdout=subprocess.PIPE)
    print(result.stdout.decode('utf-8'))
    logging.info('Running categoryUpdate completed successfully')

categoryUpdate_operator = PythonOperator(
    task_id='run_categoryUpdate',
    python_callable=categoryUpdate,
    dag=daily_dag,
)

# 월별 실행 DAG의 작업 정의
def modelTrain():
    result = subprocess.run(['spark-submit', '--master', 'yarn', '--deploy-mode', 'client', '/home/ubuntu/Ditto/Egg/Model/modelTrain.py'], stdout=subprocess.PIPE)
    print(result.stdout.decode('utf-8'))
    logging.info('Running modelTrain completed successfully')

modelTrain_operator = PythonOperator(
    task_id='run_modelTrain',
    python_callable=modelTrain,
    dag=monthly_dag,
)

# TriggerDagRunOperator로 월별 DAG를 트리거
trigger_monthly_dag = TriggerDagRunOperator(
    task_id='trigger_monthly_dag',
    trigger_dag_id='Update_Train_Model_Final',
    dag=daily_dag,
)

# 종속성 설정
trigger_monthly_dag.set_upstream(categoryUpdate_operator)

# 최상위 DAG의 구성
trigger_monthly_dag >> daily_dag
daily_dag.set_upstream(top_level_dag)
monthly_dag.set_upstream(top_level_dag)