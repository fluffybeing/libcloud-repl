############################################################
# Dockerfile to build Python WSGI Application Containers
# Based on Ubuntu
############################################################

FROM ubuntu:12.04
MAINTAINER Rahul Ranjan "rahul.rrixe@gmail.com"

RUN echo 'deb http://archive.ubuntu.com/ubuntu quantal main universe multiverse' > /etc/apt/sources.list
# RUN echo 'deb http://archive.ubuntu.com/ubuntu main universe multiverse' > /etc/apt/sources.list
RUN apt-get update -qq
RUN apt-get install -y -q curl
RUN apt-get install -y -q sudo
RUN apt-get install -y -q python
RUN apt-get install -y -q python-dev
RUN apt-get install -y -q python-pip
RUN apt-get install -y -q git-core
RUN apt-get install -y tar git curl nano wget dialog net-tools build-essential

# gcc and make should be available from python-dev
# RUN apt-get install -y -q gcc
# RUN apt-get install -y -q make

# clone the application repository
RUN git clone https://github.com/rahulrrixe/libcloud.repl

# Get pip to download and install requirements:
RUN pip install -r /libcloud.repl/requirements.txt

# Expose ports
EXPOSE 80

# Set the default directory where CMD will execute
WORKDIR /libcloud.repl

# Set the default command to execute
# when creating a new container
# i.e. using CherryPy to serve the application
CMD python runserver.py
