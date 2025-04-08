const pool = require('../config/pg.config');

const Controller = {}

Controller.get = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM customers');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

Controller.getOne = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

Controller.post = async (req, res) => {
    const { name, address, phone } = req.body;
    if (!name || !address || !phone) {
        return res.status(400).json({ error: 'Name, address, and phone are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO customers (name, address, phone) VALUES ($1, $2, $3) RETURNING *',
            [name, address, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

Controller.put = async (req, res) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    if (!name || !address || !phone) {
        return res.status(400).json({ error: 'Name, address, and phone are required' });
    }
    try {
        const result = await pool.query(
            'UPDATE customers SET name = $1, address = $2, phone = $3 WHERE id = $4 RETURNING *',
            [name, address, phone, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

Controller.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = Controller;