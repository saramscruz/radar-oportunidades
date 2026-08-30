import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar de Oportunidades",
  description:
    "Vigilância contínua sobre legislação e financiamento públicos, filtrada por setor de atividade.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT">
      <body>
        <div className="app-shell">
          {children}
          <div className="disclaimer">
            O Radar de Oportunidades reúne e organiza informação pública de
            fontes oficiais (Diário da República, EUR-Lex, Portugal 2030)
            para orientação inicial. Não constitui aconselhamento jurídico,
            fiscal ou contabilístico, nem substitui a consulta a um
            profissional habilitado.
          </div>
        </div>
      </body>
    </html>
  );
}
