<h1 align="center" style="font-weight: bold;"> 🚴‍♂️ VELOX API — Backend para Planejamento de Rotas de Ciclismo</h1>

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

Aplicação backend desenvolvida em NestJS para estimar tempo de percurso, distância, calorias gastas e ganho/perda de elevação com base na velocidade média real do ciclista.
O sistema integra dados do Strava (velocidade média geral) e do Google Maps (distância e rota), proporcionando cálculos personalizados para ciclistas de diferentes modalidades (MTB, Speed, etc.).

🎯 **Status**: Concluído (v1).
**Próximos passos**: Melhorias para v2.


---

## sumário

- [como começar](#quick-start)
- [requisitos e regras](#requisitos)
- [deploy na aws](#deploy)

---

<a id="quick-start"></a>
## 🛠️ como começar (quick start)

este guia reúne o básico para instalar, configurar e rodar o backend localmente:
- [docs/quick-start.md](docs/quick-start.md)


---

<a id="requisitos"></a>
## 📌 requisitos e regras de negócio do velox

### objetivo da v1

permitir ao usuário calcular o tempo estimado e o gasto calórico de uma rota ciclística com base em sua velocidade média e dados pessoais, de forma manual ou integrada com o strava.

para rf, rnf e regras de negócio, mais infos na doc:

- [docs/v1/requirements.md](docs/v1/requirements.md)

---

<a id="deploy"></a>
## 🚢 deploy na aws

- visão geral, diagramas e decisões: [docs/deploy-architecture.md](docs/deploy-architecture.md)