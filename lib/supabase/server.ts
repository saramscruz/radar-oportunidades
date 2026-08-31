import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente para uso em Server Components, Server Actions e Route Handlers.
// Continua a usar a chave pública (anon) — a sessão do utilizador vem dos
// cookies, e o RLS decide o que essa sessão pode ver/escrever.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Parameters<typeof cookieStore.set>[2];
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component — o middleware trata
            // da renovação da sessão, por isso isto pode ser ignorado aqui.
          }
        },
      },
    }
  );
}