require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8888;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API Gateway is running!');
});

app.use('/inventory', createProxyMiddleware({ 
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: { '^/inventory': '/' }
}));

app.use('/payment', createProxyMiddleware({ 
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/payment': '/' }
}));

app.use('/shipping', createProxyMiddleware({ 
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/shipping': '/' }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});