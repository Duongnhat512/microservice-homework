const express = require('express');

const app = express();

app.use(express.json());

app.use('/orders', require('./routes/order.route'));

module.exports = app;