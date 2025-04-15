const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Store payment transactions in memory (in production should use a database)
const transactions = [];

// Process payment
app.post('/api/payments', (req, res) => {
    const { orderId, amount } = req.body;
    
    const transaction = {
        id: Date.now().toString(),
        orderId,
        amount,
        status: 'completed',
        timestamp: new Date()
    };
    
    transactions.push(transaction);
    res.json(transaction);
});

// Get payment status
app.get('/api/payments/:orderId', (req, res) => {
    const { orderId } = req.params;
    const transaction = transactions.find(t => t.orderId === orderId);
    
    if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
});

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
}); 