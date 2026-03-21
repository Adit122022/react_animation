const express = require('express');
const {
    createOrder,
    verifyPayment,
    getPaymentHistory
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

module.exports = router;