import { createBrowserClient } from "@supabase/ssr";

// Cliente para uso em componentes de cliente ("use client").
// Usa sempre a chave pública (anon) — a segurança vem do RLS, não da chave.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
