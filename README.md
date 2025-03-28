## ✅ Velox v1 – Requisitos do App de Rotas para Ciclistas


### 📌 **Objetivo da V1**

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