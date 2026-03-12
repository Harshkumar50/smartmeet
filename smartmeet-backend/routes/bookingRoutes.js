const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/create', bookingController.create);
router.get('/', auth, bookingController.list);
router.get('/event/:eventId', bookingController.byEvent);
router.patch('/:id/cancel', auth, bookingController.cancel);

module.exports = router;
