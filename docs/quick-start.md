# quick start — backend velox

este guia reúne o básico para instalar, configurar e rodar o backend localmente.

## tecnologias utilizadas

- nestjs (backend framework)
- typeorm (orm para postgresql)
- postgresql (banco de dados)
- swagger (documentação automática da api)
- jwt e bcrypt (autenticação)
- zod (validação de dados)
- google maps directions, distance matrix e elevation api (rotas, tempo e elevação)
- openweathermap (previsão do tempo)
- strava api (importação da velocidade média)
- jest (testes)
- eslint + prettier (padronização)

---

## pré-requisitos

- node.js v22
- pnpm 9
- postgresql (local ou remoto)
- conta no strava developers (app oauth)
- chave de api do google maps platform
- chave de api do openweathermap

---

## configuração e instalação

### 1) clonar o repositório

```bash
git clone https://github.com/htamagnus/api-velox.git
cd api-velox
```

### 2) instalar dependências

```bash
pnpm install
```

### 3) variáveis de ambiente

crie um arquivo `.env` na raiz do projeto com o conteúdo (todas são obrigatórias, o app não sobe sem elas):

```bash
STRAVA_CLIENT_SECRET=
STRAVA_CLIENT_ID=
STRAVA_API_URL=https://www.strava.com/api/v3
GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_API_URL=https://maps.googleapis.com/maps/api
OPENWEATHER_API_KEY=
OPENWEATHER_API_URL=https://api.openweathermap.org/data/2.5
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=5432
DB_SSL=false
JWT_SECRET=
JWT_ISSUER=api-velox
JWT_AUDIENCE=velox-client
ALLOWED_ORIGINS=http://localhost:3000
PORT=8080
```

---

## como rodar o projeto

```bash
pnpm start:dev
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
- deploy: seção "deploy" do `README.md`
