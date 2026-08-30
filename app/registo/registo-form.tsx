"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registar, type EstadoRegisto } from "./actions";

type Setor = { id: string; secao_cae: string; nome_secao: string };

function BotaoSubmeter() {
  const { pending } = useFormStatus();
  return (
    <button className="btn" type="submit" disabled={pending}>
      {pending ? "A criar conta…" : "Ativar feed"}
    </button>
  );
}

export default function RegistoForm({ setores }: { setores: Setor[] }) {
  const [estado, formAction] = useFormState<EstadoRegisto, FormData>(
    registar,
    undefined
  );

  return (
    <form action={formAction}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div className="field">
        <label htmlFor="password">Palavra-passe</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={8}
        />
      </div>

      <div className="field">
        <label htmlFor="nif">NIF</label>
        <input
          type="text"
          id="nif"
          name="nif"
          inputMode="numeric"
          maxLength={9}
          placeholder="509 xxx xxx"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="setor_id">Setor de atividade (CAE)</label>
        <select id="setor_id" name="setor_id" required defaultValue="">
          <option value="" disabled>
            Selecione o setor…
          </option>
          {setores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.secao_cae} — {s.nome_secao}
            </option>
          ))}
        </select>
      </div>

      <div className="consent-box">
        O Radar de Oportunidades reúne e organiza informação pública de
        fontes oficiais (Diário da República, EUR-Lex, Portugal 2030) para
        orientação inicial. As classificações de setor são indicativas, com
        base legal exata sempre citada. Isto <strong>poderá</strong>{" "}
        aplicar-se à sua empresa — recomendamos confirmar com um advogado,
        contabilista ou consultor de conformidade se se aplica ao seu caso
        concreto. Não constitui aconselhamento jurídico, fiscal ou
        contabilístico.
      </div>

      <label
        className="check-row"
        htmlFor="consentiu"
        style={{ cursor: "pointer" }}
      >
        <input type="checkbox" id="consentiu" name="consentiu" required />
        <span style={{ fontSize: 13 }}>
          Li e aceito os termos acima e autorizo o envio de alertas por email
          para a minha empresa.
        </span>
      </label>

      {estado?.erro && <p className="error">{estado.erro}</p>}

      <BotaoSubmeter />
    </form>
  );
}
