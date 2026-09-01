import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Página pública, equivalente ao "Setores details" do Softr. Mostra o que
// se aplica a UM setor à escolha — ao contrário do /feed (pessoal), esta
// página deixa comparar setores diferentes só trocando o URL/clicando
// noutro setor na lista, sem precisar de mudar de conta.
export default async function SetorDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: setor } = await supabase
    .from("setores")
    .select("id, secao_cae, nome_secao, descricao")
    .eq("id", params.id)
    .maybeSingle();

  if (!setor) notFound();

  const { data: obrigacoesSetor } = await supabase
    .from("obrigacoes_setores")
    .select("obrigacoes(id, titulo, fonte_url, data_entrada_vigor)")
    .eq("setor_id", params.id);

  // Obrigações que não dependem do CAE (ex: whistleblowing) — mostram-se em
  // qualquer setor, não só no(s) setor(es) ligado(s) via obrigacoes_setores.
  const { data: obrigacoesUniversais } = await supabase
    .from("obrigacoes")
    .select("id, titulo, fonte_url, data_entrada_vigor")
    .eq("aplica_a_todos_setores", true)
    .eq("status", "ativo");

  const obrigacoes = [
    ...(obrigacoesSetor ?? []).map((o) => o.obrigacoes as any),
    ...(obrigacoesUniversais ?? []),
  ];

  const { data: fundos } = await supabase
    .from("fundos_setores")
    .select("fundos(id, nome, fonte_url, prazo, status)")
    .eq("setor_id", params.id);

  const fundosAtivos = (fundos ?? [])
    .map((f) => f.fundos as any)
    .filter((f) => f?.status === "ativo");

  return (
    <>
      <header className="topbar">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <circle cx="11" cy="11" r="9" fill="none" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.5" />
          <circle cx="11" cy="11" r="5.5" fill="none" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.7" />
          <circle cx="11" cy="11" r="2" fill="#2DD4BF" />
        </svg>
        <div className="brand">
          Radar de <span>Oportunidades</span>
        </div>
      </header>
      <main>
        <Link
          href="/setores"
          className="btn ghost"
          style={{ width: "auto", padding: "8px 14px", marginBottom: 18, display: "inline-flex" }}
        >
          ← Trocar de setor
        </Link>

        <span className="sector-pill">{setor.secao_cae}</span>
        <h1>{setor.nome_secao}</h1>
        {setor.descricao && <p className="lede">{setor.descricao}</p>}

        <h3 className="section-title" style={{ marginTop: 4 }}>
          Obrigações legais ({obrigacoes.length})
        </h3>
        {obrigacoes.length === 0 && (
          <p className="lede" style={{ fontSize: 13 }}>
            Nenhuma obrigação classificada para este setor até agora.
          </p>
        )}
        {obrigacoes.map((item) => (
          <Link key={item.id} href={`/feed/obrigacao/${item.id}`} className="card">
            <span className="badge legal">Legal</span>
            <h3>{item.titulo}</h3>
            <div className="meta">Entra em vigor: {item.data_entrada_vigor ?? "—"}</div>
          </Link>
        ))}

        <h3 className="section-title">Fundos ({fundosAtivos.length})</h3>
        {fundosAtivos.length === 0 && (
          <p className="lede" style={{ fontSize: 13 }}>
            Nenhum fundo ativo classificado para este setor até agora.
          </p>
        )}
        {fundosAtivos.map((f) => (
          <Link key={f.id} href={`/feed/fundo/${f.id}`} className="card">
            <span className="badge fundo">Fundo</span>
            <h3>{f.nome}</h3>
            <div className="meta">Prazo: {f.prazo ?? "—"}</div>
          </Link>
        ))}
      </main>
    </>
  );
}
