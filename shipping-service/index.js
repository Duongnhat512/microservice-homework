const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Store shipments in memory (in production should use a database)
const shipments = new Map();

// Create shipment
app.post('/api/shipments', (req, res) => {
    const { orderId, address } = req.body;
    
    const shipment = {
        id: Date.now().toString(),
        orderId,
        address,
        status: 'pending',
        createdAt: new Date()
    };
    
    shipments.set(shipment.id, shipment);
    res.json(shipment);
});

// Get shipment status
app.get('/api/shipments/:orderId', (req, res) => {
    const { orderId } = req.params;
    
    const shipment = Array.from(shipments.values()).find(s => s.orderId === orderId);
    if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
    }
    
    res.json(shipment);
});

// Update shipment status
app.put('/api/shipments/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!shipments.has(id)) {
        return res.status(404).json({ message: 'Shipment not found' });
    }
    
    const shipment = shipments.get(id);
    shipment.status = status;
    shipments.set(id, shipment);
    
    res.json(shipment);
});

app.listen(PORT, () => {
    console.log(`Shipping Service running on port ${PORT}`);
}); 