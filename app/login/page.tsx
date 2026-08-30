"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { entrar, type EstadoLogin } from "./actions";

function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <button className="btn" type="submit" disabled={pending}>
      {pending ? "A entrar…" : "Entrar"}
    </button>
  );
}

export default function LoginPage() {
  const [estado, formAction] = useFormState<EstadoLogin, FormData>(
    entrar,
    undefined
  );

  return (
    <>
      <header className="topbar">
        <div className="brand">
          Radar de <span>Oportunidades</span>
        </div>
      </header>
      <main>
        <h1>Entrar</h1>
        <p className="lede">Aceda à sua conta para ver o seu feed.</p>
        <form action={formAction}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Palavra-passe</label>
            <input type="password" id="password" name="password" required />
          </div>
          {estado?.erro && <p className="error">{estado.erro}</p>}
          <BotaoEntrar />
        </form>
        <p className="lede" style={{ marginTop: 20 }}>
          Ainda não tem conta? <Link href="/registo">Registe a sua empresa</Link>.
        </p>
      </main>
    </>
  );
}
