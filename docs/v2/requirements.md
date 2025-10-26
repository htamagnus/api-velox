# requisitos do backend velox

## objetivo da v2

melhorias e novas funcionalidades para otimizar a experiência do usuário: oferecendo múltiplas rotas inteligentes com critérios variados, e informações de tráfego em tempo real para apoiar melhores decisões de quando pedalar.

---

## requisitos funcionais (rf)

| código | descrição |
| --- | --- |
| **RF01** | o app deve calcular e exibir **3 variações de rota**: "menos tráfego", "mais verde" e "bonita". |
| **RF02** | cada variação de rota deve exibir **tempo estimado, distância e pontuação** do critério específico. |
| **RF03** | o app deve consumir a **google maps real-time traffic api** para exibir tráfego atual na rota. |
| **RF04** | o app deve exibir a **severidade do tráfego** em 3 níveis: "normal" (verde), "intenso" (amarelo), "congestionado" (vermelho). |
| **RF05** | o app deve **atualizar o status de tráfego a cada 2-5 minutos** enquanto a rota está sendo visualizada. |
| **RF06** | o app deve enviar **alertas proativos** quando tráfego ficar intenso na rota planejada (ex: "tráfego intenso em 1h. quer adiar?"). |
| **RF07** | o app deve sugerir **rotas alternativas** se o tráfego na rota atual piorar significativamente. |

---

## requisitos não funcionais (rnf)

| código | descrição |
| --- | --- |
| **RNF01** | o app deve exibir as 3 variações de rota de forma **clara e comparável**, com cards visuais diferenciados. |
| **RNF02** | as atualizações de tráfego devem ter **latência mínima** (máximo 30 segundos de delay em relação aos dados reais). |
| **RNF03** | o consumo de api de tráfego deve ser **otimizado** para evitar excesso de requisições. |

---

## regras de negócio (rb)

| código | descrição |
| --- | --- |
| **RB01** | as 3 variações de rota devem ser calculadas sempre que o usuário inserir origem e destino. |
| **RB02** | o usuário deve ser capaz de alternar entre as variações de rota e ver detalhes de cada uma (tempo, distância, pontuação). |
| **RB03** | o tráfego é atualizado automaticamente enquanto o usuário visualiza a rota, sem necessidade de ação manual. |
| **RB04** | alertas de tráfego devem ser disparados apenas quando a severidade passar para "intenso" ou "congestionado". |
| **RB05** | o app deve armazenar histórico de precisão de previsões de tráfego para feedback e melhoria do modelo. |


