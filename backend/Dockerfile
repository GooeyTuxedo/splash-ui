FROM node:21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build


FROM node:21-slim
WORKDIR /app
RUN chown -R node:node /app
USER node
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build --chown=node:node /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]