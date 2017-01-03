FROM node:7.3.0-wheezy
MAINTAINER Michaël Faille <michael@faille.io>

ENV METEOR_USERNAME meteor
ENV METEOR_PASSWORD letmein
ENV METEOR_RELEASE "1.4.2.3"

RUN apt-get update -y && \
    apt-get install -y  \
    git wget curl ca-certificates sudo bzip2 apt-utils  \
    bzip2  python git gcc libc6-dev build-essential make libssl-dev python    # native build requirements

RUN useradd $METEOR_USERNAME -m -G sudo --shell /bin/bash && echo $METEOR_USERNAME:$METEOR_PASSWORD | chpasswd

USER $METEOR_USERNAME

COPY ./meteor.bootstrap.sh /tmp/meteor.bootstrap.sh

RUN  mkdir $HOME/bin && \
     echo 'PATH="$HOME/bin:$PATH"' >> $HOME/.bashrc  && \
     /tmp/meteor.bootstrap.sh

WORKDIR $HOME
