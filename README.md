<div align="center">
  <img src="docs/images/velox-logo.svg" alt="velox logo" width="340">
</div>

</br>

<div align="center">
  
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=for-the-badge)](https://nestjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-2C1E4E?logo=typeorm&logoColor=white&style=for-the-badge)](https://typeorm.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white&style=for-the-badge)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black&style=for-the-badge)](https://swagger.io/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge)](https://jwt.io/)
[![Bcrypt](https://img.shields.io/badge/Bcrypt-0033A0?logoColor=white&style=for-the-badge)](https://github.com/kelektiv/node.bcrypt.js)
[![Zod](https://img.shields.io/badge/Zod-3F60AD?logoColor=white&style=for-the-badge)](https://zod.dev/)
[![Google Maps API](https://img.shields.io/badge/Google%20Maps%20API-4285F4?logo=googlemaps&logoColor=white&style=for-the-badge)](https://developers.google.com/maps)
[![Strava API](https://img.shields.io/badge/Strava%20API-FC4C02?logo=strava&logoColor=white&style=for-the-badge)](https://developers.strava.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white&style=for-the-badge)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=for-the-badge)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black&style=for-the-badge)](https://prettier.io/)

</div>

---

## sumário

- [📊 Fluxograma geral](#fluxograma-geral)
- [🛠️ Quick start](#quick-start)
- [📌 Requisitos e regras](#requisitos)
- [🚢 Deploy](#deploy)

---

Aplicação backend desenvolvida em NestJS para estimar tempo de percurso, distância, calorias gastas e ganho/perda de elevação com base na velocidade média real do ciclista.
O sistema integra dados do Strava (velocidade média geral) e do Google Maps (distância e rota), proporcionando cálculos personalizados para ciclistas de diferentes modalidades (MTB, Speed, etc.).

- 🎯 **Status**: Concluído (v1).
- 🎯 **Próximos passos**: Melhorias para v2.

---

<a id="fluxograma-geral"></a>

## 📊 Fluxograma geral

```mermaid
graph TB
  %% frontend
  USER[<b>Usuário</b><br/>Browser/Mobile]
  FRONT[<b>Frontend</b><br/>Next.js 15.5.28<br/>React 19<br/>TypeScript]
  
  %% pages
  FRONT -->|páginas| HOME["<b>Home</b><br/>Login/Register<br/>Onboarding<br/>Profile"]
  FRONT -->|páginas| CALC["<b>Calculate</b><br/>Route Planner<br/>Elevation Profile<br/>Metrics"]
  FRONT -->|páginas| SAVED["<b>Saved Routes</b><br/>Historic<br/>Statistics"]
  FRONT -->|páginas| STRAVA["<b>Strava Integration</b><br/>OAuth Callback"]
  
  %% backend
  BACK[<b>Backend API</b><br/>NestJS 10.x<br/>Node.js 22.x<br/>TypeScript]
  
  %% backend modules
  BACK -->|modules| ATHLETE["<b>Athlete Module</b><br/>Auth/Register<br/>Profile Management<br/>JWT Tokens"]
  BACK -->|modules| TRAFFIC["<b>Traffic Module</b><br/>Real-time Alerts<br/>Route Analysis"]
  BACK -->|modules| WEATHER["<b>Weather Module</b><br/>Current Conditions<br/>Forecast"]
  
  %% database
  DB[<b>PostgreSQL 18</b><br/>Neon]
  BACK -->|queries| DB
  
  %% external services
  STRAVA_API["<b>Strava API</b><br/>Activity Data<br/>Athlete Stats"]
  GMAPS["<b>Google Maps API</b><br/>Routes<br/>Elevation<br/>Traffic"]
  WEATHER_API["<b>Weather API</b><br/>Current/Forecast"]
  
  BACK -.->|integrations| STRAVA_API
  BACK -.->|integrations| GMAPS
  BACK -.->|integrations| WEATHER_API
  
  %% frontend to backend
  FRONT -->|HTTP/HTTPS| BACK
  
  %% user interactions
  USER -->|acessa| FRONT
  
  %% styling
  classDef frontend fill:#B8E6D5,stroke:#6B9B87,stroke-width:2px,color:#2D5245
  classDef backend fill:#B8D4E6,stroke:#6B8EA6,stroke-width:2px,color:#2D495C
  classDef database fill:#FFD4B8,stroke:#B38A6B,stroke-width:2px,color:#5C3D2D
  classDef external fill:#E0E8EB,stroke:#8FA5AC,stroke-width:2px,color:#3D4F56
  classDef user fill:#FFF,stroke:#999,stroke-width:2px,color:#333
  classDef pages fill:#D4F4FF,stroke:#8AAAB3,stroke-width:2px,color:#3D565C
  classDef modules fill:#E6D4FF,stroke:#9B8AB3,stroke-width:2px,color:#4A3D5C
  
  class FRONT frontend
  class BACK backend
  class DB database
  class STRAVA_API,GMAPS,WEATHER_API external
  class USER user
  class HOME,CALC,SAVED,STRAVA pages
  class ATHLETE,TRAFFIC,WEATHER modules
```

---

<a id="quick-start"></a>

## 🛠️ Como começar (quick start)

este guia reúne o básico para instalar, configurar e rodar o backend localmente:
- [docs/quick-start.md](docs/quick-start.md)


---

<a id="requisitos"></a>

## 📌 Requisitos e regras de negócio do velox

#### objetivo da v1:

permitir ao usuário calcular o tempo estimado e o gasto calórico de uma rota ciclística com base em sua velocidade média e dados pessoais, de forma manual ou integrada com o strava.

para rf, rnf e regras de negócio, mais infos na doc:

- [docs/v1/requirements.md](docs/v1/requirements.md)

---

<a id="deploy"></a>
## 🚢 Deploy

hospedagem 100% no plano gratuito:

| parte | onde | observação |
|-------|------|------------|
| api | render (free web service), região virginia | dorme após 15 min sem requisição; a primeira requisição depois disso leva ~1 min |
| banco | neon (free), projeto `velox`, branch `production`, aws us-east-1 | postgres 18, 0,5 gb; tabelas criadas pelo `synchronize: true` |
| front | vercel (hobby), `https://web-velox.vercel.app` | ver o [readme do front](https://github.com/htamagnus/web-velox#-deploy) |

### render

| campo | valor |
|-------|-------|
| build command | `npx pnpm@9 install --frozen-lockfile && npx pnpm@9 run build` |
| start command | `npm start` |
| health check path | `/status` |

- pnpm fixo na 9: a partir do pnpm 10 os scripts de instalação das dependências não rodam por padrão, e o binário do `bcrypt` não é gerado (`Cannot find module bcrypt_lib.node`).
- variáveis de ambiente: as mesmas do `.env`, com os `DB_*` do neon (conexão direta, host sem `-pooler`) e `ALLOWED_ORIGINS` com a url do front. `PORT` não é definida, o render injeta.
- deploy automático a cada push na `main`.

### google maps (gcp, projeto `velox-474919`)

o plano grátis do google maps é uma cota mensal por api, e só vale com a conta de faturamento ativa. para nunca passar dela, cada api usada tem limite diário (cota grátis ÷ 31):

| api | cota limitada | grátis/mês | limite/dia |
|-----|---------------|------------|------------|
| Directions API | Requests per day | 10.000 | 320 |
| Distance Matrix API | Elements per day | 10.000 | 320 |
| Maps Elevation API | Requests per day | 5.000 | 160 |
| Maps JavaScript API | Map loads per day | 10.000 | 320 |
| Places API (New) | AutocompletePlacesRequest per day e GetPlaceRequest per day | 10.000 cada | 320 cada |

uma chave para cada lado, cada uma liberada só para as apis que usa:

| chave | onde | apis liberadas | restrição de aplicativo |
|-------|------|----------------|-------------------------|
| `velox-back` | render (`GOOGLE_MAPS_API_KEY`) | Directions, Distance Matrix, Maps Elevation | nenhuma: chamadas do servidor não têm site de origem |
| `velox-app` | vercel (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) | Maps JavaScript, Places API (New), Directions | sites: `https://web-velox.vercel.app/*` e `http://localhost:3000/*` |

- ao bater o limite, a api devolve erro em vez de cobrar.
- alerta de orçamento de R$ 5 na conta de faturamento.
- usar uma api nova do google no código exige liberá-la na chave do lado que chama e definir o limite diário dela.

arquitetura anterior (aws): [docs/deploy-architecture.md](docs/deploy-architecture.md)
