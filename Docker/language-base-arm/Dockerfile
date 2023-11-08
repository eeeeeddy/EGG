FROM ubuntu:20.04

ENV TZ=Asia/Seoul

RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/apt/sources.list && \
    sed -i 's|#deb http://archive.ubuntu.com/ubuntu|deb http://old-releases.ubuntu.com/ubuntu|g' /etc/apt/sources.list

RUN apt-get update && apt-get install -y wget build-essential openssl libssl-dev libbz2-dev libffi-dev zlib1g-dev
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Seoul

RUN apt-get install -y tzdata

ENV PYTHON_VERSION=3.7.17
ENV PYTHON_URL=https://www.python.org/ftp/python/$PYTHON_VERSION/Python-$PYTHON_VERSION.tgz

RUN wget $PYTHON_URL && \
    tar -xvzf Python-$PYTHON_VERSION.tgz && \
    rm Python-$PYTHON_VERSION.tgz && \
    cd Python-$PYTHON_VERSION

RUN /Python-$PYTHON_VERSION/configure --enable-optimizations
RUN make altinstall

RUN apt-get install -y python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install pip==20.0.2


RUN ln -sf /usr/local/bin/python3.7 /usr/bin/python
RUN ln -sf /usr/local/bin/python3.7 /usr/bin/python3


RUN pip3 install numpy pandas networkx pymongo

RUN apt-get clean && apt-get -y update && apt-get install -y openjdk-8-jdk

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-arm64/jre
