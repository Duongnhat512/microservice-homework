import express from 'express';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import CircuitBreaker from 'opossum';
import axiosRetry from 'axios-retry';

const app = express();
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Retry config
axiosRetry(axios, {
  retries: 3,
  retryDelay: retryCount => retryCount * 5000, // 5s mỗi lần retry
  retryCondition: error => error.response?.status >= 500 || error.code === 'ECONNREFUSED'
});

// Timeout wrapper
function timeoutPromise(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout!')), ms));
}

// Circuit Breakers
const paymentBreaker = new CircuitBreaker(() => axios.get('http://localhost:3002/status'), {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});
const inventoryBreaker = new CircuitBreaker(() => axios.get('http://localhost:3003/status'), {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});
const shippingBreaker = new CircuitBreaker(() => axios.get('http://localhost:3004/status'), {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});

axios.interceptors.response.use(undefined, function (err) {
  if (err.config && err.config['axios-retry']) {
    const { retryCount } = err.config['axios-retry'];
    if (retryCount) {
      console.log(`Retry lần thứ ${retryCount} cho request: ${err.config.url}`);
    }
  }
  return Promise.reject(err);
});

shippingBreaker.on('open', () => console.log('Circuit breaker OPEN'));
shippingBreaker.on('halfOpen', () => console.log('Circuit breaker HALF-OPEN'));
shippingBreaker.on('close', () => console.log('Circuit breaker CLOSE'));

app.get('/test-circuit', async (req, res) => {
  try {
    const result = await shippingBreaker.fire();
    res.json({ data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/order', async (req, res) => {
  try {
    const paymentResult = await Promise.race([
      paymentBreaker.fire(),
      timeoutPromise(20000)
    ]);

    const inventoryResult = await Promise.race([
      inventoryBreaker.fire(),
      timeoutPromise(20000)
    ]);

    const shippingResult = await Promise.race([
      shippingBreaker.fire(),
      timeoutPromise(20000)
    ]);

    res.status(201).json({
      message: 'Đơn hàng đã được tạo!',
      payment: paymentResult.data,
      inventory: inventoryResult.data,
      shipping: shippingResult.data
    });
  } catch (err) {
    res.status(500).json({ error: 'Tạo đơn hàng thất bại', detail: err.message });
  }
});

app.get('/test-retry', async (req, res) => {
  try {
    await axios.get('http://localhost:3004/status');
    res.send('OK');
  } catch (err) {
    res.status(500).send('Error');
  }
});

app.listen(3001, () => {
  console.log('Order Service chạy ở cổng 3001');
});
