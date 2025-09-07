# Base image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# --- Dependencies stage ---
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# --- Build stage ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments (only for PUBLIC_* vars)
ARG PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ARG PUBLIC_SUPABASE_ANON_KEY=placeholder_anon_key
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY

RUN corepack enable pnpm && npx svelte-kit sync && pnpm run build

# --- Production deps only ---
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --prod --frozen-lockfile

# --- Runner stage ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

# Copy built app and prod deps only
COPY --from=builder /app/build ./build
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER sveltekit
EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "build"]