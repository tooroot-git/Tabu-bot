# Dockerfile

FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY . .

RUN npm install

ENV PORT=3000

CMD ["npm", "start"]
