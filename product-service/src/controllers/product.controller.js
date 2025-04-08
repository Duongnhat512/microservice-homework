const pool = require('../config/pg.config');

const Controller = {}

Controller.get = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

Controller.getOne = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

Controller.post = async (req, res) => {
    const { name, price, description, stock } = req.body;
    if (!name || !price || !stock) {
        return res.status(400).json({ error: 'Name, price, and stock are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO products (name, price, description, stock) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, price, description, stock]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

Controller.put = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const { name, price, description, stock } = req.body;
    if (!name || !price || !stock) {
        return res.status(400).json({ error: 'Name, price, and stock are required' });
    }
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, price = $2, description = $3, stock = $4 WHERE id = $5 RETURNING *',
            [name, price, description, stock, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
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
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = Controller;