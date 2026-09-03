# PRD — Radar de Oportunidades
**Versão:** 1.5 — piloto fechado (beta)
**Data:** 3 setembro 2026 (última atualização)
**Estado:** MVP em construção. Migração de dados Airtable → Supabase **concluída** para setores, obrigações e fundos (RLS ativo em todas as tabelas). Decisão tomada em 30 ago. 2026: o Softr sai. **Publicado no Netlify em 31 ago. 2026** — o Radar de Oportunidades tem, pela primeira vez, um URL público (registo → sessão autenticada → feed filtrado por setor com dados reais, a funcionar em produção, não só localmente). Ver secção 7.2 para detalhes técnicos e o que falta antes de ser usado por alguém fora da equipa.
**Documentos-fonte:** `roteiro-curso-consultoria.md`, `roteiro-4-ideias.md`, `roteiro-radar-oportunidades-pos-missao2.md`, `roteiro-radar-oportunidades-mvp-a-serio.md`
**Nota de localização (a partir da v1.5):** este ficheiro passa a viver no repositório GitHub (`saramscruz/radar-oportunidades`, `docs/prd-radar-oportunidades.md`), versionado pelo Git — deixa de ser um ficheiro solto mantido só no projeto Claude. Notas de revisão futuras podem ficar mais curtas aqui, apoiando-se no histórico de commits para o detalhe de "o que mudou e quando".
**Nota de revisão (v1.5, 3 set. 2026):** investigação de cobertura regional de fundos (Norte/Lisboa/Alentejo 2030, ausentes da tabela `fundos` desde a migração). Três achados: (1) novo critério de triagem de candidatos, mais fiável que filtrar por `Objetivo Específico` — ver secção 7.2; (2) confirmação em fonte oficial de que Lisboa está estruturalmente excluída de pelo menos um regime geral de incentivo, não é lacuna de recolha — ver R2 na secção 8; (3) spot-check retroativo aos 16 fundos já migrados: 14/16 corretos, 2 (COMPETE2030-2026-3/6, já documentados como fechados no R4) tinham também um problema de classificação mais fundo do que o prazo — eram `Convite` a entidade única, nunca deviam ter sido candidatos a oportunidade PME. Sem impacto no produto (já inativos), mas corrige a afirmação da nota v1.3 de que a redução 21→18→16 tinha eliminado todos os casos deste tipo — não eliminou; ver R4 atualizado.
**Nota de revisão (v1.3, 30 ago. 2026):** consolida duas linhas de trabalho paralelas do mesmo dia 25-30 ago. que ainda não se tinham encontrado neste documento. (1) Desta sessão: notas de pricing (secção 9, questão 6), cadência editorial (R5) e tier profissional (R7), nascidas do feedback da Missão 5 do curso "Descodifica-te #5" — Adalo e Gumroad foram só exercícios de curso, não decisões de arquitetura; o schema-alvo e o workflow de verificação regular (secção 7.4, `historico_verificacoes`/`sla_status`). (2) De outra sessão (25 ago., "Crítica do PRD pelo Devil"): **migração Airtable → Supabase concluída** (projeto `radar-oportunidades`, ref. `echrxirbkpworpgwehkb`); histórico da tabela Fundos esclarecido — **21 → 18 → 16 registos**, reduzido por remoção deliberada de avisos cujos beneficiários elegíveis eram entidades públicas/municípios/instituições de ensino, não PMEs; os 16 fundos restantes foram verificados individualmente contra a fonte oficial, incluindo a correção de um prazo desatualizado (M2030-2026-21). Confirmado por consulta direta ao Supabase em 30 ago. 2026: 22 setores, 9 obrigações, 16 fundos, 0 empresas (a empresa de teste não foi migrada, por decisão explícita).

---

## 1. Resumo executivo

O Radar de Oportunidades é uma camada de vigilância contínua sobre fontes oficiais portuguesas e europeias que avisa PMEs, por setor de atividade (CAE), de financiamento relevante e de legislação que **poderá** afetá-las — sem nunca substituir aconselhamento profissional.

Este documento consolida o que já foi decidido em sessões anteriores, o estado real dos dados (verificado diretamente no Airtable a 25 ago. 2026) e um plano de resolução para os riscos identificados numa revisão crítica do projeto. É o documento de referência único para retomar o trabalho — substitui a necessidade de reler os quatro roteiros anteriores.

**Fase atual do projeto:** piloto fechado. Não há lançamento público até haver validação com o canal de distribuição (contabilistas/consultores de fundos) e até os riscos da secção 8 estarem mitigados ou explicitamente aceites.

---

## 2. Problema e oportunidade

**Problema:** PMEs portuguesas precisam de vigiar dezenas de fontes oficiais fragmentadas (Diário da República, EUR-Lex, Portugal 2030, IEFP, ACT, CNPD, IAPMEI...) para não perderem prazos de financiamento ou obrigações legais. A maioria não o faz de forma sistemática.

**Evidência de mercado (indireta — ver secção 8, risco R1):**
- Apenas 8,6% das PME portuguesas usam IA (fonte: INE — a confirmar referência exata antes de uso externo do dado).
- A ANACOM é autoridade nacional para o AI Act desde set. 2025.
- Concorrentes identificados: Grantavia, aiact-portugal.pt. Nicho de diferenciação percebido: notificação recorrente sem interpretação jurídica.

**Oportunidade:** uma camada de filtragem e triagem por setor, não um agregador de links nem um consultor jurídico automático.

---

## 3. O que o produto É e NÃO É

**É:**
- Uma camada de sinalização, não de interpretação.
- Filtragem por CAE-Rev.4 sobre fontes que já existem mas estão fragmentadas.
- Um produto de vigilância contínua — o valor está na atualização, não num snapshot único.

**NÃO é:**
- Um agregador genérico de links (sem vantagem competitiva).
- Um consultor jurídico automático (risco legal sem estrutura por trás).
- Uma ferramenta que atribui prioridade ou aplicabilidade definitiva a uma empresa concreta.

---

## 4. Princípios não negociáveis

Estes princípios já foram decididos e não devem ser reabertos sem motivo forte:

1. **Nunca interpretar, apenas sinalizar.** Linguagem sempre do tipo "poderá aplicar-se" / "recomendamos confirmar com um especialista". Ver texto exato no Anexo A.
2. **Correspondência Setor↔Obrigação sempre indicativa**, documentada com base legal exata (artigo do diploma), nunca inferência não rastreável.
3. **Sem conversas de validação com donos de PME.** Qualquer validação de mercado passa por outros canais — nomeadamente o canal de distribuição (contabilistas, consultores de fundos).
4. **Revisão humana antes de qualquer automatismo chegar a uma PME real.** Nenhum alerta gerado por scraping/IA sai sem passar por um humano.
5. **Nunca guardar dados sensíveis em claro sem necessidade.** NIF sempre com hash (ver secção 8, R3 — já implementado para o único registo existente).

---

## 5. Utilizadores-alvo

**Utilizador final:** PME portuguesa, qualquer setor CAE, sem departamento jurídico/compliance dedicado.

**Canal de distribuição (prioritário para validação, ver secção 8):** contabilistas e consultores de fundos que já servem PMEs e podem integrar o Radar no seu próprio serviço, em vez de o verem como concorrência.

Personas detalhadas ainda não desenvolvidas — item em aberto (secção 9).

---

## 6. Âmbito do MVP / piloto

### 6.1 Dentro do âmbito
- Setores: cobertura completa das 22 secções CAE-Rev.4.
- Obrigações legais: AI Act (Regulamento (UE) 2024/1689, alterado pelo Digital Omnibus 2026/1744) e RGPD.
- Fundos: avisos do Portugal 2030 / Balcão dos Fundos, atualização mensal.
- Perfil de empresa: NIF (com hash) → CAE → feed filtrado.
- Alertas por email, sempre com `revisto_por_humano = true` antes do envio.

### 6.2 Fora do âmbito do MVP (explicitamente adiado)
- IEFP, ACT, APA, CNPD, IAPMEI — mapear API/RSS/dados abertos só depois do MVP de 3 fontes estar estável.
- Obrigações fiscais, laborais, ambientais e de licenciamento sectorial (ver risco R2).
- Ideias de produto "Leitura" e "Pets" do roteiro original — sem prioridade.
- Cobrança/faturação — não é bloqueador do MVP técnico, mas é bloqueador de qualquer teste com clientes reais pagantes.

**Candidatas documentadas para expansão futura (pesquisadas e verificadas em 30 ago. 2026 — não implementadas, não têm ainda base legal classificada por setor no schema):**

| Obrigação | Aplica-se por | Estado |
|---|---|---|
| **NIS2 / Regime Jurídico da Cibersegurança** | **Setor (Anexos I/II do diploma) E dimensão.** Piso: ≥50 trabalhadores OU ≥10M€ faturação/balanço (Anexo III). Acima do limiar de PME (250 trab./50M€/43M€) → "essencial"; dentro do limiar médio → "importante". **Texto primário obtido em 30 ago. 2026 (diariodarepublica.pt) — corrige contagem de fontes secundárias.** Anexo I (10 setores, não 11 — Administração Pública é tratada à parte, Art. 3º): Energia, Transportes, Setor bancário, Infraestruturas do mercado financeiro, Saúde, Água potável, Águas residuais, Infraestruturas digitais, Gestão de serviços de TIC (entre empresas), Espaço. Anexo II (7 setores): Serviços postais e de estafeta, Gestão de resíduos, Químicos, Alimentação, Indústria transformadora (só dispositivos médicos + NACE divisões 26-30, não toda a indústria), Serviços digitais, Investigação | **`confianca_verificacao = 'alta'`** — Decreto-Lei n.º 125/2025, em vigor desde 3 abr. 2026. Coimas até 10M€, responsabilidade pessoal dos órgãos de gestão. **Classificação CAE**: feita para 1 de 17 setores (indústria transformadora, `obrigacoes_setores`, marcada explicitamente como parcial — só divisões 26-30, não toda a Secção C). Restantes 16 setores pendentes — definem-se por tipo de entidade/diretiva setorial (ex: "instituições de crédito"), não por código CAE direto, exigem decisão setor a setor |
| **Proteção de denunciantes (whistleblowing)** | **Dimensão apenas (≥50 trabalhadores), sem restrição de setor** — motivou a criação do campo `aplica_a_todos_setores` (ver secção 7.3), em falta no schema até agora. Exceção: entidades sujeitas a certos atos da UE (ex: prevenção de branqueamento) sempre abrangidas, independentemente da dimensão | **Na base de dados desde 31 ago. 2026**, `confianca_verificacao = 'alta'` — texto primário obtido (files.dre.pt). Lei n.º 93/2021, canal obrigatório desde 18 jun. 2022 (Art. 8º, 12º, 27º nº3-a), 31º). Coima até 125.000€ pela falta de canal ou por um canal sem garantias de confidencialidade |
| **Faturação eletrónica (CIUS-PT)** | Todas as empresas sujeitas a IVA, com prazo alargado para PME | Micro/PME podem manter PDF até 31 dez. 2026; formato estruturado CIUS-PT obrigatório a partir de 2027. Prazo já foi adiado mais do que uma vez — candidata natural a vigilância contínua |
| **European Accessibility Act (acessibilidade digital)** | Dimensão + tipo de oferta — microempresas (<10 trabalhadores, <2M€) isentas para **serviços**, mas não para **produtos digitais** que comercializem; isenção pode não se aplicar se venderem ao setor público | Decreto-Lei n.º 82/2022, em vigor desde 28 jun. 2025 |
| **RGPD — subida do limiar de isenção de ROPA (250→750 funcionários)** | Dimensão | Ainda **proposta** ("Data Omnibus"), não lei — o texto atual do Art. 30º(5) mantém-se aplicável. Não adicionar como obrigação até ser adotada; candidata a vigilância para o dia em que isso acontecer |

**Nota de arquitetura decorrente desta pesquisa:** ao contrário do AI Act e RGPD atuais (que se aplicam por CAE), a maioria destas candidatas aplica-se sobretudo ou também por **dimensão da empresa** (nº de trabalhadores, volume de negócios) — mas o NIS2 mostrou que a realidade raramente é "ou uma coisa ou outra": é setor **e** dimensão em conjunto, com limiares em dois níveis (essencial/importante). O schema-alvo (secção 7.3) já suporta esta segunda dimensão de filtragem (`aplica_por_dimensao`, `limiar_trabalhadores_min`, `limiar_faturacao_eur_min`, `logica_limiar`, `notas_aplicabilidade` — ver secção 7.3), e o NIS2 já está classificado com estes campos preenchidos (30 ago. 2026). Falta ainda a classificação setorial (Anexos I/II) para as outras três (whistleblowing, faturação eletrónica, EAA) e para completar o NIS2.

### 6.3 Critério de honestidade para a beta
O material de apresentação da beta deve nomear explicitamente a cobertura real ("AI Act & RGPD + Fundos PT2030"), não a promessa ampla implícita no nome do produto. Expandir cobertura depois, guiado pelo que os testadores pedirem primeiro.

---

## 7. Arquitetura técnica

```
FONTES OFICIAIS  →  INGESTÃO/CLASSIFICAÇÃO  →  BASE DE DADOS  →  APRESENTAÇÃO
  (scraping/API)      (script agendado)         (Postgres)        (webapp)
```

### 7.1 Estado atual (atualizado 30 ago. 2026)
- **Base de dados de destino:** Postgres via Supabase, projeto `radar-oportunidades` (ref. `echrxirbkpworpgwehkb`, organização `PMEradar`, região `eu-west-1`). **Migração concluída** para `setores` (22), `obrigacoes` (9) e `fundos` (16) + tabelas de junção `obrigacoes_setores` (105) e `fundos_setores` (87). RLS ativo em todas as tabelas. `empresas` está vazia — a empresa de teste do Airtable não foi migrada, por decisão explícita (era fictícia).
- **Ainda por migrar/decidir:** frontend continua em Softr (`chana79900.softr.app`, publicada desde 6 ago. 2026) ligado ao Airtable, não ao Supabase novo — ver secção 7.2 para o que falta para essa ligação mudar. O Airtable (base `PME - Radar de Oportunidades`, `appxWpGCQVZByLvFS`) mantém-se como fonte de trabalho corrente até essa transição.
- **Histórico da tabela Fundos** (relevante para não repetir a mesma pergunta): passou por duas reduções deliberadas, 21 → 18 → 16, por remoção de avisos cujos beneficiários elegíveis eram entidades públicas, municípios ou instituições de ensino — não PMEs. Os 16 fundos atuais foram verificados individualmente contra a fonte oficial (incluindo correção de um prazo desatualizado, M2030-2026-21). **16 é o número correto**; qualquer registo anterior a 25 ago. 2026 que mencione "21 fundos" está desatualizado. **Correção (3 set. 2026):** esta filtragem não era completa — ver R4 na secção 8. 2 dos 16 (COMPETE2030-2026-3/6) tinham um padrão diferente de beneficiário não-PME (`Convite` a entidade única/intermediária) que não tinha sido apanhado pelo critério original. Sem impacto prático (já inativos por prazo), mas o critério de triagem foi revisto — ver secção 7.2.

### 7.2 Plano — frontend e ingestão (por executar)
- Base de dados já não é o bloqueador — está pronta (7.1). O que falta é ligar um frontend a ela e construir a ingestão automatizada.
- **Critério de triagem de candidatos a fundos (adicionado 3 set. 2026, a partir da investigação de cobertura regional):** a fonte de descoberta é o `.xlsx` estruturado do Plano Anual de Avisos (`portugal2030.pt/plano-anual-de-avisos/`, ~211 avisos previstos, todos os programas). Filtrar por `Natureza Aviso = 'Concurso' AND Tipo Ent. Beneficiária IN ('Privada', 'Pública | Privada')` — **não** filtrar por `Objetivo Específico = RSO1.3`, que exclui candidatos PME-relevantes classificados fora desse código (ex.: avisos de emprego/microempreendedorismo, NORTE2030-2026-14/15/16). Avisos `Convite` ou com beneficiário exclusivamente `Pública` (ex.: CIM/Município como candidato, PME como beneficiário indireto de infraestrutura) ficam fora de âmbito — o beneficiário direto não é a PME. O ficheiro dá calendário previsto, nunca substitui confirmação na fonte oficial de cada aviso antes de `status = ativo` (não tem URL do aviso real, nem garante que abriu). **Nota de schema:** `fundos` não tem colunas para `natureza_aviso` nem `tipo_ent_beneficiaria` — a decisão de as adicionar fica pendente, junto com a decisão já em aberto sobre a coluna `regiao` (não usada em lado nenhum do código, candidata a remoção).
- **Nota técnica já resolvida:** o Airtable ligava Setor↔Obrigação e Setor↔Fundo por *linked records* nativos; isso já foi recriado como tabelas de junção explícitas (`obrigacoes_setores`, `fundos_setores`) no schema Supabase — não é trabalho pendente.
- Ingestão: scripts Python via Claude Code, agendados via GitHub Actions (cron) ou Supabase Edge Functions. **Legislação: diária, via RSS oficial da Série I** (`files.diariodarepublica.pt/rss/serie1-html.xml`, confirmado ao vivo em 2 set. 2026 — sem scraping, sem API de terceiros; a "API oficial" que circula em pesquisas — `diariodarepublica.pt/dr/api` — não existe, devolve erro, é alegação enganosa de um serviço terceiro). Fundos: mensal (sem API/RSS confirmada, inserção manual verificada contra balcaofundosue.pt) — ver workflow detalhado na secção 7.4.
  - **✅ Construído e testado em execução real (2 set. 2026)**: `scripts/ingestao_diaria_dre.py` + `.github/workflows/ingestao_diaria_dre.yml` (corre dias úteis, 09:00 UTC). Filtra por tipo de diploma (Decreto-Lei, Lei, Decreto Regulamentar, Portaria — exclui tratados internacionais e resoluções simbólicas) + palavras-chave. Primeira execução real: 8 candidatos, todos `Portaria` sem correspondência a palavras-chave — todos revistos e descartados (portarias setoriais específicas de pesca/água, não aplicáveis a PMEs). **Decisão (2 set. 2026): deixar o filtro como está por agora**, para observar o padrão real ao longo de alguns dias antes de o apertar (ex: exigir que `Portaria` também bata numa palavra-chave, não só o tipo) — apertar cedo demais arrisca cortar falsos negativos antes de se perceber o padrão real de ruído.
  - **Nunca escreve diretamente em `obrigacoes`** — grava em `stg_obrigacoes_candidatas` (tabela nova, mesmo padrão de *staging* já usado no Vinho), com estado `pendente`/`aprovado`/`descartado`. Promoção para `obrigacoes` continua manual (Princípio 4) — **ainda não existe um processo/UI para essa revisão**, só a tabela; por agora, revisão via SQL direto no Supabase.
  - **Cadência de revisão da fila: semanal, não diária** (decisão de 2 set. 2026). A recolha é diária e automática, mas os candidatos não expiram à espera — rever uma vez por semana (não os 8 todos os dias) é uma cadência mais fácil de sustentar ao longo de meses, o mesmo raciocínio que já levou à resolução do R5. Reconsiderar para uma cadência mais apertada só se/quando houver subscritores reais dependentes de prazos na fila.
  - Usa os mesmos GitHub Secrets já configurados (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) — nenhuma configuração nova necessária além de colocar os ficheiros no repositório.
- **Frontend — decisão tomada (30 ago. 2026): o Softr sai.** Motivo: ligar o Softr ao Supabase exige o plano Professional (~100-170€/mês, valor exato a confirmar — fontes consultadas discordam entre si e o preço pode ter mudado recentemente), e ficou definido que esse custo não se paga, sobretudo antes de qualquer validação de mercado (R1). Sem essa ligação, o Softr fica preso ao Airtable, o que não resolve a divergência de dados identificada nesta mesma sessão.
  - **Implicação a não subestimar:** o Softr já tem construído um fluxo de utilizador completo — login, registo, onboarding, conta, política de privacidade, termos, Fundos/Setores/Obrigações + páginas de detalhe (ver `chana79900.softr.app`). Substituir o Softr não é só trocar a fonte de dados de um bloco — é reconstruir este fluxo inteiro noutro sítio.
  - **Alternativas a avaliar** (nenhuma decidida ainda): Bolt.new/v0/Lovable (mais rápido de montar, mas com os mesmos limites de "no-code" que levaram a este impasse) vs. Next.js à medida com Supabase Auth (mais trabalho de raiz, zero dependência de planos pagos de terceiros para funcionalidade básica, controlo total sobre RLS/personalização).
  - **Antes de escolher a alternativa**, vale a pena confirmar que o RLS do Supabase em si funciona corretamente (independente de qualquer frontend) — teste leve e gratuito, via um pequeno script/página com a biblioteca cliente do Supabase, autenticando como as 2 empresas de teste já criadas (`empresa-teste-a`/`b`) e confirmando isolamento de `alertas`.
  - **✅ Teste executado e aprovado em 30 ago. 2026** (`teste-rls-radar.html`, fora do Softr, ligação direta ao Supabase com a chave anon pública). Testado nos dois sentidos: cada empresa vê exatamente o seu próprio alerta, e uma tentativa de aceder diretamente ao alerta da outra empresa por ID (não só pela listagem) foi bloqueada pelo RLS (`registos: []`, sem erro — o registo simplesmente não existe do ponto de vista de quem pede). **O RLS está a isolar corretamente ao nível da base de dados**, independentemente de qual frontend vier a usá-lo — a escolha de Bolt/v0/Lovable/Next.js já pode assentar nesta fundação com confiança.
  - **✅ Scaffold Next.js recuperado e a funcionar (30 ago. 2026).** O código já tinha sido gerado numa sessão anterior (25 ago.) mas nunca chegou a sair para o GitHub — repositório ficou vazio. Reconstruído fielmente (23 ficheiros: app Next.js + `scripts/checklist_mensal.py` + workflow de manutenção mensal), publicado em `github.com/saramscruz/radar-oportunidades`, e testado localmente com sucesso: registo de empresa → sessão autenticada → feed filtrado por setor com dados reais (obrigações + fundos). **Ajuste necessário**: foi preciso desativar "Confirm email" no Supabase Auth (Authentication → Providers → Email) — com a confirmação ativa, `signUp()` não gera sessão autenticada de imediato, e a política RLS de insert em `empresas` (que depende de `auth.uid()`) falhava. Aceitável para um piloto fechado por convite; reconsiderar se o produto vier a aceitar registos públicos.
  - **✅ Publicado no Netlify em 31 ago. 2026.** Um obstáculo real encontrado no processo: `next build` (mais rigoroso do que `next dev`) apanhou um erro de TypeScript (`implicitly has an 'any' type`) em `lib/supabase/server.ts` e `middleware.ts`, no parâmetro `cookiesToSet` da função `setAll` — corrigido com tipagem explícita derivada diretamente da API do Next.js (`Parameters<typeof cookieStore.set>[2]`), sem depender de um nome de tipo incerto do pacote `@supabase/ssr`. **Lição para o processo**: correr `npm run build` localmente antes de cada `git push` evita ciclos de deploy falhado — `next dev` é mais permissivo e não apanha estes erros.
    - **Motivo da escolha (30 ago. 2026, verificado por pesquisa):** o plano gratuito do Vercel (Hobby) **proíbe explicitamente uso comercial** nos seus termos — qualquer forma de cobrar aos visitantes (Stripe, subscrições) exige o plano Pro (20€/mês). O plano gratuito do Netlify não tem essa restrição, aceitando projetos comerciais desde o início, com limite só técnico (banda/créditos). Dado que o PRD já prevê cobrança (secção 9, questão 6 — 7,99€/14,99€), Netlify evita uma migração forçada no dia em que a cobrança começar. Suporte técnico a Server Actions e Middleware (usados neste scaffold) está confirmado como completo em ambas as plataformas — não é um fator de decisão.
    - Netlify já é a plataforma usada no VineAtlas — mesma conta, sem ferramenta nova a aprender.
  - **Por limpar antes de produção real:** os dados de teste (`empresa-teste-a`/`b` em `empresas`, 2 registos em `alertas`, e os respetivos utilizadores em `auth.users`) continuam na base de dados — úteis para testar o frontend novo quando for escolhido, mas não devem seguir para lá de qualquer lançamento com utilizadores reais.

### 7.3 Schema de dados (alvo, Postgres)

Schema base (secção 7.3 original) mais os campos e tabelas de suporte à verificação regular (secção 7.4). Os campos novos estão marcados.

```sql
setores (id, secao_cae, nome_secao, divisoes, descricao)

obrigacoes (
  id, titulo, celex_id, fonte_url, data_publicacao,
  data_entrada_vigor, resumo, base_legal_exata,
  tipo, status,
  -- novo: rasto de verificação
  data_ultima_verificacao, verificado_por,
  proxima_verificacao_prevista, confianca_verificacao,
  -- novo (30 ago. 2026): aplicabilidade por dimensão da empresa, não só CAE
  -- necessário para candidatas como NIS2, whistleblowing, EAA (secção 6.2)
  aplica_por_dimensao, limiar_trabalhadores_min,
  limiar_faturacao_eur_min, logica_limiar, notas_aplicabilidade,
  -- novo (31 ago. 2026): obrigações que não dependem do CAE (ex: whistleblowing)
  -- não podem ser modeladas só com obrigacoes_setores — descoberto ao classificar
  -- essa obrigação, que se aplica a qualquer setor, só por dimensão
  aplica_a_todos_setores
)

obrigacoes_setores (
  obrigacao_id, setor_id, confianca,
  -- novo: quem/quando classificou este cruzamento Setor↔Obrigação
  data_classificacao, classificado_por
)

fundos (
  id, nome, programa, regiao, prazo, dotacao_eur,
  modalidade_candidatura, fonte_url, setores_elegiveis, status,
  -- novo: rasto de verificação
  data_ultima_verificacao, verificado_por, proxima_verificacao_prevista
)

empresas (
  id, nif_hash, cae_principal, regiao, dimensao,
  email_contacto, data_registo, consentimento_rgpd_em, opt_out_em
)

alertas (
  id, empresa_id, tipo, referencia_id,
  texto_enviado, data_envio, revisto_por_humano,
  -- novo: distingue alerta com conteúdo do modelo "sem novidades" (Anexo A)
  sem_novidades
)

-- novo: histórico completo de verificações — cada passagem por uma fonte
-- fica registada aqui, não só o estado atual em obrigacoes/fundos.
-- É o que torna "verificado" uma afirmação auditável, não uma memória.
historico_verificacoes (
  id, tabela_referencia, registo_id, data_verificacao,
  verificado_por, tipo_verificacao, fonte_consultada,
  resultado, notas
)

-- novo: estado do SLA por mês (secção 8, R5). É esta tabela que decide
-- se a beta continua ativa ou pausa por incumprimento do ciclo mensal.
sla_status (
  mes_referencia, revisao_fundos_feita, data_revisao_fundos,
  revisao_obrigacoes_feita, data_revisao_obrigacoes, incidencias
)
```

### 7.4 Workflow de verificação regular

Esta secção substitui a nota solta que estava em R5 (secção 8) por um procedimento concreto. Ainda não executado — é o desenho, não o registo de algo já a funcionar.

**Cadência por tipo de dado:**
- **Fundos**: **dois níveis de cadência (decisão de 2 set. 2026, "bem apertado" por pedido explícito — prazo errado tem custo financeiro direto, risco mais alto do que uma obrigação legal desatualizada)**:
  1. *Revisão mensal completa* — todos os fundos ativos, verificados contra `balcaofundosue.pt`/`compete2030.gov.pt` (sem API/RSS confirmada — questão 9.3 continua em aberto, só resolvida para legislação, não para fundos).
  2. *Revisão semanal acelerada* — qualquer fundo ativo com **prazo dentro de 30 dias** entra em verificação semanal obrigatória, independentemente de quando foi revisto pela última vez. `scripts/checklist_mensal.py` já destaca estes numa secção "🔴 URGENTE" separada, no topo do Issue automático (construído e testado, 2 set. 2026) — mas a automação só corre mensalmente; a verificação semanal em si continua a ser um pedido manual (Sara pede a Claude para verificar, mesmo processo humano-no-loop já estabelecido para a legislação).
- **Obrigações legais**: verificação diária de novidades (deteção), mas classificação Setor↔Obrigação só acontece quando há alteração regulatória real (ex: Digital Omnibus) — não é revisão diária de todas as 9 obrigações já existentes, é vigilância diária de fontes novas.

**Divisão automação/humano (nota já deixada em R5 — aqui fica concreta):**
| Etapa | Automatizável | Exige julgamento humano |
|---|---|---|
| Deteção de página/aviso novo ou alterado nas fontes oficiais | Sim — scraping/RSS agendado (GitHub Actions, secção 7.2) | — |
| Confirmar que o aviso é genuíno e a leitura do prazo/estado está correta | — | Sim — é o que resolveu o R4 (fundos "Ativo?" por confirmar) |
| Classificar Setor↔Obrigação (a que secções CAE se aplica) | Sugestão automática possível (ex: por palavras-chave), mas não decisão final | Sim — aprovação final sempre humana (Princípio 4) |
| Redigir o texto do alerta com hedging (Anexo A) | Modelo/template automatizável | Revisão humana antes do envio (`revisto_por_humano`) |
| Registar a verificação em `historico_verificacoes` e atualizar `sla_status` | Pode ser o último passo do próprio script/processo humano | — |

**Passo a passo de um ciclo mensal (fundos, exemplo):**
1. Script (ou verificação manual, enquanto não há API) lista o estado atual de cada fundo em `balcaofundosue.pt`/`compete2030.gov.pt`.
2. Compara com o `status` atual em `fundos`; sinaliza discrepâncias (ex: prazo passou, estado mudou).
3. Humano confirma cada discrepância na fonte oficial antes de alterar o registo — nunca uma alteração automática de `status`.
4. Grava uma linha em `historico_verificacoes` por cada fundo revisto (mesmo os que não mudaram — "revisto, sem alteração" também é um resultado válido e auditável).
5. Quando todos os fundos ativos tiverem sido revistos no mês, marca `sla_status.revisao_fundos_feita = true` com a data.
6. Se o mês terminar sem essa marca: aplica a mitigação já definida no R5 — pausar a beta / mostrar aviso explícito, não apresentar dados calados.

**Passo a passo de deteção de novidade (obrigações legais, exemplo):**
1. Vigilância diária das fontes (DRE, EUR-Lex) por scraping/RSS.
2. Qualquer novidade candidata entra numa fila de revisão — nunca diretamente na tabela `obrigacoes` pública.
3. Humano confirma o texto, a base legal exata (artigo do diploma) e classifica o(s) setor(es) afetados.
4. Só depois de aprovado é que entra em `obrigacoes` + `obrigacoes_setores`, com `data_ultima_verificacao` e `verificado_por` preenchidos.
5. Regista em `historico_verificacoes`.

Isto fecha, em desenho, a lacuna que o R5 apontava ("depende de uma pessoa, sem SLA definido") — o SLA passa a ser um estado de base de dados verificável, não uma promessa em texto.

**Decisão (30 ago. 2026): `historico_verificacoes` é tabela única para todos os tipos de dado** (fundos, obrigações, e futuras fontes da secção 6.2 — IEFP/ACT/APA/CNPD/IAPMEI, quando entrarem), distinguidos pela coluna `tabela_referencia`. Justificação: ao volume atual (secção 11 — 30 registos no total entre obrigações e fundos), uma tabela única mantém a auditoria simples ("mostra-me tudo o que foi verificado em agosto", sem juntar várias tabelas) e evita multiplicar tabelas por cada fonte nova que entrar no âmbito. Nota prática para quando o volume crescer: indexar por (`tabela_referencia`, `data_verificacao`) para as queries de auditoria/SLA continuarem rápidas — reavaliar só se algum tipo de fonte crescer numa ordem de grandeza muito diferente das outras (ex: legislação diária vs. fundos mensais podem, com o tempo, ter volumes muito desiguais).

---

## 8. Riscos identificados e plano de mitigação

Esta secção resulta de uma revisão crítica do projeto. Estado atualizado a 25 ago. 2026.

| # | Risco | Gravidade | Estado | Mitigação |
|---|---|---|---|---|
| **R1** | Hipótese central ("PMEs querem sinalização sem interpretação") nunca testada com utilizador real, por restrição deliberada | Alta | Em aberto | Validar via canal de distribuição (contabilistas/consultores de fundos) antes da beta — testa validação e distribuição ao mesmo tempo, sem violar a restrição de não falar com donos de PME diretamente |
| **R2** | Cobertura legal muito mais estreita (só AI Act + RGPD) do que o nome do produto sugere | Média | Em aberto | Nomear a cobertura real no material da beta; não prometer o que ainda não existe. **Nota sobre cobertura de fundos (3 set. 2026):** Norte, Centro, Alentejo, Algarve, Açores e Madeira 2030 têm avisos PME diretos identificáveis; Lisboa 2030 não — confirmado em fonte oficial (aviso MPr-2026-1, SITCE: *"Note: The Lisbon region is not eligible under the General Regime"*) e consistente com 0 avisos `RSO1.3` exclusivos de Lisboa em 211 linhas do Plano Anual de Avisos. É uma exclusão estrutural de pelo menos parte dos regimes gerais, não uma lacuna de recolha do Radar — mas reforça a mesma lição: nomear a cobertura real por região, não assumir "Portugal 2030" cobre o país todo por igual |
| **R3** | NIF guardado em claro, contra o próprio princípio do roteiro | Alta | **Resolvido** — hash SHA-256 implementado no campo `NIF (hash)`, migrado o único registo existente (24 ago. 2026) |
| **R4** | 2 fundos com estado "Ativo?" por confirmar, risco de alerta com facto errado | Alta | **Resolvido** — COMPETE2030-2026-3 e COMPETE2030-2026-6 confirmados como fechados (prazo terminou 31/07/2026), marcados inativos com data de verificação. **Achado adicional (3 set. 2026):** ambos eram, na verdade, `Natureza Aviso = Convite` — o beneficiário direto era uma entidade única convidada (IAPMEI, no caso do 2026-3) ou entidades sem fins lucrativos (2026-6), não PME. Nunca deveriam ter sido classificados como oportunidade PME, independentemente do prazo. Sem impacto no produto (já inativos), mas revela que o critério de filtragem da redução 21→18→16 (secção 7.1) não cobria este padrão — só excluía beneficiários públicos/municipais/de ensino, não o mecanismo `Convite` a intermediário |
| **R5** | Manutenção contínua depende de uma pessoa, sem SLA definido; falta também definir a cadência editorial ao subscritor (não é só "os dados estão atualizados", é "o subscritor sabe o que esperar e quando") | Média | **Resolvido** — 2 ciclos mensais consecutivos completos (ago. e set. 2026), o 2º já gerado automaticamente pelo GitHub Actions | SLA e cadência desenhados na secção 7.4 e executados na prática: `.github/workflows/checklist_mensal.yml` corre no dia 1 de cada mês, abre um Issue com os fundos a rever e as obrigações a confirmar; revisão humana obrigatória antes de marcar `sla_status`. Ciclo de set. 2026: 0 fundos a rever, 11/11 obrigações confirmadas sem alteração — Issue #1, fechado em 2 set. 2026. Falta só repetir isto de forma consistente ao longo do tempo (não é um "resolvido para sempre", é "o mecanismo funciona, agora é manter") |
| **R6** | Exposição legal/reputacional sem entidade legal, a partir do primeiro utilizador externo real (não do primeiro pagamento) | Alta (só se/quando a beta abrir a utilizadores externos) | Em aberto | Beta por convite fechado, não registo público; consentimento explícito registado (checkbox + timestamp) usando o texto do Anexo A antes de qualquer alerta ser gerado |
| **R7** | Canal de distribuição (contabilistas/consultores) pode ver o produto como concorrência, não como ferramenta | Média | Em aberto | Testar isto explicitamente na conversa de validação do R1 — pergunta direta, não assumida. **Nota de tier profissional (não decidido):** um nível de preço dirigido a contabilistas/consultores que gerem várias empresas — preço indexado ao nº de empresas geridas, com possibilidade de reencaminhar alertas aos clientes finais — transformaria a hipótese de R7 (aliado vs. concorrente) numa oferta concreta e testável na mesma conversa de validação, em vez de ficar só como pergunta aberta. Falta decidir a estrutura de preço exata e se cabe dentro do "sem conversas de validação com donos de PME" (Princípio 3) — este tier fala com o consultor, não com a PME, por isso não parece ativar essa restrição, mas vale confirmar |

---

## 9. Questões em aberto (por ordem de urgência)

1. **RGPD prático completo**: retenção de dados, política de privacidade formal — antes do primeiro registo real de empresa externa.
2. **Entidade legal**: bloqueador de qualquer teste com clientes reais (relevante para a Missão 9, projeto externo, out-dez 2026).
3. ~~**Viabilidade de scraping estruturado do DRE** vs. leitura humana obrigatória~~ — **Resolvido em 2 set. 2026**: o DR tem RSS oficial para a Série I (`files.diariodarepublica.pt/rss/serie1-html.xml`), confirmado ao vivo com entradas do próprio dia. Não é preciso scraping nem API de terceiros — ver secção 7.2. Falta só construir o script diário que lê este feed e sinaliza novidades candidatas para revisão humana (Princípio 4).

8. **Vigilância de legislação da UE (EUR-Lex) — Via A confirmada e resolvida em 2 set. 2026.** Duas vias avaliadas: **Via A** (feed RSS predefinido "Jornal Oficial, Série L") vs. **Via B** (alerta pessoal, login EU Login, ligado só aos diplomas já classificados). **Via B falhou o teste**: ao investigar "há mais coisas da UE que afetam PMEs?", descobriu-se o **Cyber Resilience Act** (Regulamento (UE) 2024/2847) — obrigação de comunicação de vulnerabilidades desde 11 set. 2026, nunca transposto para o DR (é Regulamento, efeito direto) — a Via B nunca o teria apanhado. **URL confirmado**: `https://eur-lex.europa.eu/PT/display-feed.rss?rssId=222` ("5 - Acts of the Official Journal L"), testado por fetch direto em 2 set. 2026, conteúdo real (regulamentos, diretivas, decisões PESC, decisões do Comité Misto EEE, quotas de pesca, etc.) — precisa do mesmo filtro tipo+palavra-chave já validado no DR (a maioria dos itens não interessa a PMEs). **Nota de cautela**: o `pubDate` do feed no momento do teste mostrava jul. 2026, não o dia da consulta (2 set.) — pode ser comportamento normal do feed ou um cache do lado da ferramenta de fetch (já aconteceu 2 vezes nesta sessão, incluindo o mix-up do CRA/DORA) — vale a pena confirmar diretamente num browser antes de confiar cegamente na frescura dos dados. **Por construir:** script de ingestão diária, mesmo molde do `scripts/ingestao_diaria_dre.py`, gravando candidatos em `stg_obrigacoes_candidatas` (mesma tabela, mesmo processo de revisão semanal já estabelecido).
   - **✅ Construído e testado em execução real (3 set. 2026)**: `scripts/ingestao_diaria_eurlex.py` + `.github/workflows/ingestao_diaria_eurlex.yml` (dias úteis, 09:15 UTC — 15 min depois do DR). Mesma tabela de staging, mesmo processo de revisão semanal do DR. Primeira execução real: **26 candidatos, 26/26 falsos positivos** (autorizações de aditivos alimentares, quotas de pesca, normas técnicas de supervisão bancária, sanções, antidumping) — todos revistos e descartados.
   - **Aperto do filtro (3 set. 2026):** `Regulamento Delegado (UE)` e `Regulamento de Execução (UE)` passaram a exigir também palavra-chave, não só o tipo — são quase sempre alterações técnicas estreitas a quadros já existentes. `Regulamento (UE)` simples e `Diretiva (UE)` continuam a entrar só pelo tipo.
   - **Bug encontrado e corrigido durante o aperto:** `classificar_tipo` procurava o texto do tipo em qualquer parte do título, não só no início — um título como *"Regulamento Delegado (UE) 2026/1278... que altera **o Regulamento (UE)** n.º 649/2012"* tem a substring "Regulamento (UE)" duas vezes (a referência cruzada ao diploma alterado, não o tipo do próprio ato), o que classificava mal quase todos os Delegados/Execução como "Regulamento (UE)" simples — teria anulado silenciosamente o aperto do filtro. Corrigido: agora só verifica o início real do título (depois do prefixo `CELEX:...:`). O mesmo padrão existe no script do DR, mas lá o impacto é só cosmético (etiqueta do tipo, não inclusão/exclusão) — não corrigido por agora.
   - **✅ Aperto confirmado por segunda execução real (3 set. 2026)**: 0 candidatos pendentes — nem os 26 antigos voltaram a entrar, nem nada de novo do feed do dia passou pelo filtro apertado. Confirma que o bug de referência cruzada estava mesmo a inflacionar os falsos positivos, e que a correção resolveu isso.
   - **Nota de fiabilidade dos dados**: durante esta investigação, uma tentativa de fetch ao texto do CRA (CELEX 32024R2847) devolveu, por engano, o texto de outro regulamento (DORA, 32022R2554) — parece ter sido um problema de cache do lado do EUR-Lex. Não foi usado; a classificação do CRA foi feita a partir do resumo oficial da Comissão Europeia (digital-strategy.ec.europa.eu) em vez disso. Vale a pena ter presente que o EUR-Lex, tecnicamente, nem sempre devolve o documento certo — confirmar sempre o conteúdo antes de o usar, não só o URL pedido.
4. **Limites/custos reais do Supabase** ao volume esperado, antes de assumir que o plano gratuito chega.
5. **Mapeamento IEFP/ACT/APA/CNPD/IAPMEI** — só depois do MVP de 3 fontes estar estável. Ver também secção 6.2 para 4 candidatas adicionais já pesquisadas (NIS2, whistleblowing, faturação eletrónica, European Accessibility Act) — nenhuma implementada ainda.
6. **Formato da oferta de consultoria**: projetos pontuais vs. acompanhamento contínuo — decide modelo de preços e tipo de cliente a procurar primeiro.

   **Notas de pricing (não decidido — ponto de partida vindo do exercício de curso, Missão 5):**
   - Estrutura testada nesse contexto: dois níveis para PME individual — Básico (7,99€/mês) e Completo (14,99€/mês). Antes de transpor estes números para o produto real, confirmar: (a) se correspondem a alguma referência de mercado documentada (o feedback da missão cita Grantavia, checker do AI Act, Hub4DPO e protecaodedados.com como comparáveis — nenhum destes preços está ainda registado neste PRD, ver Anexo B) ou se foram estimados sem essa base; (b) o argumento de "custo evitado" usado para justificar o preço (ancorado no valor de uma coima mínima de RGPD) precisa de fonte legal exata antes de ser usado em material dirigido a clientes — não usar o número sem confirmar o montante e o diploma.
   - Falta decidir se o modelo é subscrição (como testado no exercício) ou projeto pontual — o PRD ainda não fixou isto; a secção 6.2 só regista que "cobrança/faturação" está fora do MVP técnico mas é bloqueadora de testes pagos.
   - Ver também nota de tier profissional no risco R7 (secção 8).
7. **Personas detalhadas** dos utilizadores-alvo — ainda não desenvolvidas.

---

## 10. Critérios de saída do piloto fechado

O projeto só sai da fase de piloto fechado quando:
- [ ] Pelo menos 2-3 conversas com contabilistas/consultores de fundos tiverem validado a hipótese central (R1) e testado a perceção de concorrência (R7).
- [x] O SLA de manutenção (R5) estiver definido e cumprido de forma consistente durante pelo menos um ciclo mensal completo — **2 ciclos consecutivos confirmados (ago. e set. 2026)**, o 2º já gerado automaticamente via GitHub Actions (`checklist_mensal.yml`, Issue #1). Critério cumprido — manter a consistência é agora o trabalho contínuo, não uma pendência.
- [ ] O consentimento explícito (R6) estiver implementado no onboarding.
- [ ] A política de privacidade mínima (questão 1) estiver escrita e publicada.
- [x] Migração de dados para Supabase concluída (setores, obrigações, fundos — ver secção 7.1, confirmado 30 ago. 2026). **Falta ainda**: migrar/decidir o frontend (continua em Softr+Airtable) e ligar a ingestão automatizada (secção 7.2).

---

## 11. Estado dos dados (verificado via Supabase, 30 ago. 2026)

| Tabela | Registos | Nota |
|---|---|---|
| Setores | 22/22 | Completa, CAE-Rev.4 |
| Obrigações Legais | 12 | AI Act + RGPD + NIS2 + Whistleblowing + Cyber Resilience Act (novo, 2 set. 2026, urgente — prazo 11 set. 2026). CRA descoberto ao investigar cobertura EUR-Lex, prova de que só vigiar diplomas já conhecidos não basta (é Regulamento, nunca passa pelo DR). Classificação setorial pendente para NIS2 e CRA |
| Fundos | 16 (14 ativos, 2 confirmados fechados) | Ver histórico na secção 7.1 (21→18→16). Verificados individualmente contra a fonte oficial em 25 ago. 2026 |
| Empresas | 0 | Registo de teste (fictício) não migrado, por decisão explícita |
| `obrigacoes_setores` (junção) | 105 | — |
| `fundos_setores` (junção) | 87 | — |
| `historico_verificacoes` | 0 | Tabela nova (secção 7.4) — ainda sem entradas retroativas da verificação de 25 ago. |
| `sla_status` | 0 | Ainda não correu nenhum ciclo mensal completo |

---

## Anexo A — Texto de hedging obrigatório

**Por alerta individual:**
> **[Nome/tema da obrigação ou fundo]**
> Publicado: [data] · Fonte: [link direto, DRE/EUR-Lex/PT2030]
> Setor(es) que **poderão** ser abrangidos: [setor(es)] — classificação indicativa, com base em [artigo/base legal exata]
> Prazo legal (se aplicável): [data, facto objetivo — nunca "prioridade"]
> Isto **poderá** aplicar-se à sua empresa. Recomendamos confirmar com um advogado, contabilista ou consultor de conformidade se se aplica ao seu caso concreto.

**Modelo para período sem novidades (nota de cadência editorial, R5 — não decidido, ver secção 8):**
> Verificámos as fontes oficiais do seu setor em [data]. Não há obrigações legais novas nem fundos novos a assinalar neste período. Continuamos a monitorizar.

**Disclaimer geral do produto (rodapé/termos):**
> O Radar de Oportunidades reúne e organiza informação pública de fontes oficiais (Diário da República, EUR-Lex, Portugal 2030) para orientação inicial. Não constitui aconselhamento jurídico, fiscal ou contabilístico, nem substitui a consulta a um profissional habilitado.

---

## Anexo B — Fontes citadas

- Airtable, *Airtable plans overview* — support.airtable.com (limites de registos e API, consultado ago. 2026)
- Cobertura da aquisição do Airtable pela Bending Spoons, ago. 2026 (fontes secundárias — não confirmado em comunicado oficial da Airtable)
- Portal Mais Transparência / Portugal 2030 — dados abertos via AD&C/dados.gov.pt
- Compete2030.gov.pt — páginas oficiais dos avisos COMPETE2030-2026-3 e COMPETE2030-2026-6, verificadas 25 ago. 2026; reclassificação de causa raiz (Convite, não Concurso PME) confirmada 3 set. 2026
- Portugal 2030, Plano Anual de Avisos — ficheiro `.xlsx` estruturado (`portugal2030.pt/plano-anual-de-avisos/`), consultado 3 set. 2026, versão `_052026`
- Norte 2030 — `norte2030.pt/2026/07/03/norte-2030-disponibiliza-mais-de-4-milhoes-de-euros-para-criar-emprego-e-dinamizar-empresas`, avisos NORTE2030-2026-14/15/16, consultado 3 set. 2026
- Compete2030.gov.pt — aviso MPr-2026-1 (SITCE), versão em inglês com nota explícita de exclusão da região de Lisboa do Regime Geral, consultado 3 set. 2026
- INE, estatística de adoção de IA em PME — referência exata por confirmar antes de uso externo
- Estado dos dados: verificado diretamente via API do Airtable, base `appxWpGCQVZByLvFS`, 25 ago. 2026
- Estado da migração: verificado diretamente via SQL no Supabase, projeto `radar-oportunidades` (`echrxirbkpworpgwehkb`), 30 ago. 2026
- RSS oficial do Diário da República (Série I): `files.diariodarepublica.pt/rss/serie1-html.xml`, confirmado por fetch direto em 2 set. 2026 (entradas do próprio dia). Página de subscrição: diariodarepublica.pt, secção "Subscrever RSS"
- NIS2 / Regime Jurídico da Cibersegurança: Decreto-Lei n.º 125/2025 — texto integral obtido via diariodarepublica.pt (30 ago. 2026), incluindo Anexos I, II e III. Fontes secundárias usadas antes de obter o texto primário (factorialhr.pt, 3hash.pt, bancobpi.pt, servulo.com/csassociados.pt, nis2-portugal.com) — nota: a contagem de setores do Anexo I nas fontes secundárias estava incorreta (diziam 11, o texto primário confirma 10)
- Proteção de denunciantes: Lei n.º 93/2021 — visslan.com, ethicsportal.eu (pesquisa web, 30 ago. 2026)
- Faturação eletrónica: cegid.com, compulab.pt (pesquisa web, 30 ago. 2026) — prazo sujeito a alteração, já adiado mais do que uma vez
- European Accessibility Act: Decreto-Lei n.º 82/2022 — advogadosmc.pt, dualup.pt (pesquisa web, 30 ago. 2026)
- Proposta de subida do limiar de isenção ROPA ("Data Omnibus"): recordinglaw.com, lawandtechnology.eu (pesquisa web, 30 ago. 2026) — ainda não é lei
