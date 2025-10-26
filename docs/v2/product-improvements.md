# melhorias e funcionalidades para velox v2

### 1. previsão de clima na rota (aumento de valor)

**problema**: usuário planeja rota mas não sabe se vale a pena sair (vai chover? muito calor?)

**solução**: integrar api de clima

#### implementação
- ao calcular rota, buscar previsão de clima para região/horário
- mostrar cards de condições:
  - temperatura (18°C - 24°C)
  - probabilidade de chuva (20%)
  - vento (15km/h NO)
  - qualidade do ar (boa)
- alertas contextuais: "☔ alta chance de chuva às 16h, considere sair mais cedo"

#### valor de negócio
- **diferenciação**: strava e google maps não fazem isso
- **utilidade real**: decisão mais informada
- **mais tempo no app**: usuário consulta clima aqui
- **contexto para feedback**: "choveu como previsto?"

#### apis sugeridas
- openweathermap (grátis até 1000 calls/dia)
- weatherapi.com (grátis até 1M calls/mês)
- visual crossing (grátis até 1000 calls/dia)

---

### 2. pontos de interesse (pois) na rota (utilidade extra)

**problema**: rota é só uma linha no mapa, sem contexto do que há no caminho.

**solução**: marcar pontos relevantes para ciclistas

#### pois sugeridos
- postos de gasolina (água, banheiro)
- oficinas de bike
- cafés/restaurantes
- pontos turísticos
- estacionamentos/bicicletários
- subidas/descidas íngremes (automático via elevação)

#### implementação
- integrar google places api
- filtros: "mostrar postos", "mostrar oficinas"
- alertas: "há 3 postos ao longo da rota"

#### valor de negócio
- **praticidade**: usuário sabe onde reabastecer
- **segurança**: sabe onde há suporte
- **parcerias**: oficinas podem ser destacadas (monetização futura)

---
---

### 3. otimização multiobjetivo (rotas inteligentes)

**problema**: rota mais rápida pode ter muito tráfego ou estar em avenida feia. sem contexto sobre alternativas.

**solução**: gerar múltiplas rotas otimizadas para diferentes objetivos

#### implementação
- calcular e exibir 3 variações de rota:
  - "rota com menos tráfego" - prioriza vias com tráfego baixo
  - "rota mais verde" - favorece ciclovias, parques, vias arborizadas
  - "rota bonita" - paisagem mais interessante, pontos turísticos
- comparação visual: tempo estimado, distância, pontuação de cada critério
- cada rota tem card com badges: "35min", "12km", "tráfego baixo ✓"

#### valor de negócio
- **diferenciação forte**: nenhum competitor oferece isso
- **escolha informada**: usuário decide o que importa pra ele
- **retenção**: mais tempo explorando rotas
- **dados comportamentais**: qual tipo de rota cada usuário prefere

---

### 4. previsão de tráfego (contexto em tempo real)

**problema**: rota planejada pode ficar congestionada quando o usuário realmente sair. sem alertas de tráfego.

**solução**: integrar dados de tráfego em tempo real e alertar

#### implementação
- ao calcular rota, exibir tráfego atual via google maps real-time traffic
- mostrar severidade:
  - "tráfego normal" - verde
  - "tráfego intenso" - amarelo
  - "congestionado" - vermelho
- atualizar status a cada 2-5 minutos
- alerta proativo: "tráfego intenso na sua rota em 1h. quer adiar?"
- sugerir rota alternativa se tráfego piorar

#### valor de negócio
- **rota sempre relevante**: informação atual, não estática
- **menos frustrações**: usuário sabe se vale a pena sair agora
- **dados reais**: feedback se previsão foi precisa
- **google maps integration**: aproveita infraestrutura existente (strava já usa)

---



