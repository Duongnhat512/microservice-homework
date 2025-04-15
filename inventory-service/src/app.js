const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.send('Inventory Service is running!');
});

app.use('/api/product', require('./routes/inventory.route'));



module.exports = app;