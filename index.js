const express = require('express');
const request = require('request');
const config = require('./config');

const app = express();

app.get('/', (req, res) => {
  const url = 'https://bittrex.com/api/v1.1/public/getmarkets';

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const markets = JSON.parse(body)['result'];
      const buffer = [];
      markets.forEach(market => {
        const marketCurrency = market['MarketCurrency'];
        const baseCurrency = market['BaseCurrency'];

        if (baseCurrency == 'BTC') {
          buffer.push(`BITTREX:${marketCurrency}${baseCurrency}`);
        }
      });
      res.setHeader('Content-disposition', 'attachment; filename=bittrex.txt');
      res.send(buffer.join(','));
    } else {
      res.send('Error');
    }
  });
});

app.listen(config.port, function listenHandler() {
  console.info(`Running on ${config.port}`);
});
