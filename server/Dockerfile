FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# 개발 모드(코드가 바뀌면 자동 재시작)로 실행
CMD ["npm", "run", "start:dev"]