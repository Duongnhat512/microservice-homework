const router = require('express').Router();
const InventoryController = require('../controllers/inventory.controller');

router.get('/', InventoryController.getAll);
router.get('/:id', InventoryController.getById);
router.post('/', InventoryController.create);
router.put('/:id', InventoryController.update);
router.delete('/:id', InventoryController.delete);
router.put("/:id/quantity", InventoryController.updateQuantity);

module.exports = router