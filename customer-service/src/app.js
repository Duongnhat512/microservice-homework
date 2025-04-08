const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/v1/customers', require('./routes/customer.route'));

 module.exports = app;