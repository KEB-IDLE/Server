FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 후 설치
COPY package*.json ./
RUN npm install

# 나머지 소스 복사
COPY . .

# Express 서버 실행
CMD ["node", "src/server.js"]