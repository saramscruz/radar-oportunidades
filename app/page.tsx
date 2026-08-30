import Link from "next/link";

// Piloto fechado, por convite — não há registo público (Princípio 3 do PRD).
// Esta página assume que a pessoa já foi convidada; não tenta validar isso
// aqui — a validação real acontece no consentimento e no registo.
export default function ConvitePage() {
  return (
    <>
      <header className="topbar">
        <div className="brand">
          Radar de <span>Oportunidades</span>
        </div>
      </header>
      <main>
        <span className="sector-pill">Piloto fechado · por convite</span>
        <h1>Foi convidado a experimentar o Radar de Oportunidades</h1>
        <p className="lede">
          Uma camada de vigilância sobre legislação e financiamento públicos,
          filtrada pelo setor de atividade da sua empresa. Nunca substitui
          aconselhamento profissional — apenas sinaliza o que poderá
          aplicar-se.
        </p>
        <Link href="/registo" className="btn">
          Aceitar convite e começar
        </Link>
      </main>
    </>
  );
}
