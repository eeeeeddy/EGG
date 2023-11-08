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

RUN ln -s /usr/local/bin/python3.7 /usr/bin/python3 && \
    ln -s /usr/local/bin/python3.7 /usr/bin/python

RUN apt-get clean && apt-get -y update && apt-get install -y openjdk-8-jdk



ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre
