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

  if (path.startsWith('/okx')) {
    target = 'https://web3.okx.com' + path.replace('/okx', '');
  } else if (path.startsWith('/jup')) {
    target = 'https://api.jup.ag' + path.replace('/jup', '');
  } else if (path.startsWith('/quote')) {
    target = 'https://quote-api.jup.ag' + path.replace('/quote', '');
  } else if (path.startsWith('/goplus')) {
    target = 'https://api.gopluslabs.io' + path.replace('/goplus', '');
  } else if (path.startsWith('/defi')) {           // <— BARU
    target = 'https://api.de.fi' + path.replace('/defi', '');
  } else {
    return res.send('relay ok');
  }

  try {
    const r = await fetch(target, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const body = await r.text();
    res.status(r.status).send(body);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = app;