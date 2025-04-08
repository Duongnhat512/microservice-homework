const pool = require('../config/pg.config');

const Controller = {}

Controller.get = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM orders');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

Controller.getOne = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

Controller.post = async (req, res) => {
    const { customer_id, product_id, quantity, total_price, status } = req.body;
    try {
        const { rows } = await pool.query('INSERT INTO orders (customer_id, product_id, quantity, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [customer_id, product_id, quantity, total_price, status]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

Controller.put = async (req, res) => {
    const { id } = req.params;
    const { customer_id, product_id, quantity, total_price, status } = req.body;
    try {
        const { rows } = await pool.query('UPDATE orders SET customer_id = $1, product_id = $2, quantity = $3, total_price = $4, status = $5 WHERE id = $6 RETURNING *', [customer_id, product_id, quantity, total_price, status, id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

Controller.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = Controller;