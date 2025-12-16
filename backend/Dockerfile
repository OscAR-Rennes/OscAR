# Utiliser une image Node.js officielle légère
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN if [ -f package-lock.json ]; then \
      npm install --omit=dev --no-audit --no-fund; \
    else \
      npm install --omit=dev --no-audit --no-fund; \
    fi

COPY . .

EXPOSE 5000

CMD ["node", "dist/app/server.js"]