FROM node:22

WORKDIR /app

COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY .env ./

RUN corepack enable pnpm
RUN pnpm install --recursive

COPY . .

RUN pnpm run build --recursive

EXPOSE 3000

CMD ["pnpm", "start"]