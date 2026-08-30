#!/usr/bin/env node
/*
  start.js - Serveur léger pour développement CABMY
  Lance le site directement sans proxy backend
*/

require('dotenv').config({ path: '.env.local' });
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT = __dirname;

// Types MIME
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
  
  // Sécurité : empêcher les accès en dehors de ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Accès refusé');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Fichier non trouvé, servir 404.html
      const notFoundPath = path.join(ROOT, '404.html');
      fs.readFile(notFoundPath, (err, data) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(err ? '404 Not Found' : data);
      });
      return;
    }

    if (stats.isDirectory()) {
      // Rediriger vers index.html
      filePath = path.join(filePath, 'index.html');
      fs.readFile(filePath, (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(err ? '404' : data);
      });
      return;
    }

    // Servir le fichier
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erreur serveur');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║   🎓 CABMY — Serveur développement ║
╚════════════════════════════════════╝

🌐 http://localhost:${PORT}
📱 Admin: http://localhost:${PORT}/src/pages/admin.html

👤 Connexion Supabase:
   Email: admin@cabmy.fr
   Mot de passe: cabmy2011

Appuyez sur Ctrl+C pour arrêter
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} déjà utilisé`);
  } else {
    console.error('Erreur serveur:', err);
  }
  process.exit(1);
});
