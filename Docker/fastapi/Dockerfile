FROM python:3.7.17

RUN pip install --upgrade pip

COPY ./src /src
WORKDIR /src

RUN pip install -r requirements.txt

ENV PYTHONPATH=/src

EXPOSE 8080

#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
