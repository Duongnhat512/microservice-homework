const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Payment Service is running!');
});

app.use('/api/product', require('./routes/payment.route'));

module.exports = app;