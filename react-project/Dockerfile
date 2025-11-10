# react-project/Dockerfile

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# React 실행 명령어 (start:dev 아님!)
CMD ["npm", "start"]