FROM node:24

RUN apt-get update \
    && apt-get install -y curl git ssh bash \
    && curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh \
    && arduino-cli core update-index \
    && arduino-cli core install arduino:avr

WORKDIR /usr/src/app

COPY package*.json ./ 

RUN npm install 

COPY  . .

EXPOSE 3000

CMD ["npm", "run", "dev"]