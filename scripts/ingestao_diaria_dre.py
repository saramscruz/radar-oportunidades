#!/usr/bin/env python3
"""
Ingestão diária do RSS do Diário da República (Série I) — Radar de Oportunidades.

O que faz:
1. Lê o RSS oficial da Série I (files.diariodarepublica.pt/rss/serie1-html.xml).
2. Filtra por tipo de diploma + palavras-chave, para separar o que é
   potencialmente relevante para PMEs do resto (tratados, nomeações, etc.).
3. Escreve os candidatos em 'stg_obrigacoes_candidatas' — NUNCA diretamente
   em 'obrigacoes'. A aprovação é sempre humana (Princípio 4 do PRD).

O filtro pode incluir demais, nunca deve excluir demais — descartar um falso
positivo em revisão é barato; perder uma obrigação real não é.

Como correr:
    export SUPABASE_URL="https://<project_ref>.supabase.co"
    export SUPABASE_SERVICE_ROLE_KEY="<service_role key>"
    python3 ingestao_diaria_dre.py
"""

import os
import re
import sys
import json
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import date

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("Erro: define SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY como variáveis de ambiente.", file=sys.stderr)
    sys.exit(1)

RSS_URL = "http://files.diariodarepublica.pt/rss/serie1-html.xml"

# Tipos de diploma que costumam criar obrigações genéricas para empresas.
# Fora: "Decreto" (tratados internacionais), "Resolução da Assembleia da
# República" (simbólico), nomeações, avisos administrativos pontuais.
TIPOS_RELEVANTES = [
    "Decreto-Lei",
    "Lei n.º",
    "Decreto Regulamentar",
    "Portaria",
]

# Termos que, aparecendo no título ou resumo, sinalizam potencial relevância
# para PMEs — cobre os temas já classificados (secção 6.2 do PRD) mais
# termos genéricos de obrigação empresarial. Lista para expandir com o tempo,
# à medida que se revê o que o filtro deixou passar ou falhou.
PALAVRAS_CHAVE = [
    # Temas já classificados
    "ciberseguranca", "cibersegurança", "proteção de dados", "protecao de dados",
    "denunciante", "denúncia", "faturação eletrónica", "faturacao eletronica",
    "acessibilidade digital", "inteligência artificial", "inteligencia artificial",
    # Genéricos de obrigação empresarial
    "pequenas e médias empresas", "pequenas e medias empresas", "microempresas",
    "empresas", "trabalhadores", "empregador", "entidade patronal",
    "obrigação", "obrigacao", "contraordenação", "contraordenacao", "coima",
    "prazo", "licenciamento", "registo obrigatório", "registo obrigatorio",
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
    """Evita duplicados se o script correr mais do que uma vez sobre o mesmo dia."""
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
            "data_publicacao": date.today().isoformat(),
            "resumo": descricao,
            "motivo_filtro": "; ".join(motivo_partes),
        })

    novos = 0
    for c in candidatos:
        if ja_existe(c["fonte_url"]):
            continue
        inserir_candidato(c)
        novos += 1

    print(f"RSS lido: {len(items)} diplomas. Candidatos novos: {novos}. Ignorados (sem tipo/palavra-chave): {ignorados}.")
    if novos > 0:
        print("Rever em 'stg_obrigacoes_candidatas' (estado='pendente') antes de promover para 'obrigacoes'.")


if __name__ == "__main__":
    main()
