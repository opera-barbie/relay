const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.all('*', async (req, res) => {
  const path = req.originalUrl;
  let target = '';

  // --- route statis yang sudah ada ---
  if (path.startsWith('/okx')) {
    target = 'https://web3.okx.com' + path.replace('/okx', '');
  } else if (path.startsWith('/jup')) {
    target = 'https://api.jup.ag' + path.replace('/jup', '');
  } else if (path.startsWith('/quote')) {
    target = 'https://quote-api.jup.ag' + path.replace('/quote', '');
  } else if (path.startsWith('/goplus')) {
    target = 'https://api.gopluslabs.io' + path.replace('/goplus', '');
  // --- BARU: proxy universal ---
  } else if (path.startsWith('/proxy')) {
    const url = new URL('http://dummy' + path);
    target = url.searchParams.get('url');
    if (!target) return res.status(400).send('missing ?url=');
    // decode
    target = decodeURIComponent(target);
  } else {
    return res.send('relay ok');
  }

  try {
    const r = await fetch(target, {
      method: req.method,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' },
      body: ['POST','PUT','PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });
    const body = await r.text();
    res.status(r.status).send(body);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = app;
