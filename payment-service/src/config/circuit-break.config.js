const circuitBreaker = require('opossum');
const pool = require('../config/pg.config'); 

const breaker = new circuitBreaker(
  async function processPayment(paymentData) {
    try {
      await pool.query('BEGIN');
      // Process payment logic here
      const result = await pool.query(
        'INSERT INTO payments(order_id, amount, status, payment_method) VALUES($1, $2, $3, $4) RETURNING *',
        [paymentData.orderId, paymentData.amount, 'completed', paymentData.paymentMethod]
      );
      await pool.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await pool.query('ROLLBACK');
      throw e;
    } finally {
      pool.release();
    }
  },
  {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
  }
);

module.exports = breaker;