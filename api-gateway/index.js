import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Đảm bảo thêm pathRewrite để giữ đúng đường dẫn phía sau
app.use('/order', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}));

app.use('/payment', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/payment': '' }  // <-- Cực kỳ quan trọng
}));

app.use('/shipping', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: { '^/shipping': '' }
}));
app.use('/inventory', createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: { '^/inventory': '' }
}));

app.listen(3000, () => {
  console.log('✅ API Gateway running on port 3000');
});
