FROM node:22-alpine

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/backend/prisma apps/backend/prisma
COPY apps/frontend/package.json apps/frontend/package.json

RUN pnpm install --frozen-lockfile --filter @isbibliotheque/backend --include-workspace-root

RUN pnpm --filter @isbibliotheque/backend prisma generate

COPY apps/backend apps/backend

EXPOSE 4000
CMD ["pnpm", "--filter", "@isbibliotheque/backend", "dev"]
