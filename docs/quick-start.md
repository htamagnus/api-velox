# quick start — backend velox

este guia reúne o básico para instalar, configurar e rodar o backend localmente.

## tecnologias utilizadas

- nestjs (backend framework)
- typeorm (orm para postgresql)
- postgresql (banco de dados)
- swagger (documentação automática da api)
- jwt e bcrypt (autenticação)
- zod (validação de dados)
- google maps directions api (cálculo de rotas)
- strava api (importação da velocidade média)
- jest (testes)
- eslint + prettier (padronização)

---

## pré-requisitos

- node.js v20+
- nestjs cli
- postgresql (local ou remoto)
- conta no strava developers (app oauth)
- chave de api do google maps platform

---

## configuração e instalação

### 1) clonar o repositório

```bash
git clone https://github.com/htamagnus/api-velox.git
cd api-velox
```

### 2) instalar dependências

```bash
npm install
```

### 3) variáveis de ambiente

crie um arquivo `.env` na raiz do projeto com o conteúdo:

```bash
STRAVA_CLIENT_SECRET=
STRAVA_CLIENT_ID=
GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_API_URL=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
STRAVA_API_URL=https://www.strava.com/api/v3
JWT_SECRET=
JWT_ISSUER=api-velox
JWT_AUDIENCE=velox-client
PORT=8080
```

---

## como rodar o projeto

```bash
npm run start:dev
```

---

## documentação swagger

depois de iniciar o servidor:

```bash
http://localhost:8080/docs
```

---

## próximos passos

- requisitos e regras (rf/rnf/rb): `docs/v1/requirements.md`
- deploy (arquitetura): `docs/deploy-architecture.md`
