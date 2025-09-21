FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y curl bash python3 build-essential && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
RUN arduino-cli core update-index
RUN arduino-cli core install arduino:avr

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-slim AS production


RUN apt-get update && apt-get install -y curl bash python3 ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/bin/arduino-cli /usr/bin/arduino-cli
RUN arduino-cli core update-index
RUN arduino-cli core install arduino:avr

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"]