import type { ReactNode } from "react";
import RadarGraphic from "@/components/RadarGraphic";

// Página interna de pré-visualização — NÃO faz parte do fluxo do produto.
// Mostra todos os ecrãs/estados principais de uma vez, com dados fixos,
// sem autenticação nem chamadas ao Supabase — só para revisão visual.
//
// Não está ligada a nenhum menu, mas fica publicamente acessível em
// /preview enquanto existir. Remover ou proteger com autenticação antes
// de um lançamento público real (ver PRD, R6).

const RadarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
    <circle cx="11" cy="11" r="9" fill="none" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.5" />
    <circle cx="11" cy="11" r="5.5" fill="none" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.7" />
    <circle cx="11" cy="11" r="2" fill="#2DD4BF" />
  </svg>
);

function Frame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#5EEAD4",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          maxWidth: 400,
          background: "#0D1B33",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "32px 20px 80px" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>Pré-visualização interna</h1>
      <p className="lede">
        Todos os ecrãs principais, com dados fixos. Não é uma página real do
        produto — não ligar a nenhum menu, remover antes do lançamento
        público.
      </p>

      {/* 1. Landing / convite */}
      <Frame label="1. Convite (/)">
        <div className="topbar">
          <RadarIcon />
          <div className="brand">Radar de Oportunidades</div>
        </div>
        <main>
          <span className="sector-pill">Piloto fechado · por convite</span>
          <h1>Foi convidado a experimentar o Radar de Oportunidades</h1>
          <p className="lede">
            Acompanhe financiamentos e obrigações legais filtrados pelo
            setor da sua empresa, sem perder prazos importantes.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
            <RadarGraphic />
          </div>
          <div className="card" style={{ cursor: "default" }}>
            <span className="badge legal">Legal</span>
            <h3>Regime Jurídico da Cibersegurança (NIS2)</h3>
            <div className="meta">Entra em vigor: 2026-04-03</div>
          </div>
          <div className="btn" style={{ marginTop: 12 }}>
            Aceitar convite e começar
          </div>
        </main>
      </Frame>

      {/* 2. Registo */}
      <Frame label="2. Registo (/registo)">
        <div className="topbar">
          <RadarIcon />
          <div className="brand">
            Radar de <span>Oportunidades</span>
          </div>
          <div className="lede" style={{ margin: "0 0 0 auto", fontSize: 12 }}>
            passo 1 de 2
          </div>
        </div>
        <main>
          <h1>Registo da empresa</h1>
          <p className="lede">
            O NIF é guardado apenas em formato de hash — nunca em texto
            simples.
          </p>
          <div className="field">
            <label>Email</label>
            <input defaultValue="" placeholder="empresa@exemplo.pt" readOnly />
          </div>
          <div className="field">
            <label>Palavra-passe</label>
            <input type="password" readOnly />
          </div>
          <div className="field">
            <label>NIF</label>
            <input placeholder="509 xxx xxx" readOnly />
          </div>
          <div className="field">
            <label>Setor de atividade (CAE)</label>
            <select disabled>
              <option>A — Agricultura, floresta e pesca</option>
            </select>
          </div>
          <div className="consent-box">
            As classificações de setor são indicativas, com base legal
            exata sempre citada. Isto <strong>poderá</strong> aplicar-se à
            sua empresa — recomendamos confirmar com um advogado,
            contabilista ou consultor de conformidade.
          </div>
          <div className="check-row">
            <input type="checkbox" readOnly />
            <span style={{ fontSize: 13 }}>
              Li e aceito os termos e autorizo o envio de alertas por email.
            </span>
          </div>
          <div className="btn">Ativar feed</div>
        </main>
      </Frame>

      {/* 3. Login */}
      <Frame label="3. Login (/login)">
        <div className="topbar">
          <RadarIcon />
          <div className="brand">
            Radar de <span>Oportunidades</span>
          </div>
        </div>
        <main>
          <h1>Entrar</h1>
          <p className="lede">Aceda à sua conta para ver o seu feed.</p>
          <div className="field">
            <label>Email</label>
            <input readOnly />
          </div>
          <div className="field">
            <label>Palavra-passe</label>
            <input type="password" readOnly />
          </div>
          <div className="btn">Entrar</div>
        </main>
      </Frame>

      {/* 4. Feed — com aviso de SLA visível */}
      <Frame label="4a. Feed — com aviso de SLA (revisão mensal em atraso)">
        <div className="topbar">
          <RadarIcon />
          <div className="brand">
            Radar de <span>Oportunidades</span>
          </div>
        </div>
        <div className="sla-banner">
          A revisão mensal dos dados ainda não foi concluída este mês —
          alguns prazos ou classificações podem estar desatualizados.
        </div>
        <main>
          <span className="sector-pill">A — Agricultura, floresta e pesca</span>
          <h1>O seu feed</h1>
          <p className="lede">Filtrado apenas pelo seu setor.</p>
          <h3 className="section-title" style={{ marginTop: 4 }}>
            Obrigações legais (2)
          </h3>
          <div className="card">
            <span className="badge legal">Legal</span>
            <h3>Registo de atividades de tratamento (ROPA)</h3>
            <div className="meta">Entra em vigor: 2018-05-25</div>
          </div>
          <div className="card">
            <span className="badge legal">Legal</span>
            <h3>Notificação de violações de dados pessoais</h3>
            <div className="meta">Entra em vigor: 2018-05-25</div>
          </div>
          <h3 className="section-title">Fundos (1)</h3>
          <div className="card">
            <span className="badge fundo">Fundo</span>
            <h3>Aviso de exemplo — Portugal 2030</h3>
            <div className="meta">Prazo: 2026-12-15</div>
          </div>
        </main>
      </Frame>

      {/* 4b. Feed — sem aviso de SLA */}
      <Frame label="4b. Feed — sem aviso (ciclo mensal em dia)">
        <div className="topbar">
          <RadarIcon />
          <div className="brand">
            Radar de <span>Oportunidades</span>
          </div>
        </div>
        <main>
          <span className="sector-pill">T — Outras atividades de serviços</span>
          <h1>O seu feed</h1>
          <p className="lede">Filtrado apenas pelo seu setor.</p>
          <h3 className="section-title" style={{ marginTop: 4 }}>
            Obrigações legais (1)
          </h3>
          <div className="card">
            <span className="badge legal">Legal</span>
            <h3>Transparência de conteúdo gerado por IA</h3>
            <div className="meta">Entra em vigor: 2026-08-02</div>
          </div>
        </main>
      </Frame>

      {/* 5. Detalhe de alerta */}
      <Frame label="5. Detalhe do alerta (/feed/obrigacao/[id])">
        <div className="topbar">
          <RadarIcon />
          <div className="brand">
            Radar de <span>Oportunidades</span>
          </div>
        </div>
        <main>
          <div
            className="btn ghost"
            style={{ width: "auto", padding: "8px 14px", marginBottom: 18, display: "inline-flex" }}
          >
            ← Voltar ao feed
          </div>
          <div className="alert-detail">
            <h2 style={{ fontWeight: 700, marginTop: 0 }}>
              Regime Jurídico da Cibersegurança (NIS2)
            </h2>
            <p className="meta">Fonte: diariodarepublica.pt</p>
            <p>
              <strong>Base legal exata:</strong> Decreto-Lei n.º 125/2025,
              de 4 dez. — Art. 3º, Art. 6º, Art. 31º e Art. 32º
            </p>
            <p>
              <strong>Prazo:</strong> 2026-04-03
            </p>
            <div className="hedge">
              Isto poderá aplicar-se à sua empresa. Recomendamos confirmar
              com um advogado, contabilista ou consultor de conformidade se
              se aplica ao seu caso concreto.
            </div>
          </div>
        </main>
      </Frame>
    </div>
  );
}
