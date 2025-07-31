# ====== 1단계: 빌드 스테이지 ======
FROM node:18 AS build

WORKDIR /app

# 의존성만 먼저 복사해서 캐시 유리하게
COPY package*.json ./
RUN npm install --production

# 전체 소스 복사
COPY . .

# ====== 2단계: 런타임 스테이지 ======
FROM node:18-slim

# 시스템 유틸 최소 설치 (필요시)
RUN apt-get update && apt-get install -y curl && apt-get clean

WORKDIR /app

# 빌드 결과물만 복사
COPY --from=build /app /app

EXPOSE 3000

CMD ["node", "src/server.js"]
