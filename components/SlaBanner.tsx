import { createClient } from "@/lib/supabase/server";

// Lê a tabela sla_status (Anexo D do PRD) para o mês corrente. Se a revisão
// mensal de fundos ou de obrigações não estiver marcada como feita, mostra
// um aviso explícito em vez de apresentar dados possivelmente desatualizados
// sem sinalização nenhuma — é o mecanismo de "pausa" do R5, tornado visível.
export default async function SlaBanner() {
  const supabase = createClient();

  const primeiroDiaDoMes = new Date();
  primeiroDiaDoMes.setDate(1);
  const mesReferencia = primeiroDiaDoMes.toISOString().slice(0, 10);

  const { data } = await supabase
    .from("sla_status")
    .select("revisao_fundos_feita, revisao_obrigacoes_feita")
    .eq("mes_referencia", mesReferencia)
    .maybeSingle();

  const emDia =
    data?.revisao_fundos_feita === true &&
    data?.revisao_obrigacoes_feita === true;

  if (emDia) return null;

  return (
    <div className="sla-banner">
      A revisão mensal dos dados ainda não foi concluída este mês — alguns
      prazos ou classificações podem estar desatualizados. Confirme sempre a
      fonte oficial antes de agir.
    </div>
  );
}
