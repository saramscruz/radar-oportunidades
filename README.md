# Radar de Oportunidades — scaffold Next.js

Scaffold funcional, não a app final: cobre o fluxo central do PRD (secção 7.2)
— convite → registo com consentimento RGPD → feed filtrado por setor →
detalhe do alerta com hedging — ligado diretamente ao Supabase já configurado
(`echrxirbkpworpgwehkb`).

## Como pôr a correr

```bash
npm install
cp .env.example .env.local
```

Preenche no `.env.local`:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase → Project Settings → API → `anon` `public` key.
  (`NEXT_PUBLIC_SUPABASE_URL` já vem preenchido no `.env.example`.)

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Estrutura

```
app/
  page.tsx                    convite (piloto fechado)
  registo/                    registo + consentimento RGPD (server action)
  login/                      login (server action)
  feed/page.tsx                feed filtrado por setor + aviso de SLA
  feed/[tipo]/[id]/page.tsx    detalhe do alerta, com hedging (Anexo A do PRD)
lib/supabase/
  client.ts                   cliente Supabase para componentes de cliente
  server.ts                   cliente Supabase para Server Components/Actions
components/
  SlaBanner.tsx                lê a tabela sla_status (Anexo D do PRD)
middleware.ts                  protege /feed, mantém a sessão viva
```

## O que falta antes de ser produção

- **Design**: o CSS (`app/globals.css`) reutiliza os tokens do protótipo HTML
  já feito, mas não foi revisto ao pormenor — é um ponto de partida funcional.
- **Página de conta**: gestão de opt-out, alteração de dados (secção 6 do
  Anexo C do PRD) ainda não existe.
- **Emails de alerta reais**: este scaffold só mostra o feed — o envio por
  Resend (secção 7.2 do PRD) é um componente separado, ainda por construir
  (o script de ingestão que gera os alertas).
- **Testes**: nenhum, propositadamente — scaffold, não produto acabado.

## Deploy

1. Cria o repositório no GitHub, copia esta pasta inteira para lá (incluindo
   `scripts/` e `.github/workflows/`, se já os tiveres preparado).
2. Liga o repositório ao Vercel (import project) — deploy automático a cada
   push, sem configuração adicional além das variáveis de ambiente.
3. Em Vercel → Settings → Environment Variables, adiciona as mesmas duas
   variáveis do `.env.local`.

## Nota de proveniência

Este scaffold foi originalmente gerado em 25 ago. 2026, numa sessão anterior
("Crítica do PRD pelo Devil"), mas nunca chegou a sair para o GitHub — o
repositório `saramscruz/radar-oportunidades` ficou vazio. Reconstruído
fielmente a partir dessa conversa em 30 ago. 2026.
