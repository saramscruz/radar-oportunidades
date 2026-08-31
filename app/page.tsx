import Link from "next/link";
import RadarGraphic from "@/components/RadarGraphic";

// Piloto fechado, por convite — não há registo público (Princípio 3 do PRD).
// Esta página assume que a pessoa já foi convidada; não tenta validar isso
// aqui — a validação real acontece no consentimento e no registo.

const features = [
  {
    title: "Filtre por setor",
    body: "Veja só as oportunidades relevantes para o CAE da sua empresa.",
    icon: (
      <path d="M4 5h16l-6 8v5l-4-2v-3L4 5z" stroke="#2DD4BF" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    title: "Consulte prazos",
    body: "Acompanhe datas-limite de fundos e obrigações antes que se aproximem.",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="#2DD4BF" strokeWidth="1.6" fill="none" />
        <path d="M4 9h16M8 3v4M16 3v4" stroke="#2DD4BF" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Aceda aos detalhes",
    body: "Toda a informação essencial, com fonte legal, num único ecrã.",
    icon: (
      <>
        <path d="M6 3h9l4 4v14H6V3z" stroke="#2DD4BF" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
        <path d="M9 12h7M9 16h5" stroke="#2DD4BF" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

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

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <RadarGraphic />
        </div>

        {/* Fontes oficiais — pílula, tal como no produto ao vivo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "var(--text-secondary)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              padding: "7px 14px",
              borderRadius: 20,
            }}
          >
            Dados oficiais: Diário da República · EUR-Lex · Portugal 2030
          </div>
        </div>

        {/* Três funcionalidades, com ícone dentro de círculo — agora
            genuinamente clicáveis (levam a /setores), não só decorativas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
          {features.map((f) => (
            <Link
              key={f.title}
              href="/setores"
              className="card"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: 16,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(45,212,191,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {f.icon}
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: "var(--text-primary)" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                  {f.body}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <h3 className="section-title" style={{ marginTop: 0 }}>
          Um exemplo real do feed
        </h3>
        <div
          className="card"
          style={{
            cursor: "default",
            border: "1px dashed var(--border-strong)",
            background: "transparent",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--text-muted)",
            }}
          >
            Pré-visualização
          </span>
          <span className="badge legal">Legal</span>
          <h3>
            Regime Jurídico da Cibersegurança (NIS2) — gestão de risco,
            notificação de incidentes e responsável de cibersegurança
          </h3>
          <div className="meta">Entra em vigor: 2026-04-03</div>
        </div>

        <Link href="/registo" className="btn" style={{ marginTop: 8 }}>
          Aceitar convite e começar
        </Link>
        <Link href="/setores" className="btn ghost" style={{ marginTop: 10 }}>
          Explorar por setor, sem criar conta
        </Link>
      </main>
    </>
  );
}
