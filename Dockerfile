# Multi-stage build for production
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Build stage  
FROM base AS builder

# Build arguments for Next.js
ARG NEXT_PUBLIC_VAPI_PUBLIC_KEY
ARG NEXT_PUBLIC_VAPI_ASSISTANT_ID
ARG NEXT_PUBLIC_SIMLI_API_KEY
ARG NEXT_PUBLIC_SIMLI_FACE_ID
ARG NEXT_PUBLIC_APP_NAME="Doctor Donut Drive-Thru"
ARG NEXT_PUBLIC_APP_VERSION="1.0.0"

# Set environment variables for build
ENV NEXT_PUBLIC_VAPI_PUBLIC_KEY=${NEXT_PUBLIC_VAPI_PUBLIC_KEY}
ENV NEXT_PUBLIC_VAPI_ASSISTANT_ID=${NEXT_PUBLIC_VAPI_ASSISTANT_ID}
ENV NEXT_PUBLIC_SIMLI_API_KEY=${NEXT_PUBLIC_SIMLI_API_KEY}
ENV NEXT_PUBLIC_SIMLI_FACE_ID=${NEXT_PUBLIC_SIMLI_FACE_ID}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production stage
FROM base AS runner
RUN apk add --no-cache curl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]