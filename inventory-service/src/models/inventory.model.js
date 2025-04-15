const pool = require('../config/pg.config');

const Inventory = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM products');
            return result.rows;
        } catch (error) {
            console.error('Error fetching inventory:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error;
        }
    },

    create: async (product) => {
        try {
            const result = await pool.query(
                'INSERT INTO products (name, price, quantity) VALUES ($1, $2, $3) RETURNING *',
                [product.name, product.price, product.quantity]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    update: async (id, product) => {
        try {
            const result = await pool.query(
                'UPDATE products SET name = $1, price = $2, quantity = $3 WHERE id = $4 RETURNING *',
                [product.name, product.price, product.quantity, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    updateQuantity: async (id, quantity) => {
        try {
            const result = await pool.query(
                'UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *',
                [quantity, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error updating product quantity:', error);
            throw error;
        }
    }
}

module.exports = Inventory;