# requisitos do backend velox

## objetivo da v1

permitir ao usuário calcular o tempo estimado e o gasto calórico de uma rota ciclística com base em sua velocidade média e dados pessoais, de forma manual ou integrada com o strava.

---

## requisitos funcionais (rf)

| código | descrição |
| --- | --- |
| **RF01** | o usuário deve preencher seus dados cadastrais: **altura, peso, idade**. |
| **RF02** | o usuário deve preencher sua **velocidade média por modalidade** (ex: road, mtb). |
| **RF03** | o usuário pode optar por importar sua média geral de velocidade automaticamente do strava, via oauth. |
| **RF03.1** | o app deve exibir um botão com o texto "descubra sua média geral integrando com o strava" durante o onboarding. |
| **RF03.2** | se a média for importada via strava, o app deve armazenar uma flag (averageSpeedGeneralIsFromStrava = true) para indicar a origem do dado. |
| **RF03.3** | o app deve permitir que o usuário preencha manualmente sua média geral, como alternativa à integração com o strava. |
| **RF03.4** | após a importação da média geral do strava, o app deve direcionar o usuário para uma etapa onde ele possa **preencher manualmente as médias por modalidade (road e mtb)**, com sugestão de que isso melhora a precisão. |
| **RF03.5** | o front pode exibir uma mensagem como "esse dado foi importado do strava" se a flag estiver verdadeira. |
| **RF05** | o app deve permitir que o usuário **insira origem e destino de uma rota**. |
| **RF06** | o app deve consumir a **google directions api** para obter a distância da rota. |
| **RF07** | o app deve calcular o **tempo estimado da rota**, com base na distância e na velocidade média do usuário. |
| **RF08** | o app deve calcular o **gasto calórico estimado**, com base no tempo, peso e intensidade (modalidade). |
| **RF09** | o app deve apresentar a rota graficamente em um mapa estilizado (google maps customizado). |
| **RF10** | o usuário que se conecta via strava terá o campo averageSpeedGeneral preenchido automaticamente, podendo ainda ajustar manualmente as médias específicas: averageSpeedRoad e averageSpeedMtb. |

---

## requisitos não funcionais (rnf)

| código | descrição |
| --- | --- |
| **RNF01** | o app deve ter uma interface intuitiva e fluida, com visual **clean e estilo apple-like**. |
| **RNF02** | o app deve oferecer **transições suaves** entre os passos do onboarding. |
| **RNF03** | o google maps deve ser **customizado com cores claras e minimalistas** para se integrar à identidade do app. |
| **RNF04** | a integração com a strava deve seguir o padrão oauth2, com autenticação segura e controle de tokens. |
| **RNF05** | o app deve funcionar de forma responsiva em dispositivos móveis. |

---

## regras de negócio (rb)

| código | descrição |
| --- | --- |
| **RB01** | é obrigatório que o usuário preencha os dados pessoais e velocidades médias antes de acessar o planejador de rotas. |
| **RB02** | a velocidade média pode ser preenchida manualmente ou ser importada do strava. |
| **RB03** | o cálculo de calorias será baseado em fórmulas aproximadas utilizando: peso, tempo estimado, e tipo de atividade (modalidade). |
| **RB04** | cada modalidade (road, mtb, etc.) tem sua própria velocidade média associada e usada nos cálculos. |
| **RB05** | o usuário pode preencher a média geral (averageSpeedGeneral) manualmente ou importar automaticamente do strava. |
| **RB06** | caso a média seja importada via strava, a flag averageSpeedGeneralIsFromStrava deve ser marcada como true. |
| **RB07** | o app incentivará o preenchimento manual das médias específicas por modalidade (averageSpeedRoad, averageSpeedMtb) para garantir maior precisão no planejamento de rotas. |
| **RB08** | a média importada do strava deve ser baseada nas últimas 30 atividades do tipo “ride”. |


