const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');

require('dotenv').config({ path: '.env.local' });

const PORT = Number(process.env.PORT || 8001);
const APP_ORIGIN = (process.env.APP_ORIGIN || process.env.PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const GOOGLE_OAUTH_REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI || new URL('/oauth2callback', APP_ORIGIN).toString();
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:8000,http://localhost:8001,https://cabmy.netlify.app,https://site-cabmy.onrender.com').split(',').map(item => item.trim()).filter(Boolean);
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dkhgaehodxugrwpdvbuk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1PVlizDx7kuKO7NYp9VgchePO-K77_e_w';
const GOOGLE_SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '';
const GOOGLE_SERVICE_ACCOUNT_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || 'google-service-account.json';
const GOOGLE_OAUTH_CLIENT_FILE = process.env.GOOGLE_OAUTH_CLIENT_FILE || 'google-oauth-client.json';
const GOOGLE_OAUTH_TOKEN_FILE = process.env.GOOGLE_OAUTH_TOKEN_FILE || 'google-oauth-token.json';
const GOOGLE_OAUTH_CLIENT_JSON = process.env.GOOGLE_OAUTH_CLIENT_JSON || '';
const GOOGLE_OAUTH_TOKEN_JSON = process.env.GOOGLE_OAUTH_TOKEN_JSON || '';
const GOOGLE_DRIVE_ACCOUNT = process.env.GOOGLE_DRIVE_ACCOUNT || 'cabmyschool@gmail.com';
const GOOGLE_DRIVE_OAUTH_CLIENT_FILE = process.env.GOOGLE_DRIVE_OAUTH_CLIENT_FILE || GOOGLE_OAUTH_CLIENT_FILE;
const GOOGLE_DRIVE_OAUTH_TOKEN_FILE = process.env.GOOGLE_DRIVE_OAUTH_TOKEN_FILE || 'google-drive-oauth-token.json';
const GOOGLE_DRIVE_OAUTH_CLIENT_JSON = process.env.GOOGLE_DRIVE_OAUTH_CLIENT_JSON || GOOGLE_OAUTH_CLIENT_JSON;
const GOOGLE_DRIVE_OAUTH_TOKEN_JSON = process.env.GOOGLE_DRIVE_OAUTH_TOKEN_JSON || GOOGLE_OAUTH_TOKEN_JSON;
const GOOGLE_GMAIL_USER = process.env.GOOGLE_GMAIL_USER || 'cabmy2011@gmail.com';
const GOOGLE_GMAIL_OAUTH_CLIENT_JSON = process.env.GOOGLE_GMAIL_OAUTH_CLIENT_JSON || GOOGLE_OAUTH_CLIENT_JSON;
const GOOGLE_GMAIL_OAUTH_TOKEN_JSON = process.env.GOOGLE_GMAIL_OAUTH_TOKEN_JSON || GOOGLE_OAUTH_TOKEN_JSON;
const HAS_SUPABASE_CREDENTIALS = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && SUPABASE_SERVICE_ROLE_KEY !== 'dummy-key' && !SUPABASE_SERVICE_ROLE_KEY.includes('dummy'));

if (!HAS_SUPABASE_CREDENTIALS) {
  console.warn('No usable Supabase credentials configured. Configure SUPABASE_SERVICE_ROLE_KEY on Render.');
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

function getAllowedOrigin(origin) {
  if (!origin) return '*';
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (origin.startsWith('http://localhost:')) return origin;
  if (origin === 'null') return '*';
  return '*';
}

function sendJson(res, statusCode, payload, origin) {
  const allowedOrigin = getAllowedOrigin(origin || '*');
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function normalizePayload(body) {
  if (!body || typeof body !== 'object') return {};
  const payload = {};
  for (const key of ['titre', 'cat', 'statut', 'featured', 'resume', 'contenu', 'emoji', 'date']) {
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

  const rawMediaUrls = article.mediaUrls ?? article.mediaurls ?? article.mediaUrl ?? article.mediaurl ?? [];
  let mediaUrls = [];
  if (Array.isArray(rawMediaUrls)) {
    mediaUrls = rawMediaUrls.filter(Boolean);
  } else if (typeof rawMediaUrls === 'string') {
    try {
      const parsed = JSON.parse(rawMediaUrls);
      mediaUrls = Array.isArray(parsed) ? parsed.filter(Boolean) : [rawMediaUrls].filter(Boolean);
    } catch (error) {
      mediaUrls = [rawMediaUrls].filter(Boolean);
    }
  }

  const mediaUrl = article.mediaUrl ?? article.mediaurl ?? (mediaUrls.length ? mediaUrls[0] : '');
  const inferredMediaType = typeof mediaUrl === 'string' && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(mediaUrl)
    ? 'video'
    : (Array.isArray(article.mediaUrls) && article.mediaUrls.length && article.mediaUrls.some(item => typeof item === 'string' && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(item)))
      ? 'video'
      : 'photo';

  return {
    id: article.id ?? null,
    titre: article.titre ?? '',
    cat: article.cat ?? 'vie',
    statut: article.statut ?? 'publie',
    featured: Boolean(article.featured),
    resume: article.resume ?? '',
    contenu: article.contenu ?? '',
    emoji: article.emoji ?? '📰',
    date: article.date ?? '',
    mediaType: article.mediaType ?? article.mediatype ?? inferredMediaType ?? null,
    mediaUrl: mediaUrl || '',
    mediaUrls,
    mediaAlt: article.mediaAlt ?? article.mediaalt ?? '',
    created_at: article.created_at ?? null
  };
}

function getDriveClient() {
  const oauthClient = getOAuthClient('drive');
  if (oauthClient) {
    const tokenPath = path.resolve(GOOGLE_DRIVE_OAUTH_TOKEN_FILE);
    const source = GOOGLE_DRIVE_OAUTH_TOKEN_JSON || (fs.existsSync(tokenPath) ? fs.readFileSync(tokenPath, 'utf8') : '');
    if (source) {
      oauthClient.setCredentials(JSON.parse(source));
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

function getOAuthClient(account = 'gmail') {
  const filePath = path.resolve(GOOGLE_OAUTH_CLIENT_FILE);
  const source = account === 'drive'
    ? GOOGLE_DRIVE_OAUTH_CLIENT_JSON || (fs.existsSync(path.resolve(GOOGLE_DRIVE_OAUTH_CLIENT_FILE)) ? fs.readFileSync(path.resolve(GOOGLE_DRIVE_OAUTH_CLIENT_FILE), 'utf8') : '')
    : GOOGLE_GMAIL_OAUTH_CLIENT_JSON || (fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '');
  if (!source) return null;
  const config = JSON.parse(source);
  const credentials = config.installed || config.web || config;
  return new google.auth.OAuth2(credentials.client_id, credentials.client_secret, GOOGLE_OAUTH_REDIRECT_URI);
}

function getGmailClient() {
  const client = getOAuthClient('gmail');
  const tokenPath = path.resolve(GOOGLE_OAUTH_TOKEN_FILE);
  const source = GOOGLE_GMAIL_OAUTH_TOKEN_JSON || (fs.existsSync(tokenPath) ? fs.readFileSync(tokenPath, 'utf8') : '');
  if (!client || !source) return null;
  client.setCredentials(JSON.parse(source));
  return google.gmail({ version: 'v1', auth: client });
}

async function notifyByEmail(subject, text) {
  const gmail = getGmailClient();
  if (!gmail) return;
  const message = [
    `From: CABMY <${GOOGLE_GMAIL_USER}>`,
    `To: ${GOOGLE_GMAIL_USER}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    text
  ].join('\r\n');
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: Buffer.from(message).toString('base64url') }
  });
}

function parseDataUrl(value) {
  const match = typeof value === 'string' && value.match(/^data:([^;]+);base64,(.+)$/);
  return match ? { mimeType: match[1], buffer: Buffer.from(match[2], 'base64') } : null;
}

async function uploadMediaToStorage(value, index) {
  const parsed = parseDataUrl(value?.url || value);
  if (!parsed) return value;
  const client = getSupabaseClient();
  if (!client) {
    console.warn('⚠️ Supabase Storage non configuré; média gardé en base64');
    return value;
  }
  try {
    const extension = parsed.mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'bin';
    const filePath = `articles/${Date.now()}-${index}.${extension}`;
    const { error } = await client.storage.from('media').upload(filePath, parsed.buffer, {
      contentType: parsed.mimeType,
      upsert: false
    });
    if (error) {
      console.warn(`⚠️ Upload Storage échoué: ${error.message}; média gardé en base64`);
      return value;
    }
    return client.storage.from('media').getPublicUrl(filePath).data.publicUrl;
  } catch (err) {
    console.warn(`⚠️ Upload Storage exception: ${err.message}; média gardé en base64`);
    return value;
  }
}

async function uploadArticleMedia(payload) {
  const items = Array.isArray(payload.mediaurls) ? payload.mediaurls : [];
  if (!items.length) return payload;
  
  const uploadedItems = await Promise.all(items.map(async (item, index) => {
    if (!item) return null;
    
    const isDataUrl = typeof item === 'string' && item.startsWith('data:');
    if (isDataUrl) {
      console.warn(`⚠️ Item ${index}: Data URL détecté; ignoring to keep response small`);
      return null;
    }
    
    const parsed = parseDataUrl(item?.url || item);
    if (!parsed) {
      if (typeof item === 'string' && item.trim().length > 0) return item;
      return null;
    }
    
    const client = getSupabaseClient();
    if (!client) {
      console.warn(`⚠️ Item ${index}: Supabase Storage non configuré; ignoré`);
      return null;
    }
    
    try {
      const extension = parsed.mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'bin';
      const filePath = `articles/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
      const { error } = await client.storage.from('media').upload(filePath, parsed.buffer, {
        contentType: parsed.mimeType,
        upsert: false
      });
      if (error) throw error;
      return client.storage.from('media').getPublicUrl(filePath).data.publicUrl;
    } catch (err) {
      console.warn(`⚠️ Item ${index} upload failed: ${err.message}; ignoré`);
      return null;
    }
  }));
  
  const validItems = uploadedItems.filter(Boolean);
  return {
    ...payload,
    mediaurl: validItems.length === 1 ? validItems[0] : (validItems.length ? JSON.stringify(validItems) : ''),
    mediaurls: validItems
  };
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '*';
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    const allowedOrigin = getAllowedOrigin(origin);
    res.writeHead(200, {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  if (url.pathname === '/health') {
    sendJson(res, 200, { ok: true }, origin);
    return;
  }

  if (url.pathname === '/' || url.pathname === '/api') {
    sendJson(res, 200, {
      ok: true,
      service: 'cabmy-proxy',
      endpoints: ['/health', '/api/articles', '/auth/google']
    }, origin);
    return;
  }

  if (url.pathname === '/auth/google' || url.pathname === '/auth/google/drive' || url.pathname === '/auth/google/gmail') {
    try {
      const account = url.pathname.endsWith('/drive') ? 'drive' : 'gmail';
      const client = getOAuthClient(account);
      if (!client) throw new Error(`Déposez le fichier ${GOOGLE_OAUTH_CLIENT_FILE} dans le projet`);
      const scopes = account === 'drive'
        ? ['https://www.googleapis.com/auth/drive.file']
        : ['https://www.googleapis.com/auth/gmail.send'];
      res.writeHead(302, { Location: client.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: scopes, state: account }) });
      res.end();
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (url.pathname === '/oauth2callback') {
    try {
      const account = url.searchParams.get('state') === 'drive' ? 'drive' : 'gmail';
      const client = getOAuthClient(account);
      if (!client || !url.searchParams.get('code')) throw new Error('Autorisation Google incomplète');
      const { tokens } = await client.getToken(url.searchParams.get('code'));
      if (!process.env.GOOGLE_OAUTH_TOKEN_JSON) {
        fs.writeFileSync(path.resolve(account === 'drive' ? GOOGLE_DRIVE_OAUTH_TOKEN_FILE : GOOGLE_OAUTH_TOKEN_FILE), JSON.stringify(tokens, null, 2));
      }
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
        const { data, error } = await client.from('articles').select('id,titre,cat,statut,featured,resume,contenu,emoji,date,mediaType,mediaUrl,mediaUrls,mediaAlt,created_at').order('created_at', { ascending: false });
        if (error) throw error;
        sendJson(res, 200, (data || []).map(normalizeArticleRow));
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
          sendJson(res, 503, { error: 'Supabase non configuré sur Render' }, origin);
          return;
        }

        try {
          let { data, error } = await client.from('articles').insert(payload).select('id').single();
          if (error && /featured/i.test(error.message || '')) {
            const legacyPayload = { ...payload };
            delete legacyPayload.featured;
            ({ data, error } = await client.from('articles').insert(legacyPayload).select('id').single());
          }
          if (error) throw error;
          sendJson(res, 200, { id: data?.id || null });
        } catch (error) {
          sendJson(res, 500, { error: error.message || 'Enregistrement impossible' }, origin);
        }
      });
      return;
    }
  }

  const submissionMatch = url.pathname.match(/^\/api\/(messages|preinscriptions)$/);
  if (submissionMatch && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const input = JSON.parse(body || '{}');
        const tableName = submissionMatch[1];
        const buildFallbackPayload = () => tableName === 'messages'
          ? {
              nom: input.nom || '',
              email: input.email || 'sans-email@cabmy.cm',
              sujet: input.sujet || '',
              message: [input.message || '', input.telephone ? `Téléphone: ${input.telephone}` : ''].filter(Boolean).join('\n').trim()
            }
          : {
              nom: input.nom || '',
              prenom: input.prenom || '',
              email: input.email || 'sans-email@cabmy.cm',
              telephone: input.telephone || input.tel || '',
              classe: input.classe || input.niveau || input.section || '',
              statut: 'nouveau',
              notes: [input.section || '', input.notes || ''].filter(Boolean).join(' | ') || ''
            };

        const payload = buildFallbackPayload();
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase non configuré sur Render');

        let result;
        try {
          result = await client.from(tableName).insert(payload).select('id').single();
        } catch (insertError) {
          const fallbackPayload = tableName === 'messages'
            ? {
                nom: input.nom || '',
                email: input.email || 'sans-email@cabmy.cm',
                sujet: input.sujet || '',
                message: input.message || ''
              }
            : {
                nom: input.nom || '',
                email: input.email || 'sans-email@cabmy.cm',
                classe: input.classe || input.niveau || input.section || '',
                statut: 'nouveau',
                notes: [input.section || '', input.notes || ''].filter(Boolean).join(' | ') || ''
              };
          result = await client.from(tableName).insert(fallbackPayload).select('id').single();
        }

        const { data, error } = result;
        if (error) throw error;
        try {
          await notifyByEmail(`Nouveau ${tableName}`, JSON.stringify(payload, null, 2));
        } catch (emailError) {
          console.warn('Notification Gmail impossible:', emailError.message || emailError);
        }
        sendJson(res, 201, { ok: true, id: data?.id || null }, origin);
      } catch (error) {
        sendJson(res, 500, { error: error.message || 'Enregistrement impossible' }, origin);
      }
    });
    return;
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
        sendJson(res, 503, { error: 'Supabase non configuré sur Render' }, origin);
        return;
      }

      try {
        let { error } = await client.from('articles').update(payload).eq('id', id);
        if (error && /featured/i.test(error.message || '')) {
          const legacyPayload = { ...payload };
          delete legacyPayload.featured;
          ({ error } = await client.from('articles').update(legacyPayload).eq('id', id));
        }
        if (error) throw error;
        sendJson(res, 200, { id });
      } catch (error) {
        sendJson(res, 500, { error: error.message || 'Modification impossible' }, origin);
      }
    });
    return;
  }

  if (articleMatch && req.method === 'DELETE') {
    const id = articleMatch[1];
    const client = getSupabaseClient();
    if (!client) {
      sendJson(res, 503, { error: 'Supabase non configuré sur Render' }, origin);
      return;
    }

    try {
      const { error } = await client.from('articles').delete().eq('id', id);
      if (error) throw error;
      sendJson(res, 200, { ok: true });
    } catch (error) {
      sendJson(res, 500, { error: error.message || 'Suppression impossible' }, origin);
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Supabase proxy listening on http://localhost:${PORT}`);
});
