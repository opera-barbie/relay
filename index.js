const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use('/', async (req, res) => {
  let target;
  const path = req.originalUrl;

  if (path.startsWith('/okx')) {
    // OKX DEX API baru 2026
    target = 'https://web3.okx.com' + path.replace('/okx','');
  } else if (path.startsWith('/jup')) {
    target = 'https://price.jup.ag' + path.replace('/jup','');
  } else if (path.startsWith('/quote')) {
    target = 'https://quote-api.jup.ag' + path.replace('/quote','');
  } else {
    return res.status(200).send('OKX+Jupiter relay active');
  }

  try {
    const r = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Referer': 'https://web3.okx.com'
      }
    });
    res.set('Access-Control-Allow-Origin', '*');
    res.status(r.status).send(await r.text());
  } catch(e) {
    res.status(500).send(e.message);
  }
});

module.exports = app;
