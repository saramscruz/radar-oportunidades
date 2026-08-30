# Manutenção mensal — como ligar

Este script e workflow ficam prontos a usar, mas precisam de 3 coisas configuradas no teu lado (não consigo fazer isto por ti sem acesso à rede/conta):

## 1. Criar o repositório no GitHub (se ainda não existir)
Copia esta pasta (`scripts/` + `.github/`) para o repositório do projeto.

## 2. Configurar os GitHub Secrets
No repositório: **Settings → Secrets and variables → Actions → New repository secret**

- `SUPABASE_URL` — `https://echrxirbkpworpgwehkb.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — em Supabase, **Project Settings → API → service_role key** (não a `anon` key — essa não tem permissão de leitura completa por causa do RLS)

## 3. Confirmar que o workflow está ativo
Vai a **Actions** no GitHub, procura "Checklist de manutenção mensal", e confirma que está *enabled*. Podes correr manualmente a qualquer momento com o botão "Run workflow" (usa o `workflow_dispatch` já configurado).

## O que acontece todos os meses
1. No dia 1, o script corre e lista os fundos com verificação desatualizada (>30 dias) e todas as obrigações legais ativas.
2. Abre um GitHub Issue com esse checklist, etiquetado `manutenção`.
3. Tu revês cada item contra a fonte oficial, corriges o que mudou (Airtable + Supabase), e marcas os checkboxes.
4. No fim, corres o SQL que o próprio checklist te dá para atualizar `sla_status` — isso é o que o frontend (quando existir) vai ler para decidir se mostra o aviso de "dados podem estar desatualizados".
5. Se alguma decisão de curadoria for tomada (remover algo, mudar um critério), regista-a no PRD nesse momento — não deixes só no Issue fechado.

## Se o SLA falhar num mês
Se não houver linha em `sla_status` para o mês corrente com ambas as colunas a `true`, isso é o sinal (segundo o PRD, R5) para pausar a beta em vez de continuar a mostrar dados possivelmente desatualizados sem aviso. Este mecanismo ainda não está ligado ao frontend porque o frontend ainda não existe (secção 7.2 do PRD) — fica para implementar quando o Next.js estiver a ler destas tabelas.

## Nota de proveniência
Reconstruído em 30 ago. 2026 a partir da sessão "Crítica do PRD pelo Devil" (25 ago. 2026), onde foi originalmente escrito mas nunca chegou a sair para o GitHub.
