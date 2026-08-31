import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Página pública — não protegida pelo middleware (não começa por /feed).
// Permite explorar todos os setores sem precisar de conta, ao contrário do
// /feed (que é pessoal, filtrado pela empresa autenticada). Útil para
// validação de mercado (mostrar o produto sem pedir registo) e para a
// própria equipa comparar setores lado a lado.
export default async function SetoresPage() {
  const supabase = createClient();
  const { data: setores } = await supabase
    .from("setores")
    .select("id, secao_cae, nome_secao, descricao")
    .order("secao_cae");

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
        <h1>Explorar por setor</h1>
        <p className="lede">
          Escolha um setor (CAE-Rev.4) para ver as obrigações legais e
          fundos que se aplicam — sem precisar de criar conta.
        </p>
        {(setores ?? []).map((s) => (
          <Link key={s.id} href={`/setores/${s.id}`} className="card">
            <span className="badge legal" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
              {s.secao_cae}
            </span>
            <h3>{s.nome_secao}</h3>
            {s.descricao && <div className="meta">{s.descricao}</div>}
          </Link>
        ))}
      </main>
    </>
  );
}
