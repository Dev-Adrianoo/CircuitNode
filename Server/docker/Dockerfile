
FROM ubuntu:latest

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    tar \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

ENV ARDUINO_CLI_VERSION=1.3.1
ENV ARDUINO_CLI_ARCH=Linux_64bit
RUN curl -fsSL https://downloads.arduino.cc/arduino-cli/arduino-cli_${ARDUINO_CLI_VERSION}_${ARDUINO_CLI_ARCH}.tar.gz | tar xz -C /usr/local/bin && chmod +x /usr/local/bin/arduino-cli

ENV ARDUINO_DATA_DIR="/usr/local/share/arduino-cli"
ENV PATH="${PATH}:/usr/local/bin"   


WORKDIR /circuit-app

RUN arduino-cli core update-index && \
    arduino-cli core install arduino:avr &&\
    arduino-cli lib update-index 




    