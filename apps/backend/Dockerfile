FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN pnpm install --frozen-lockfile --filter @isbibliotheque/backend --include-workspace-root

COPY apps/backend apps/backend

EXPOSE 4000
CMD ["pnpm", "--filter", "@isbibliotheque/backend", "dev"]
