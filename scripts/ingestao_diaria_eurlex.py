#!/usr/bin/env python3
"""
Ingestão diária do RSS do EUR-Lex (Jornal Oficial, Série L) — Radar de Oportunidades.

O que faz:
1. Lê o feed RSS oficial "Acts of the Official Journal L"
   (eur-lex.europa.eu/PT/display-feed.rss?rssId=222).
2. Filtra por tipo de ato + palavras-chave — a maioria dos itens (decisões
   PESC, decisões do Comité Misto do EEE, homologações técnicas de veículos,
   retificações) não cria obrigações para PMEs; só Regulamentos e Diretivas
   costumam fazê-lo.
3. Escreve os candidatos em 'stg_obrigacoes_candidatas' — a MESMA tabela de
   staging usada pela ingestão do Diário da República (scripts/ingestao_diaria_dre.py).
   'fonte_url' distingue a origem (diariodarepublica.pt vs eur-lex.europa.eu).
4. NÃO escreve nunca diretamente em 'obrigacoes' — aprovação é sempre humana
   (Princípio 4 do PRD).

Descoberto ao classificar o Cyber Resilience Act (2 set. 2026): só vigiar
diplomas já conhecidos (alertas RSS pessoais no EUR-Lex, ligados a um
documento específico) não bastava — o CRA é um Regulamento, nunca passou
pelo Diário da República. Este feed amplo + filtro é a mitigação.

Como correr:
    export SUPABASE_URL="https://<project_ref>.supabase.co"
    export SUPABASE_SERVICE_ROLE_KEY="<service_role key>"
    python3 ingestao_diaria_eurlex.py
"""

import os
import sys
import json
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import date
from email.utils import parsedate_to_datetime

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("Erro: define SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY como variáveis de ambiente.", file=sys.stderr)
    sys.exit(1)

RSS_URL = "https://eur-lex.europa.eu/PT/display-feed.rss?rssId=222"

# Tipos de ato que costumam criar obrigações genéricas para empresas.
# Fora, por omissão: Decisão (PESC), Decisão do Comité Misto do EEE,
# Orientação do BCE, retificações, regulamentos técnicos da ONU (só
# relevantes para fabricantes automóveis, caso específico demais para
# entrar por defeito) — só entram se também baterem numa palavra-chave.
TIPOS_RELEVANTES = [
    "Regulamento (UE)",
    "Regulamento Delegado (UE)",
    "Regulamento de Execução (UE)",
    "Diretiva (UE)",
]

# Mesma filosofia da lista do DR — cobre os temas já classificados mais
# termos genéricos de obrigação empresarial e de produto/mercado interno,
# que é onde a legislação da UE mais atinge PMEs na prática.
PALAVRAS_CHAVE = [
    "ciberseguranca", "cibersegurança", "proteção de dados", "protecao de dados",
    "denunciante", "denúncia", "faturação eletrónica", "faturacao eletronica",
    "acessibilidade digital", "inteligência artificial", "inteligencia artificial",
    "produtos com elementos digitais", "elementos digitais",
    "pequenas e médias empresas", "pequenas e medias empresas", "microempresas",
    "empresas", "trabalhadores", "empregador",
    "obrigação", "obrigacao", "contraordenação", "contraordenacao", "coima",
    "prazo", "consumidor", "rotulagem", "embalagens", "comércio eletrónico",
    "comercio eletronico",
]


def normalizar(texto: str) -> str:
    return texto.lower()


def classificar_tipo(titulo: str) -> str | None:
    for tipo in TIPOS_RELEVANTES:
        if tipo.lower() in titulo.lower():
            return tipo
    return None


def encontrar_palavras_chave(texto: str) -> list[str]:
    texto_norm = normalizar(texto)
    return [p for p in PALAVRAS_CHAVE if p in texto_norm]


def data_publicacao_de(item) -> str:
    """O feed traz itens de vários dias — lê a data real do item, não assume 'hoje'."""
    pub_date_raw = item.findtext("pubDate", default="")
    try:
        return parsedate_to_datetime(pub_date_raw).date().isoformat()
    except (TypeError, ValueError):
        return date.today().isoformat()


def inserir_candidato(item: dict):
    url = f"{SUPABASE_URL}/rest/v1/stg_obrigacoes_candidatas"
    body = json.dumps(item).encode()
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    })
    urllib.request.urlopen(req)


def ja_existe(fonte_url: str) -> bool:
    """Evita duplicados se o script correr mais do que uma vez sobre os mesmos itens."""
    url = f"{SUPABASE_URL}/rest/v1/stg_obrigacoes_candidatas?fonte_url=eq.{urllib.parse.quote(fonte_url)}&select=id"
    req = urllib.request.Request(url, headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
    })
    with urllib.request.urlopen(req) as resp:
        return len(json.loads(resp.read().decode())) > 0


def main():
    with urllib.request.urlopen(RSS_URL) as resp:
        xml_bytes = resp.read()

    root = ET.fromstring(xml_bytes)
    items = root.findall(".//item")

    candidatos = []
    ignorados = 0

    for item in items:
        titulo = item.findtext("title", default="").strip()
        descricao = item.findtext("description", default="").strip()
        link = item.findtext("link", default="").strip()

        tipo = classificar_tipo(titulo)
        palavras = encontrar_palavras_chave(f"{titulo} {descricao}")

        if not tipo and not palavras:
            ignorados += 1
            continue

        motivo_partes = []
        if tipo:
            motivo_partes.append(f"tipo: {tipo}")
        if palavras:
            motivo_partes.append(f"palavras-chave: {', '.join(palavras)}")

        candidatos.append({
            "titulo": titulo,
            "tipo_diploma": tipo,
            "fonte_url": link,
            "data_publicacao": data_publicacao_de(item),
            "resumo": descricao or None,
            "motivo_filtro": "; ".join(motivo_partes),
        })

    novos = 0
    for c in candidatos:
        if ja_existe(c["fonte_url"]):
            continue
        inserir_candidato(c)
        novos += 1

    print(f"RSS lido: {len(items)} atos. Candidatos novos: {novos}. Ignorados (sem tipo/palavra-chave): {ignorados}.")
    if novos > 0:
        print("Rever em 'stg_obrigacoes_candidatas' (estado='pendente') antes de promover para 'obrigacoes'.")


if __name__ == "__main__":
    main()
