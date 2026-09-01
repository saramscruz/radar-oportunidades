import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SlaBanner from "@/components/SlaBanner";

export default async function FeedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // O middleware já garante que há sessão; se por algum motivo não houver
  // utilizador aqui (edge case), mostramos um estado vazio simples.
  if (!user) {
    return (
      <main>
        <p className="lede">Sessão não encontrada. Volte a entrar.</p>
        <Link href="/login" className="btn">
          Ir para o login
        </Link>
      </main>
    );
  }

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id, cae_principal, setores!empresas_cae_principal_fkey(secao_cae, nome_secao)")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!empresa) {
    return (
      <main>
        <p className="lede">
          Não encontrámos o registo da sua empresa. Contacte o suporte.
        </p>
      </main>
    );
  }

  const setor = Array.isArray(empresa.setores)
    ? empresa.setores[0]
    : (empresa.setores as unknown as { secao_cae: string; nome_secao: string });

  const { data: obrigacoesSetor } = await supabase
    .from("obrigacoes_setores")
    .select("obrigacoes(id, titulo, fonte_url, data_entrada_vigor)")
    .eq("setor_id", empresa.cae_principal);

  // Obrigações que não dependem do CAE (ex: whistleblowing, aplicam-se por
  // dimensão a qualquer setor) — não ficam em obrigacoes_setores, por isso
  // precisam de uma segunda query, combinada com a de cima.
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
    .eq("setor_id", empresa.cae_principal);

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
      <SlaBanner />
      <main>
        <span className="sector-pill">
          {setor?.secao_cae} — {setor?.nome_secao}
        </span>
        <h1>O seu feed</h1>
        <p className="lede">Filtrado apenas pelo seu setor.</p>

        <h3 className="section-title" style={{ marginTop: 4 }}>
          Obrigações legais ({obrigacoes.length})
        </h3>
        {obrigacoes.map((item) => (
          <Link key={item.id} href={`/feed/obrigacao/${item.id}`} className="card">
            <span className="badge legal">Legal</span>
            <h3>{item.titulo}</h3>
            <div className="meta">
              Entra em vigor: {item.data_entrada_vigor ?? "—"}
            </div>
          </Link>
        ))}

        <h3 className="section-title">
          Fundos ({fundosAtivos.length})
        </h3>
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
