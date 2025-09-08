FROM node:24

WORKDIR /app

COPY Client/package*.json ./

RUN npm install

COPY Client/ .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "__host"]