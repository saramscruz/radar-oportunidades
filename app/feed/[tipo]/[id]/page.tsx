import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DetalheAlertaPage({
  params,
}: {
  params: { tipo: string; id: string };
}) {
  const supabase = createClient();
  const isObrigacao = params.tipo === "obrigacao";

  const { data: item } = isObrigacao
    ? await supabase
        .from("obrigacoes")
        .select(
          "titulo, fonte_url, data_publicacao, base_legal_exata, data_entrada_vigor"
        )
        .eq("id", params.id)
        .maybeSingle()
    : await supabase
        .from("fundos")
        .select("nome, fonte_url, prazo, dotacao_eur, programa")
        .eq("id", params.id)
        .maybeSingle();

  if (!item) notFound();

  const titulo = isObrigacao ? (item as any).titulo : (item as any).nome;
  const baseLegal = isObrigacao
    ? (item as any).base_legal_exata
    : `Aviso ${(item as any).programa ?? ""} — ver fonte oficial`;
  const prazo = isObrigacao
    ? (item as any).data_entrada_vigor
    : (item as any).prazo;

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
        <Link href="/feed" className="btn ghost" style={{ width: "auto", padding: "8px 14px", marginBottom: 18, display: "inline-flex" }}>
          ← Voltar ao feed
        </Link>
        <div className="alert-detail">
          <h2 style={{ fontWeight: 700, marginTop: 0 }}>
            {titulo}
          </h2>
          <p className="meta">
            Fonte:{" "}
            <a href={item.fonte_url} target="_blank" rel="noreferrer">
              {item.fonte_url}
            </a>
          </p>
          <p>
            <strong>Base legal exata:</strong> {baseLegal}
          </p>
          <p>
            <strong>Prazo:</strong> {prazo ?? "—"}
          </p>
          <div className="hedge">
            Isto poderá aplicar-se à sua empresa. Recomendamos confirmar com
            um advogado, contabilista ou consultor de conformidade se se
            aplica ao seu caso concreto.
          </div>
        </div>
      </main>
    </>
  );
}
