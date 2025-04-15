const InventoryModel = require('../models/inventory.model');
const faultTolerance = require('../utils/fault-tolerance');

const InventoryController = {
  getAll: async (req, res) => {
    try {
      // Sử dụng circuit breaker
      const breaker = faultTolerance.createCircuitBreaker(async () => {
        return await InventoryModel.getAll();
      });
      
      const products = await breaker.fire();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to retrieve products' });
    }
  },
  
  getById: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Sử dụng retry mechanism
      const product = await faultTolerance.withRetry(async () => {
        const result = await InventoryModel.getById(id);
        if (!result) {
          const error = new Error('Product not found');
          error.status = 404;
          throw error;
        }
        return result;
      });
      
      res.status(200).json(product);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Failed to retrieve product' });
    }
  },
  
  create: async (req, res) => {
    try {
      // Sử dụng time limiter
      const product = await faultTolerance.withTimeLimit(
        async () => await InventoryModel.create(req.body),
        3000 // 3 seconds timeout
      );
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  },
  
  update: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Kết hợp circuit breaker và retry
      const breaker = faultTolerance.createCircuitBreaker(async () => {
        return await faultTolerance.withRetry(async () => {
          const updated = await InventoryModel.update(id, req.body);
          if (!updated) {
            const error = new Error('Product not found');
            error.status = 404;
            throw error;
          }
          return updated;
        });
      });
      
      const product = await breaker.fire();
      res.status(200).json(product);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Failed to update product' });
    }
  },
  
  delete: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Kết hợp rate limiter và circuit breaker
      const rateLimiter = faultTolerance.createRateLimiter(5, 10); // 5 requests per 10 seconds
      
      const success = await rateLimiter(async () => {
        const breaker = faultTolerance.createCircuitBreaker(async () => {
          return await InventoryModel.delete(id);
        });
        return await breaker.fire();
      });
      
      if (!success) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.message === 'Rate limit exceeded') {
        return res.status(429).json({ message: 'Too many requests, please try again later' });
      }
      res.status(500).json({ message: 'Failed to delete product' });
    }
  },
  
  updateQuantity: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    
    try {
      // Sử dụng circuit breaker
      const breaker = faultTolerance.createCircuitBreaker(async () => {
        return await InventoryModel.updateQuantity(id, quantity);
      });
      
      const product = await breaker.fire();
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Error updating product quantity:', error);
      res.status(500).json({ message: 'Failed to update product quantity' });
    }
  }
};

module.exports = InventoryController;