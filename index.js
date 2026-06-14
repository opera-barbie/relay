const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use('/', async (req, res) => {
  let target;
  
  // route untuk OKX
  if (req.originalUrl.startsWith('/okx')) {
    target = 'https://web3.okx.com' + req.originalUrl.replace('/okx','');
  } 
  // route untuk Jupiter
  else if (req.originalUrl.startsWith('/jup')) {
    target = 'https://price.jup.ag' + req.originalUrl.replace('/jup','');
  }
  // route untuk Jupiter quote
  else if (req.originalUrl.startsWith('/quote')) {
    target = 'https://quote-api.jup.ag' + req.originalUrl.replace('/quote','');
  }
  else {
    return res.status(404).send('Use /okx or /jup or /quote');
  }

  try {
    const r = await fetch(target, { headers: { 'User-Agent': 'Meridian/1.0' }});
    res.set('Access-Control-Allow-Origin', '*');
    res.status(r.status).send(await r.text());
  } catch(e) {
    res.status(500).send(e.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Relay OKX+Jupiter running'));