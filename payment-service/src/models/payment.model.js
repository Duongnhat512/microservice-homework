const pool = require('../config/pg.config');

const Payment = {
    createPayment: async (payment) => {
        const query = `INSERT INTO payments (user_id, amount, status, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *`;
        const values = [payment.user_id, payment.amount, payment.status];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    
}

module.exports = Payment;