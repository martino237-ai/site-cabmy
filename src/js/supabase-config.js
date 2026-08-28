/* supabase-config.js – Configuration Supabase côté frontend */

// Configuration depuis .env.local (sera injectée par le serveur)
const SUPABASE_CONFIG = {
  url: 'https://dkhgaehodxugrwpdvbuk.supabase.co',
  anonKey: 'sb_publishable_27QjPv6iSD64BTyIjm--jA_j3oJwSkv'
};

// Initialiser le client Supabase avec REST API
let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = {
      auth: {
        async signInWithPassword({ email, password }) {
          try {
            const res = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/token?grant_type=password`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_CONFIG.anonKey
              },
              body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
              const err = await res.json();
              return { data: null, error: new Error(err.error_description || err.error || 'Authentication failed') };
            }

            const data = await res.json();
            return {
              data: {
                session: {
                  access_token: data.access_token,
                  refresh_token: data.refresh_token,
                  user: { 
                    id: data.user?.id,
                    email: data.user?.email,
                    user_metadata: data.user?.user_metadata
                  }
                },
                user: data.user
              },
              error: null
            };
          } catch (err) {
            return { data: null, error: err };
          }
        },

        async getSession() {
          return { data: { session: null }, error: null };
        },

        async signOut() {
          return { error: null };
        }
      },

      from: (table) => ({
        select: (columns = '*') => ({
          async eq(col, val) {
            try {
              const token = '';
              
              const res = await fetch(
                `${SUPABASE_CONFIG.url}/rest/v1/${table}?select=${columns}&${col}=eq.${val}`,
                {
                  headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': token ? `Bearer ${token}` : ''
                  }
                }
              );

              if (!res.ok) {
                const err = await res.json();
                return { data: null, error: err };
              }

              return { data: await res.json(), error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          },

          order: (col, opts = {}) => ({
            async limit(n) {
              try {
                const token = '';
                const dir = opts.ascending ? 'asc' : 'desc';

                const res = await fetch(
                  `${SUPABASE_CONFIG.url}/rest/v1/${table}?select=${columns}&order=${col}.${dir}&limit=${n}`,
                  {
                    headers: {
                      'apikey': SUPABASE_CONFIG.anonKey,
                      'Authorization': token ? `Bearer ${token}` : ''
                    }
                  }
                );

                if (!res.ok) {
                  const err = await res.json();
                  return { data: null, error: err };
                }

                return { data: await res.json(), error: null };
              } catch (err) {
                return { data: null, error: err };
              }
            }
          })
        })
      })
    };
  }
  return supabaseClient;
}

// Attendre que le DOM soit chargé
window.addEventListener('load', () => {
  console.log('✅ Supabase client prêt');
});
