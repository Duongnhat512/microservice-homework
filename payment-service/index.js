import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

// Rate limiter
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many payment requests'
}));

let paymentStatus = 'UNPAID';

app.post('/pay', (req, res) => {
  const { orderId } = req.body;
  paymentStatus = 'PAID';
  res.json({ orderId, status: paymentStatus });
});

app.get('/status', (req, res) => {
  res.json({ status: paymentStatus });
});

app.listen(3002, () => console.log('💳 Payment Service chạy ở cổng 3002'));
