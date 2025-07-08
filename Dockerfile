FROM node:22-alpine

WORKDIR /app

## Enable Corepack & pin pnpm, then install deps deterministically
RUN corepack enable \
  && corepack prepare pnpm@10.11.0 --activate

# Copy package files first
COPY package*.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Use the dev command for hot reload
CMD ["pnpm", "dev"]