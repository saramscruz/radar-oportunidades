#!/usr/bin/env python3
"""
Checklist mensal de manutenção — Radar de Oportunidades.

O que faz:
1. Lista fundos ativos com PRAZO A MENOS DE 30 DIAS — secção "URGENTE",
   destacada separadamente, independentemente de quando foram verificados
   pela última vez. Um prazo errado tem custo financeiro direto para uma
   PME (perde a oportunidade, ou desiste cedo demais) — risco mais alto
   do que uma obrigação legal desatualizada, daí a secção própria.
2. Lista fundos ativos cuja 'data_verificacao' tem mais de 30 dias (ou nunca foi
   verificada) — são os candidatos a rever contra a fonte oficial este mês.
3. Escreve um checklist em Markdown (stdout), pronto a colar num GitHub Issue
   ou a ler diretamente na consola.
4. NÃO marca nada como revisto automaticamente — isso é sempre uma ação humana
   (Princípio 4 do PRD: nenhum dado entra/sai sem revisão humana).

Como correr:
    export SUPABASE_URL="https://<project_ref>.supabase.co"
    export SUPABASE_SERVICE_ROLE_KEY="<a tua service_role key, nunca a anon key>"
    python3 checklist_mensal.py

A service_role key fica em Project Settings → API no dashboard do Supabase.
Nunca commitar esta chave no repositório — usar sempre variável de ambiente
ou GitHub Secrets (ver .github/workflows/checklist_mensal.yml).
"""

import os
import sys
import json
import urllib.request
from datetime import date, timedelta

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("Erro: define SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY como variáveis de ambiente.", file=sys.stderr)
    sys.exit(1)

LIMIAR_DIAS_DESATUALIZADO = 30
data_limite_desatualizado = (date.today() - timedelta(days=LIMIAR_DIAS_DESATUALIZADO)).isoformat()

LIMIAR_DIAS_PRAZO_URGENTE = 30
hoje_iso = date.today().isoformat()
data_limite_prazo = (date.today() + timedelta(days=LIMIAR_DIAS_PRAZO_URGENTE)).isoformat()


def query_supabase(table: str, params: str) -> list:
    """Faz um GET simples à REST API do Supabase (PostgREST)."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?{params}"
    req = urllib.request.Request(url, headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
    })
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def main():
    # URGENTE: fundos ativos com prazo dentro de 30 dias, independentemente
    # de quando foram verificados — verificação semanal obrigatória para
    # estes, não só mensal (decisão de 2 set. 2026, ver PRD secção 7.4).
    params_urgente = (
        "select=nome,fonte_url,prazo,data_verificacao"
        "&status=eq.ativo"
        f"&prazo=gte.{hoje_iso}"
        f"&prazo=lte.{data_limite_prazo}"
        "&order=prazo.asc"
    )
    fundos_urgentes = query_supabase("fundos", params_urgente)

    # Fundos ativos com verificação desatualizada ou nunca feita.
    params = (
        "select=nome,fonte_url,prazo,data_verificacao"
        "&status=eq.ativo"
        f"&or=(data_verificacao.is.null,data_verificacao.lt.{data_limite_desatualizado})"
        "&order=data_verificacao.asc.nullsfirst"
    )
    fundos_a_rever = query_supabase("fundos", params)

    # Todas as obrigações ativas — revistas sempre que há alteração regulatória,
    # não numa cadência fixa, mas o checklist lembra de as revisitar por precaução.
    obrigacoes = query_supabase(
        "obrigacoes",
        "select=titulo,base_legal_exata,fonte_url&status=eq.ativo&order=titulo.asc"
    )

    hoje = date.today().isoformat()
    print(f"# Checklist de manutenção mensal — {hoje}\n")

    print(f"## 🔴 URGENTE — fundos com prazo em menos de 30 dias ({len(fundos_urgentes)})\n")
    if not fundos_urgentes:
        print("Nenhum fundo ativo com prazo iminente. ✅\n")
    else:
        print("Verificação semanal obrigatória para estes, não só mensal — um prazo "
              "errado tem custo financeiro direto para quem se candidata.\n")
        for f in fundos_urgentes:
            dias_restantes = (date.fromisoformat(f["prazo"]) - date.today()).days
            print(f"- [ ] **{f['nome']}** — prazo: {f['prazo']} ({dias_restantes} dias) "
                  f"— última verificação: {f.get('data_verificacao') or 'nunca verificado'}\n  {f.get('fonte_url', '')}")

    print(f"\n## Fundos a verificar contra a fonte oficial ({len(fundos_a_rever)})\n")
    if not fundos_a_rever:
        print("Nenhum fundo ativo com verificação desatualizada. ✅\n")
    else:
        print("Para cada um: confirmar prazo, dotação e se ainda está aberto. "
              "Corrigir no Airtable e no Supabase se algo mudou (ver PRD, secção 7.2 "
              "sobre manter as duas fontes alinhadas).\n")
        for f in fundos_a_rever:
            ultima = f.get("data_verificacao") or "nunca verificado"
            print(f"- [ ] **{f['nome']}** — prazo atual: {f.get('prazo', '—')} "
                  f"— última verificação: {ultima}\n  {f.get('fonte_url', '')}")

    print(f"\n## Obrigações legais ativas — confirmar que não há alteração regulatória ({len(obrigacoes)})\n")
    for o in obrigacoes:
        print(f"- [ ] **{o['titulo']}** ({o.get('base_legal_exata', '—')})\n  {o.get('fonte_url', '')}")

    print("\n## Depois de concluído")
    print("Atualizar `sla_status` para o mês corrente:")
    print("```sql")
    print("insert into sla_status (mes_referencia, revisao_fundos_feita, revisao_obrigacoes_feita, data_conclusao)")
    print(f"values (date_trunc('month', current_date), true, true, now())")
    print("on conflict (mes_referencia) do update set")
    print("  revisao_fundos_feita = true, revisao_obrigacoes_feita = true, data_conclusao = now();")
    print("```")
    print("\nSe alguma decisão de curadoria foi tomada (ex: remover um fundo por não "
          "ser elegível para PMEs), registar imediatamente no PRD (secção 11.1 ou "
          "equivalente) — não deixar só nesta conversa/execução.")


if __name__ == "__main__":
    main()

