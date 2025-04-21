import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 10 }));

app.get('/status', (req, res) => {
  res.json({ status: 'Đã cập nhật kho' });
});

app.listen(3003, () => {
  console.log('Inventory Service chạy ở cổng 3003');
});