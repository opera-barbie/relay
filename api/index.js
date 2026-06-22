const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json()); // penting
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.all('*', async (req, res) => {
  const path = req.originalUrl;
  let target = '';

  if (path.startsWith('/okx')) {
    target = 'https://web3.okx.com' + path.replace('/okx', '');
  } else if (path.startsWith('/jup')) {
    target = 'https://api.jup.ag' + path.replace('/jup', '');
  } else if (path.startsWith('/quote')) {
    target = 'https://quote-api.jup.ag' + path.replace('/quote', '');
  } else if (path.startsWith('/goplus')) {
    target = 'https://api.gopluslabs.io' + path.replace('/goplus', '');
  } else if (path.startsWith('/proxy')) {
    target = req.query.url;
    if (!target) return res.status(400).send('missing ?url=');
  } else {
    return res.send('relay ok');
  }

  try {
    // teruskan SEMUA header dari client kecuali host
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['content-length'];

    const r = await fetch(target, {
      method: req.method,
      headers,
      body: ['POST','PUT','PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });
    const body = await r.text();
    res.status(r.status).set('content-type', r.headers.get('content-type') || 'application/json').send(body);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = app;
