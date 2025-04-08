const router = require('express').Router();

const controller = require('../controllers/customer.controller');

router.get('/', controller.get);
router.get('/:id', controller.getOne);
router.post('/', controller.post);
router.post('/update/:id', controller.put);
router.post('/delete/:id', controller.delete);

module.exports = router;