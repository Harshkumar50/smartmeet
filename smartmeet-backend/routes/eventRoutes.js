const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.post('/create', auth, eventController.create);
router.get('/', auth, eventController.list);
router.get('/:id', eventController.get);
router.delete('/:id', auth, eventController.remove);

module.exports = router;
