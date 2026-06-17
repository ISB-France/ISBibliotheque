FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backend/package.json apps/backend/package.json

RUN pnpm install --frozen-lockfile --filter @isbibliotheque/frontend --include-workspace-root

COPY apps/frontend apps/frontend

EXPOSE 5173
ENV VITE_API_PROXY_TARGET=http://backend:4000
CMD ["pnpm", "--filter", "@isbibliotheque/frontend", "dev"]
