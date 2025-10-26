# requisitos do backend velox

## objetivo da v2

melhorias e novas funcionalidades para otimizar a experiência do usuário: oferecendo múltiplas rotas inteligentes com critérios variados, e informações de tráfego em tempo real para apoiar melhores decisões de quando pedalar.

---

## requisitos funcionais (rf)

| código | descrição |
| --- | --- |
| **RF01** | o app deve calcular e exibir **3 variações de rota**: "menos tráfego", "mais verde" e "bonita". |
| **RF02** | cada variação de rota deve exibir **tempo estimado, distância e pontuação** do critério específico. |
| **RF03** | o app deve consumir a **google maps real-time traffic api** para exibir tráfego atual na rota escolhida no planejamento. |
| **RF06** | o app deve exibir **alertas proativos** se o tráfego for intenso na rota planejada (ex: "tráfego intenso em 1h. quer adiar?"). |

---

## requisitos não funcionais (rnf)

| código | descrição |
| --- | --- |
| **RNF01** | o app deve exibir as 3 variações de rota de forma **clara e comparável**, com cards visuais diferenciados. |

---

## regras de negócio (rb)

| código | descrição |
| --- | --- |
| **RB01** | as 3 variações de rota devem ser calculadas sempre que o usuário inserir origem e destino. |
| **RB02** | o usuário deve ser capaz de alternar entre as variações de rota e ver detalhes de cada uma (tempo, distância, pontuação). |
| **RB05** | o app deve armazenar histórico de precisão de previsões de tráfego para feedback e melhoria do modelo. |


