const express = require('express');

const app = express();

app.use(express.json());

app.use('/customers', require('./routes/customer.route'));

 module.exports = app;