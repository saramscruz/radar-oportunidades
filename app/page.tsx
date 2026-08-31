import Link from "next/link";
import RadarGraphic from "@/components/RadarGraphic";

// Piloto fechado, por convite — não há registo público (Princípio 3 do PRD).
// Esta página assume que a pessoa já foi convidada; não tenta validar isso
// aqui — a validação real acontece no consentimento e no registo.
export default function ConvitePage() {
  return (
    <>
      <header className="topbar">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <circle cx="11" cy="11" r="9" fill="none" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.5" />
          <circle cx="11" cy="11" r="5.5" fill="none" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.7" />
          <circle cx="11" cy="11" r="2" fill="#2DD4BF" />
        </svg>
        <div className="brand">Radar de Oportunidades</div>
      </header>
      <main>
        <span className="sector-pill">Piloto fechado · por convite</span>
        <h1>Foi convidado a experimentar o Radar de Oportunidades</h1>
        <p className="lede">
          Acompanhe financiamentos e obrigações legais filtrados pelo setor
          da sua empresa, sem perder prazos importantes.
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
          <RadarGraphic />
        </div>

        <div className="card" style={{ cursor: "default" }}>
          <span className="badge legal">Legal</span>
          <h3>
            Regime Jurídico da Cibersegurança (NIS2) — gestão de risco,
            notificação de incidentes e responsável de cibersegurança
          </h3>
          <div className="meta">Entra em vigor: 2026-04-03</div>
        </div>

        <p className="lede" style={{ fontSize: 12 }}>
          Um exemplo real do que o feed mostra — filtrado apenas pelos
          setores e obrigações que se aplicam à sua empresa. Fontes
          monitoradas: Diário da República, EUR-Lex, Portugal 2030.
        </p>

        <Link href="/registo" className="btn">
          Aceitar convite e começar
        </Link>
      </main>
    </>
  );
}
