import { useState } from 'react';
import { usePayment } from '@hooks/usePayment';
import { useAuth } from '@hooks/useAuth';
import { Check, X, CreditCard, Shield, Lock } from 'lucide-react';

const CheckoutForm = ({ plan, onClose }) => {
  const { initializePayment, isProcessing } = usePayment();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const planDetails = {
    monthly: {
      name: 'Premium Monthly',
      price: 199,
      duration: '1 month',
      features: [
        'Unlimited Resumes',
        'All Premium Templates',
        'Priority Support',
        'No Watermark',
        'Advanced Analytics',
      ],
    },
    yearly: {
      name: 'Premium Yearly',
      price: 1499,
      originalPrice: 2388,
      duration: '12 months',
      savings: 889,
      features: [
        'Everything in Monthly',
        'Save ₹889 (37% off)',
        '2 Months Free',
        'Career Coaching Session',
        'LinkedIn Profile Review',
      ],
    },
  };

  const currentPlan = planDetails[plan] || planDetails.monthly;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Initialize Razorpay payment
    await initializePayment(plan);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Plan Details */}
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 text-white p-8 rounded-l-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentPlan.name}</h2>
                <p className="text-primary-100">Upgrade your experience</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold">₹{currentPlan.price}</span>
                <span className="text-primary-100">/ {currentPlan.duration}</span>
              </div>
              
              {currentPlan.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-white/60 line-through text-lg">
                    ₹{currentPlan.originalPrice}
                  </span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save ₹{currentPlan.savings}
                  </span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-lg">What's included:</h3>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-1 mt-0.5">
                      <Check size={16} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Badges */}
            <div className="border-t border-white/20 pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield size={18} />
                <span>Secure payment with Razorpay</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock size={18} />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check size={18} />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Side - Checkout Form */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Purchase
              </h3>
              <p className="text-gray-600">
                Fill in your details to proceed with payment
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Required for payment verification
                </p>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => handleChange('terms', e.target.checked)}
                    className="mt-1 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary-600 hover:underline" target="_blank">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline" target="_blank">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{currentPlan.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-medium">₹{Math.round(currentPlan.price * 0.18)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-primary-600">
                    ₹{Math.round(currentPlan.price * 1.18)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary w-full btn-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="spinner w-5 h-5 border-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Proceed to Payment
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                You'll be redirected to Razorpay secure payment gateway
              </p>
            </form>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Accepted payment methods:</p>
              <div className="flex gap-3 flex-wrap">
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-medium">
                  💳 Credit Card
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-medium">
                  💳 Debit Card
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-medium">
                  🏦 Net Banking
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-medium">
                  📱 UPI
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-medium">
                  💰 Wallets
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;