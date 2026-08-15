FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/tick-worker ./apps/tick-worker
COPY packages ./packages
RUN npm install --omit=dev
WORKDIR /app/apps/tick-worker
CMD ["npx", "tsx", "src/main.ts"]
