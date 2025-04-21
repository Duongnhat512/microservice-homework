// shipping-service/index.js
import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests to Shipping Service'
}));

let shippingStatus = 'PENDING';

app.post('/ship', (req, res) => {
  shippingStatus = 'SHIPPING';
  setTimeout(() => {
    shippingStatus = 'DELIVERED';
  }, 5000);
  res.json({ message: 'Shipping started', status: shippingStatus });
});

app.get('/status', (req, res) => {
  res.json({ status: shippingStatus });
});

app.listen(3004, () => {
  console.log('✅ Shipping Service running on port 3004');
});
