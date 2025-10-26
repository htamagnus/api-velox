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

### 4. previsão de tráfego

**problema**: rota planejada pode ficar congestionada quando o usuário realmente sair. sem alertas de tráfego.

**solução**: integrar dados de tráfego em tempo real e alertar

#### implementação
- ao calcular rota, exibir tráfego atual via google maps real-time traffic
- mostrar severidade:
  - "tráfego normal" - verde
  - "tráfego intenso" - amarelo
  - "congestionado" - vermelho
- alerta proativo: "tráfego intenso na sua rota em 1h. pense em talvez adiar."

#### valor de negócio
- **menos frustrações**: usuário sabe se vale a pena sair agora
- **google maps integration**: aproveita infraestrutura existente (strava já usa)

---



