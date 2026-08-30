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
        <div className="brand">
          Radar de <span>Oportunidades</span>
        </div>
        <div className="lede" style={{ margin: 0, fontSize: 12 }}>
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
