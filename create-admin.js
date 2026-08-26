#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dkhgaehodxugrwpdvbuk.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local');
  process.exit(1);
}

async function createAdmin() {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(`${SUPABASE_URL}/auth/v1/admin/users`);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: '/auth/v1/admin/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    };

    const payload = {
      email: 'admin@cabmy.fr',
      password: 'cabmy2011',
      user_metadata: {
        role: 'admin',
        name: 'admin'
      },
      email_confirm: true
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Compte admin créé avec succès !');
          console.log('📧 Email: admin@cabmy.fr');
          console.log('🔑 Mot de passe: cabmy2011');
          const user = JSON.parse(data);
          console.log('👤 User ID:', user.id);
          resolve(user);
        } else {
          console.error(`❌ Erreur ${res.statusCode}:`);
          console.error(data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

createAdmin().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});
