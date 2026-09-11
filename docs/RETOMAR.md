# Como retomar o Radar de Oportunidades numa sessão nova

Guia prático, não o PRD — para dares contexto ao Claude no início de uma
conversa nova sem teres de reconstruir tudo. O PRD (`docs/prd-radar-
oportunidades.md`, no repositório GitHub) continua a ser a referência
técnica/produto completa; usa-o quando precisares de detalhe, não este
documento.

---

## 1. Como começar a próxima conversa

Cola isto (ou algo parecido) na primeira mensagem:

> Estou a retomar o projeto Radar de Oportunidades. O PRD está no
> repositório (`docs/prd-radar-oportunidades.md`). Liga-te ao Supabase
> (projeto `radar-oportunidades`, ref `echrxirbkpworpgwehkb`) e ao
> GitHub (`saramscruz/radar-oportunidades`) para veres o estado atual
> antes de avançarmos.

Se o Claude não tiver o conector Supabase já ligado à organização certa
(**PMEradar**), pede-lhe para verificar — já aconteceu precisar de
reconectar (Definições → Connectors → Supabase → Disconnect → Connect
outra vez).

---

## 2. Onde está tudo

| O quê | Onde |
|---|---|
| Código (Next.js) | `github.com/saramscruz/radar-oportunidades` |
| Base de dados | Supabase, projeto `radar-oportunidades` (`echrxirbkpworpgwehkb`), organização PMEradar |
| Site publicado | Netlify — confirma o URL atual em app.netlify.com (pode ter mudado de nome desde `aesthetic-kelpie-b00a4c.netlify.app`) |
| PRD completo | `docs/prd-radar-oportunidades.md`, no repositório GitHub (deixou de ser ficheiro solto a partir da v1.5, 3 set. 2026) |
| Produto antigo (Softr/Airtable) | `chana79900.softr.app` — **a sair de uso**, mantido só como referência de design/conteúdo, não é para onde vai o trabalho novo |

---

## 3. Estado em 11 de setembro de 2026, resumido

- ✅ Base de dados migrada, RLS testado e validado
- ✅ Frontend Next.js publicado no Netlify, funcional (registo → feed → detalhe)
- ✅ Três fontes de ingestão automática a correr sozinhas: Diário da República, EUR-Lex, e o ciclo mensal de fundos
- ✅ Obrigações classificadas com fonte primária: AI Act, RGPD, NIS2 (setorial pendente), Whistleblowing, Cyber Resilience Act
- ✅ Cobertura de fundos do Norte 2030 iniciada (NORTE2030-2026-14/15/16 inseridos, 3 set.) — Lisboa e Alentejo ainda por reprocessar com o critério revisto (ver PRD, secção 7.2)
- ⬜ **R1 — validação com contabilistas/consultores continua por fazer.** É o único risco alto do projeto ainda intocado — tudo o resto já tem engenharia sólida por trás.
- ⬜ Consentimento (R6) implementado no código, nunca testado com alguém fora da equipa
- ⬜ Política de privacidade formal — não escrita
- ⬜ Faturação eletrónica e European Accessibility Act — candidatas documentadas, nunca classificadas
- ⬜ Decisões de schema acumuladas por resolver de uma vez: `regiao` (candidata a remoção), `natureza_aviso`/`tipo_ent_beneficiaria` (novas, para não repetir o erro do COMPETE2030-2026-3/6), granularidade de `fundos_setores` para Secções S/T

---

## 4. As tuas tarefas recorrentes

| Tarefa | Cadência | O que fazer |
|---|---|---|
| Rever fila de candidatos (DR + EUR-Lex) | **Semanal** | Pede "mostra-me os candidatos pendentes" — decides descartar/aprovar/investigar cada um |
| Rever fundos com prazo <30 dias | **Semanal** | Pede "mostra-me os fundos com prazo próximo" |
| Rever Issue mensal de manutenção (fundos + obrigações completo) | **Mensal**, automático (dia 1) | Reage ao Issue que aparece no GitHub; no fim, pede para atualizar `sla_status` |

Estas três cabem no mesmo momento semanal — não precisas de memorizar três rotinas separadas.

---

## 5. Lições já aprendidas, para não repetir

- **PowerShell não aceita `&&`** — corre os comandos Git um por linha, não encadeados
- **Corre sempre `npm run build` localmente antes do `git push`** — `next build` é mais rigoroso que `next dev` e apanha erros que só apareceriam depois no Netlify
- **"Re-run jobs" no GitHub Actions fica preso ao código antigo** — para testar uma correção, usa sempre "Run workflow" na página do workflow, não "Re-run" numa execução específica
- **Confirma sempre o conteúdo de fetches ao EUR-Lex, não só o URL** — já aconteceu duas vezes trazer a página errada ou uma versão em cache
- **Testa filtros com volume real antes de confiar neles** — o filtro do EUR-Lex parecia bem numa amostra pequena e só revelou o problema real (26 falsos positivos + um bug de classificação) na primeira execução a sério
- **A app GitHub do Claude Code não tem (e pode não vir a ter) autorização de escrita neste repositório** (erro 403 recorrente, confirmado várias vezes em 3 e 11 set.). Decisão aceite, não um problema a resolver a cada vez: **é sempre a Sara que faz o `git push`, manualmente, a partir do PowerShell local.** O Claude Code prepara o commit/diff localmente e comunica o conteúdo exato para ela aplicar e publicar. Se um dia isto mudar (reautorização em `github.com/apps/claude/installations/select_target`), atualizar esta nota — até lá, não vale a pena voltar a tentar o push a partir do sandbox dele.
- **Cuidado com o nome do ficheiro descarregado do chat** — o browser pode guardar como `nome (1).md`, `nome (2).md` em vez de substituir o anterior; confirma sempre com `dir $env:USERPROFILE\Downloads\nome*.md` antes de copiar para o repositório, para não aplicares por engano uma versão antiga.

---

## 6. Se só tiveres 2 minutos

A pergunta mais importante para fazeres ao Claude, sempre que retomares:
**"O que é que ainda falta para validar o R1?"** — é o único item que decide se este projeto sai do piloto fechado. Tudo o resto pode esperar.
