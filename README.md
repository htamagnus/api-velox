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
- [🚢 Deploy na aws](#deploy)

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
  FRONT[<b>Frontend</b><br/>Next.js 15.2.4<br/>React 19<br/>TypeScript]
  
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
  DB[<b>PostgreSQL 15.x</b><br/>Aurora RDS]
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
## 🚢 Deploy na aws

- visão geral, diagramas e decisões: [docs/deploy-architecture.md](docs/deploy-architecture.md)
