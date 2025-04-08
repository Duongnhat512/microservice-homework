const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/v1/products', require('./routes/product.route'));

app.get('/', (req, res) => {
  res.send('Product Service is running');
});

module.exports = app;