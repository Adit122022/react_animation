const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Pricing plans
const PLANS = {
    monthly: {
        amount: 19900, // ₹199 in paise
        duration: 30 // days
    },
    yearly: {
        amount: 149900, // ₹1499 in paise
        duration: 365 // days
    }
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { plan } = req.body; // 'monthly' or 'yearly'

        if (!PLANS[plan]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan selected'
            });
        }

        const options = {
            amount: PLANS[plan].amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: req.user.id,
                plan: plan
            }
        };

        const order = await razorpay.orders.create(options);

        // Create payment record
        await Payment.create({
            user: req.user.id,
            razorpayOrderId: order.id,
            amount: PLANS[plan].amount / 100,
            plan: plan,
            subscriptionDuration: PLANS[plan].duration,
            status: 'pending'
        });

        res.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Update payment record
        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.status = 'success';
        await payment.save();

        // Update user subscription
        const user = await User.findById(req.user.id);
        user.subscription = 'premium';
        
        // Calculate expiry date
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + payment.subscriptionDuration);
        user.subscriptionExpiry = expiryDate;
        
        await user.save();

        res.json({
            success: true,
            message: 'Payment verified successfully',
            subscription: {
                type: 'premium',
                expiryDate: expiryDate
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get payment history
// @route   GET /api/payment/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        next(error);
    }
};