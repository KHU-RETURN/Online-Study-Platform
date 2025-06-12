# Dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev  # devDependencies 제외

COPY . .

CMD ["node", "app.js"]
