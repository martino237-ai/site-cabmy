#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const fs = require('fs');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cqoyhtmowyzvpjdzypgs.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local');
  process.exit(1);
}

async function runSQL(sqlContent) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(SUPABASE_URL);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ SQL exécuté avec succès !');
          resolve(true);
        } else {
          console.error('❌ Erreur:', data);
          reject(new Error(data));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ query: sqlContent }));
    req.end();
  });
}

async function setupDatabase() {
  try {
    console.log('📂 Lecture du fichier SQL...');
    const sqlContent = fs.readFileSync('./supabase-schema.sql', 'utf-8');
    
    console.log('🚀 Exécution du schéma sur Supabase...');
    await runSQL(sqlContent);
    
    console.log(`
╔════════════════════════════════════╗
║   ✅ DATABASE SETUP COMPLETE        ║
╚════════════════════════════════════╝

Tables créées :
  📰 articles (actualités)
  💬 messages (contact)
  📝 preinscriptions (inscriptions)

RLS activé avec politiques sécurisées ✅
    `);
  } catch (err) {
    console.error('Erreur setup:', err.message);
    
    // Fallback : montrer les étapes manuelles
    console.log(`
⚠️ Impossible d'exécuter le SQL automatiquement.

📌 INSTALLATION MANUELLE :

1. Allez sur : https://dkhgaehodxugrwpdvbuk.supabase.co/projects
2. Ouvrez l'SQL Editor
3. Créez une nouvelle requête
4. Copiez-collez le contenu de : supabase-schema.sql
5. Cliquez "Run" (⌨️ Ctrl+Enter)

Attendez que les tables soient créées ✅
    `);
    
    process.exit(1);
  }
}

setupDatabase();
