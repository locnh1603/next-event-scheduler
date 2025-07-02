FROM node:22-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files first for better layer caching
COPY package*.json pnpm-workspace.yaml ./

# Install dependencies
RUN corepack enable pnpm
RUN corepack prepare pnpm@10.11.0 --activate
RUN pnpm install

# Copy source code
COPY . .

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Build the application
RUN pnpm build

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["pnpm", "start"]