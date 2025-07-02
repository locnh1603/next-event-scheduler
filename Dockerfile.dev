FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json pnpm-workspace.yaml ./
RUN npm install -g pnpm@10.11.0
RUN pnpm install

# Copy source code (remove the chown part)
COPY . .

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Use the dev command for hot reload
CMD ["pnpm", "dev"]