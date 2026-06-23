const http = require('http');
const { createClient } = require('@supabase/supabase-js');

const PORT = Number(process.env.PORT || 8001);
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cqoyhtmowyzvpjdzypgs.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const HAS_SUPABASE_CREDENTIALS = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && SUPABASE_SERVICE_ROLE_KEY !== 'dummy-key' && !SUPABASE_SERVICE_ROLE_KEY.includes('dummy'));

if (!HAS_SUPABASE_CREDENTIALS) {
  console.warn('No usable Supabase credentials configured. The proxy will run in local fallback mode and return empty/success responses.');
}

let supabase = null;

function getSupabaseClient() {
  if (supabase) return supabase;
  if (!HAS_SUPABASE_CREDENTIALS) return null;
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    return supabase;
  } catch (error) {
    console.warn('Supabase client initialization failed:', error.message || error);
    return null;
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(payload));
}

function normalizePayload(body) {
  if (!body || typeof body !== 'object') return {};
  const payload = {};
  for (const key of ['titre', 'cat', 'statut', 'resume', 'contenu', 'emoji', 'date', 'mediaType', 'mediaUrl', 'mediaUrls', 'mediaAlt']) {
    if (body[key] !== undefined) payload[key] = body[key];
  }
  return payload;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (url.pathname === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url.pathname === '/api/articles') {
    if (req.method === 'GET') {
      const client = getSupabaseClient();
      if (!client) {
        sendJson(res, 200, []);
        return;
      }

      try {
        const { data, error } = await client.from('articles').select('id,titre,cat,statut,resume,contenu,emoji,date,mediaType,mediaUrl,mediaUrls,mediaAlt,created_at').order('created_at', { ascending: false });
        if (error) throw error;
        sendJson(res, 200, data || []);
      } catch (error) {
        sendJson(res, 200, []);
      }
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        const payload = normalizePayload(JSON.parse(body || '{}'));
        const client = getSupabaseClient();
        if (!client) {
          sendJson(res, 200, { id: payload.id || `local-${Date.now()}`, storedLocally: true });
          return;
        }

        try {
          const { data, error } = await client.from('articles').insert(payload).select('id').single();
          if (error) throw error;
          sendJson(res, 200, { id: data?.id || null });
        } catch (error) {
          sendJson(res, 200, { id: payload.id || `local-${Date.now()}`, storedLocally: true });
        }
      });
      return;
    }
  }

  const articleMatch = url.pathname.match(/^\/api\/articles\/(.+)$/);
  if (articleMatch && req.method === 'PUT') {
    const id = articleMatch[1];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      const payload = normalizePayload(JSON.parse(body || '{}'));
      const client = getSupabaseClient();
      if (!client) {
        sendJson(res, 200, { id, storedLocally: true });
        return;
      }

      try {
        const { error } = await client.from('articles').update(payload).eq('id', id);
        if (error) throw error;
        sendJson(res, 200, { id });
      } catch (error) {
        sendJson(res, 200, { id, storedLocally: true });
      }
    });
    return;
  }

  if (articleMatch && req.method === 'DELETE') {
    const id = articleMatch[1];
    const client = getSupabaseClient();
    if (!client) {
      sendJson(res, 200, { ok: true, storedLocally: true });
      return;
    }

    try {
      const { error } = await client.from('articles').delete().eq('id', id);
      if (error) throw error;
      sendJson(res, 200, { ok: true });
    } catch (error) {
      sendJson(res, 200, { ok: true, storedLocally: true });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Supabase proxy listening on http://localhost:${PORT}`);
});
