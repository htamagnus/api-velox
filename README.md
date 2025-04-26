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

🎯 **Status**: Concluído (v1) — Melhorias planejadas: aumentar cobertura de testes unitários com Jest.

---

## 📦 Tecnologias utilizadas

- NestJS (backend framework)
- TypeORM (ORM para PostgreSQL)
- PostgreSQL (banco de dados)
- Swagger (documentação automática da API)
- JWT e Bcrypt (autenticação segura)
- Zod (validação de dados)
- Google Maps Directions API (cálculo de rotas)
- Strava API (importação da velocidade média)
- Jest (testes unitários e e2e)
- ESLint + Prettier (padronização de código)

---

## 🛠️ Pré-requisitos

Antes de começar, você vai precisar ter instalado na máquina:

- [Node.js](https://nodejs.org/) v20+
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [PostgreSQL](https://www.postgresql.org/) rodando localmente ou em serviço remoto
- Conta no [Strava Developers](https://developers.strava.com/) para criar uma aplicação OAuth
- Chave de API do [Google Maps Platform](https://developers.google.com/maps)

---

## ⚙️ Configuração e Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/htamagnus/api-velox.git
cd api-velox
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

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

----

## 🚀 Como rodar o projeto

```bash
npm run start:dev
```

---

## 📚 Documentação Swagger

Após rodar o servidor, acesse:

```bash
http://localhost:3000/api

```

---

## 🧠 Funcionalidades principais

- Cadastro de altura, peso, idade do ciclista

- Cadastro ou importação da velocidade média geral via Strava OAuth

- Cálculo da distância e tempo estimado de rotas

- Estimativa de calorias gastas e ganho/perda de elevação

- Visualização de rotas integradas via Google Maps

---


## 📌 **Objetivo da V1**

Permitir ao usuário calcular o tempo estimado e o gasto calórico de uma rota ciclística com base em sua velocidade média e dados pessoais, de forma manual ou integrada com o Strava.

### 🧩 Requisitos Funcionais (RF)

| Código | Descrição |
| --- | --- |
| **RF01** | O usuário deve preencher seus dados cadastrais: **altura, peso, idade**. |
| **RF02** | O usuário deve preencher sua **velocidade média por modalidade** (ex: Road, MTB). |
| **RF03** | O usuário pode optar por importar sua média geral de velocidade automaticamente do Strava, via OAuth. |
| **RF03.1** | O app deve exibir um botão com o texto **"Descubra sua média geral integrando com o Strava"** durante o onboarding. |
| **RF03.2** | Se a média for importada via Strava, o app deve armazenar uma flag (averageSpeedGeneralIsFromStrava = true) para indicar a origem do dado. |
| **RF03.3** | O app deve permitir que o usuário preencha manualmente sua média geral, como alternativa à integração com o Strava. |
| **RF03.4** | Após a importação da média geral do Strava, o app deve direcionar o usuário para uma etapa onde ele possa **preencher manualmente as médias por modalidade (Road e MTB)**, com sugestão de que isso melhora a precisão. |
| **RF03.5** | O front pode exibir uma mensagem como "Esse dado foi importado do Strava" se a flag estiver verdadeira. |
| **RF05** | O app deve permitir que o usuário **insira origem e destino de uma rota**. |
| **RF06** | O app deve consumir a **Google Directions API** para obter a distância da rota. |
| **RF07** | O app deve calcular o **tempo estimado da rota**, com base na distância e na velocidade média do usuário. |
| **RF08** | O app deve calcular o **gasto calórico estimado**, com base no tempo, peso e intensidade (modalidade). |
| **RF09** | O app deve apresentar a rota graficamente em um mapa estilizado (Google Maps customizado). |
| **RF10** | O usuário que se conecta via Strava terá o campo averageSpeedGeneral preenchido automaticamente, podendo ainda ajustar manualmente as médias específicas: averageSpeedRoad e averageSpeedMtb. |

---

### ⚙️ **Requisitos Não Funcionais (RNF)**

| Código | Descrição |
| --- | --- |
| **RNF01** | O app deve ter uma interface intuitiva e fluida, com visual **clean e estilo Apple-like**. |
| **RNF02** | O app deve oferecer **transições suaves** entre os passos do onboarding (Framer Motion sugerido). |
| **RNF03** | O Google Maps deve ser **customizado com cores claras e minimalistas** para se integrar à identidade do app. |
| **RNF04** | A integração com a Strava deve seguir o padrão OAuth2, com autenticação segura e controle de tokens. |
| **RNF05** | O app deve funcionar de forma responsiva em dispositivos móveis. |

---

### 🧠 **Regras de Negócio (RB)**

| Código | Descrição |
| --- | --- |
| **RB01** | É obrigatório que o usuário preencha os dados pessoais e velocidades médias antes de acessar o planejador de rotas. |
| **RB02** | A velocidade média pode ser preenchida manualmente ou ser importada do Strava. |
| **RB03** | O cálculo de calorias será baseado em fórmulas aproximadas utilizando: peso, tempo estimado, e tipo de atividade (modalidade). |
| **RB04** | Cada modalidade (road, MTB, etc.) tem sua própria velocidade média associada e usada nos cálculos. |
| **RB05** | O usuário pode preencher a média geral (averageSpeedGeneral) manualmente ou importar automaticamente do Strava. |
| **RB06** | Caso a média seja importada via Strava, a flag averageSpeedGeneralIsFromStrava deve ser marcada como true. |
| **RB07** | O app incentivará o preenchimento manual das médias específicas por modalidade (averageSpeedRoad, averageSpeedMtb) para garantir maior precisão no planejamento de rotas. |
| **RB08** | A média importada do Strava deve ser baseada nas últimas 30 atividades do tipo “Ride”. |

---