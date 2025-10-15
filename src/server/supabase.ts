// Em: src/server/supabase.ts

import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";

// Criamos um cliente Supabase que será usado em todo o nosso backend
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      // Importante: desativa a persistência de sessão no lado do servidor
      persistSession: false,
    },
  },
);