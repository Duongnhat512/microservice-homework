const express = require('express');

const app = express();

app.use(express.json());

app.use('/customers', require('./routes/customer.route'));

app.get('/', (req, res) => {
  res.send('Welcome to the Customer API!');
});


 module.exports = app;
