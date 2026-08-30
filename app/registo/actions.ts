"use server";

import { createHash } from "crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoRegisto = { erro?: string } | undefined;

export async function registar(
  _estadoAnterior: EstadoRegisto,
  formData: FormData
): Promise<EstadoRegisto> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nif = String(formData.get("nif") || "").replace(/\s/g, "");
  const setorId = String(formData.get("setor_id") || "");
  const consentiu = formData.get("consentiu") === "on";

  if (!/^\d{9}$/.test(nif)) {
    return { erro: "Introduza um NIF com 9 dígitos." };
  }
  if (!setorId) {
    return { erro: "Selecione o setor de atividade." };
  }
  if (!consentiu) {
    return { erro: "É necessário aceitar os termos para continuar." };
  }

  const supabase = createClient();

  // 1. Cria a conta de autenticação.
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError || !authData.user) {
    return { erro: authError?.message || "Não foi possível criar a conta." };
  }

  // 2. NIF nunca em claro — só o hash entra na base (R3 do PRD).
  const nifHash = createHash("sha256").update(nif).digest("hex");

  // 3. Cria o registo da empresa, já ligado ao utilizador de autenticação,
  //    com o consentimento RGPD registado com timestamp (R6 / Princípio 4).
  const { error: empresaError } = await supabase.from("empresas").insert({
    nif_hash: nifHash,
    cae_principal: setorId,
    email_contacto: email,
    auth_user_id: authData.user.id,
    consentimento_rgpd_em: new Date().toISOString(),
  });

  if (empresaError) {
    return { erro: `Conta criada, mas falhou o registo da empresa: ${empresaError.message}` };
  }

  redirect("/feed");
}
