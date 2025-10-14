# build stage
FROM node:20-alpine AS builder

# instala pnpm
RUN npm install -g pnpm

WORKDIR /app

# copia arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# instala dependências
RUN pnpm install --frozen-lockfile

# copia código fonte
COPY . .

# build da aplicação
RUN pnpm run build

# production stage
FROM node:20-alpine

# instala pnpm
RUN npm install -g pnpm

# cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /app

# copia package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# instala apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# copia build da stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json

# muda ownership dos arquivos para o usuário nestjs
RUN chown -R nestjs:nodejs /app

# usa usuário não-root
USER nestjs

# expõe porta
EXPOSE 8080

# health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8080/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# comando para iniciar a aplicação
CMD ["pnpm", "run", "start:prod"]

