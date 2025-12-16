# Étape 1 : build
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# Étape 2 : image finale
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copier uniquement le résultat du build et les fichiers nécessaires
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

EXPOSE 5000
CMD ["node", "dist/app/server.js"]
