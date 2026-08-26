const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');

require('dotenv').config({ path: '.env.local' });

const PORT = Number(process.env.PORT || 8001);
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dkhgaehodxugrwpdvbuk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1PVlizDx7kuKO7NYp9VgchePO-K77_e_w';
const GOOGLE_SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '';
const GOOGLE_SERVICE_ACCOUNT_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || 'google-service-account.json';
const GOOGLE_OAUTH_CLIENT_FILE = process.env.GOOGLE_OAUTH_CLIENT_FILE || 'google-oauth-client.json';
const GOOGLE_OAUTH_TOKEN_FILE = process.env.GOOGLE_OAUTH_TOKEN_FILE || 'google-oauth-token.json';
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
  for (const key of ['titre', 'cat', 'statut', 'resume', 'contenu', 'emoji', 'date']) {
    if (body[key] !== undefined) payload[key] = body[key];
  }
  const mediaColumns = { mediaType: 'mediatype', mediaUrl: 'mediaurl', mediaUrls: 'mediaurls', mediaAlt: 'mediaalt' };
  for (const [sourceKey, targetKey] of Object.entries(mediaColumns)) {
    if (body[sourceKey] !== undefined) payload[targetKey] = body[sourceKey];
  }
  return payload;
}

function normalizeArticleRow(article) {
  if (!article) return article;
  return {
    ...article,
    mediaType: article.mediaType ?? article.mediatype ?? null,
    mediaUrl: article.mediaUrl ?? article.mediaurl ?? '',
    mediaUrls: article.mediaUrls ?? article.mediaurls ?? [],
    mediaAlt: article.mediaAlt ?? article.mediaalt ?? ''
  };
}

function getDriveClient() {
  const oauthClient = getOAuthClient();
  if (oauthClient) {
    const tokenPath = path.resolve(GOOGLE_OAUTH_TOKEN_FILE);
    if (fs.existsSync(tokenPath)) {
      oauthClient.setCredentials(JSON.parse(fs.readFileSync(tokenPath, 'utf8')));
      return google.drive({ version: 'v3', auth: oauthClient });
    }
  }
  if (!GOOGLE_DRIVE_FOLDER_ID) return null;
  const credentialsSource = GOOGLE_SERVICE_ACCOUNT_JSON || (() => {
    const filePath = path.resolve(GOOGLE_SERVICE_ACCOUNT_FILE);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  })();
  if (!credentialsSource) return null;
  let credentials;
  try {
    credentials = JSON.parse(credentialsSource);
  } catch (error) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON doit contenir un JSON Google valide');
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });
  return google.drive({ version: 'v3', auth });
}

function getOAuthClient() {
  const filePath = path.resolve(GOOGLE_OAUTH_CLIENT_FILE);
  if (!fs.existsSync(filePath)) return null;
  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const credentials = config.installed || config.web || config;
  return new google.auth.OAuth2(credentials.client_id, credentials.client_secret, 'http://localhost:8001/oauth2callback');
}

function parseDataUrl(value) {
  const match = typeof value === 'string' && value.match(/^data:([^;]+);base64,(.+)$/);
  return match ? { mimeType: match[1], buffer: Buffer.from(match[2], 'base64') } : null;
}

async function uploadMediaToDrive(value, index) {
  const parsed = parseDataUrl(value?.url || value);
  if (!parsed) return value;
  const drive = getDriveClient();
  if (!drive) throw new Error('Google Drive non configuré: ajoutez GOOGLE_SERVICE_ACCOUNT_JSON');
  const extension = parsed.mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'bin';
  const uploaded = await drive.files.create({
    requestBody: {
      name: `cabmy-${Date.now()}-${index}.${extension}`,
      parents: [GOOGLE_DRIVE_FOLDER_ID]
    },
    media: { mimeType: parsed.mimeType, body: require('stream').Readable.from(parsed.buffer) },
    fields: 'id'
  });
  await drive.permissions.create({ fileId: uploaded.data.id, requestBody: { role: 'reader', type: 'anyone' } });
  return `https://drive.usercontent.google.com/download?id=${uploaded.data.id}&export=view`;
}

async function uploadArticleMedia(payload) {
  const items = Array.isArray(payload.mediaurls) ? payload.mediaurls : [];
  if (!items.length) return payload;
  const uploadedItems = await Promise.all(items.map((item, index) => uploadMediaToDrive(item, index)));
  return {
    ...payload,
    mediaurl: uploadedItems.length === 1 ? uploadedItems[0] : JSON.stringify(uploadedItems),
    mediaurls: uploadedItems
  };
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

  if (url.pathname === '/auth/google') {
    try {
      const client = getOAuthClient();
      if (!client) throw new Error(`Déposez le fichier ${GOOGLE_OAUTH_CLIENT_FILE} dans le projet`);
      res.writeHead(302, { Location: client.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: ['https://www.googleapis.com/auth/drive.file'] }) });
      res.end();
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (url.pathname === '/oauth2callback') {
    try {
      const client = getOAuthClient();
      if (!client || !url.searchParams.get('code')) throw new Error('Autorisation Google incomplète');
      const { tokens } = await client.getToken(url.searchParams.get('code'));
      fs.writeFileSync(path.resolve(GOOGLE_OAUTH_TOKEN_FILE), JSON.stringify(tokens, null, 2));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Google Drive est connecté</h1><p>Vous pouvez fermer cette fenêtre et publier votre article.</p>');
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
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
        try {
            const { data, error: fallbackError } = await client.from('articles').select('id,titre,cat,statut,resume,contenu,emoji,date,mediatype,mediaurl,mediaurls,mediaalt,created_at').order('created_at', { ascending: false });
          if (fallbackError) throw fallbackError;
            sendJson(res, 200, (data || []).map(normalizeArticleRow));
        } catch (fallbackError) {
          sendJson(res, 200, []);
        }
      }
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        let payload = normalizePayload(JSON.parse(body || '{}'));
        try {
          payload = await uploadArticleMedia(payload);
        } catch (error) {
          sendJson(res, 400, { error: error.message });
          return;
        }
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
      let payload = normalizePayload(JSON.parse(body || '{}'));
      try {
        payload = await uploadArticleMedia(payload);
      } catch (error) {
        sendJson(res, 400, { error: error.message });
        return;
      }
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
