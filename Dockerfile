FROM node:22-alpine

WORKDIR /app

# Enable Corepack and install dependencies
RUN corepack enable
COPY package*.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN pnpm install

# Copy source code
COPY . /app

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Use the dev command for hot reload
CMD ["pnpm", "dev"]