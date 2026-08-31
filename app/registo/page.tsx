import { createClient } from "@/lib/supabase/server";
import RegistoForm from "./registo-form";

export default async function RegistoPage() {
  const supabase = createClient();
  const { data: setores } = await supabase
    .from("setores")
    .select("id, secao_cae, nome_secao")
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
        <div className="lede" style={{ margin: "0 0 0 auto", fontSize: 12 }}>
          passo 1 de 2
        </div>
      </header>
      <main>
        <h1>Registo da empresa</h1>
        <p className="lede">
          O NIF é guardado apenas em formato de hash — nunca em texto
          simples. É usado só para identificar o registo, nunca partilhado.
        </p>
        <RegistoForm setores={setores ?? []} />
      </main>
    </>
  );
}
