import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Check, X, Zap, Star, HelpCircle } from 'lucide-react';
import CheckoutForm from '@components/payment/CheckoutForm';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out ResumeForge',
      features: [
        { text: '1 Resume', included: true },
        { text: 'Basic Templates (2)', included: true },
        { text: 'PDF Download', included: true },
        { text: 'Email Support', included: true },
        { text: 'Premium Templates', included: false },
        { text: 'Unlimited Resumes', included: false },
        { text: 'No Watermark', included: false },
        { text: 'Priority Support', included: false },
        { text: 'Analytics Dashboard', included: false },
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Premium',
      price: { monthly: 199, yearly: 1499 },
      originalPrice: { monthly: null, yearly: 2388 },
      description: 'Best for active job seekers',
      features: [
        { text: 'Unlimited Resumes', included: true },
        { text: 'All Premium Templates', included: true },
        { text: 'PDF & Word Download', included: true },
        { text: 'No Watermark', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Analytics Dashboard', included: true },
        { text: 'ATS Optimization', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'Export to LinkedIn', included: true },
      ],
      cta: 'Upgrade Now',
      popular: true,
      badge: 'Most Popular',
    },
    {
      name: 'Enterprise',
      price: { monthly: 'Custom', yearly: 'Custom' },
      description: 'For teams and organizations',
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Team Management', included: true },
        { text: 'API Access', included: true },
        { text: 'Custom Templates', included: true },
        { text: 'Dedicated Support', included: true },
        { text: 'SSO Integration', included: true },
        { text: 'Analytics & Reports', included: true },
        { text: 'SLA Guarantee', included: true },
        { text: 'Custom Integrations', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and popular wallets like PayTM and PhonePe through Razorpay.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely! We use Razorpay for payment processing, which is PCI DSS compliant. We never store your card details on our servers.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied with Premium, contact us for a full refund.',
    },
    {
      question: 'Can I upgrade from Free to Premium later?',
      answer: 'Of course! You can upgrade to Premium at any time and all your existing resumes will be preserved.',
    },
  ];

  const handleSelectPlan = (planType) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (planType === 'Free' || planType === 'Enterprise') {
      return;
    }

    setSelectedPlan(billingCycle);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            <Zap size={16} />
            Simple, Transparent Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more power. All plans include a 30-day money-back guarantee.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                billingCycle === 'yearly' ? 'left-9' : 'left-1'
              }`}
            ></div>
          </button>
          <span className={`font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="badge badge-success">Save 37%</span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card relative ${
                plan.popular
                  ? 'ring-2 ring-primary-600 shadow-xl scale-105 z-10'
                  : 'shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6 pt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>

                <div className="mt-6">
                  {typeof plan.price[billingCycle] === 'number' ? (
                    <>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold text-gray-900">
                          ₹{plan.price[billingCycle]}
                        </span>
                        {plan.price[billingCycle] > 0 && (
                          <span className="text-gray-500">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        )}
                      </div>
                      
                      {plan.originalPrice?.[billingCycle] && (
                        <div className="mt-1">
                          <span className="text-gray-400 line-through text-lg">
                            ₹{plan.originalPrice[billingCycle]}
                          </span>
                          <span className="ml-2 text-green-600 text-sm font-medium">
                            Save ₹{plan.originalPrice[billingCycle] - plan.price[billingCycle]}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price[billingCycle]}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-green-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X size={12} className="text-gray-400" />
                      </div>
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.name)}
                disabled={isPremium && plan.name === 'Premium'}
                className={`w-full btn btn-lg ${
                  plan.popular
                    ? 'btn-primary'
                    : plan.name === 'Free'
                    ? 'btn-secondary cursor-not-allowed'
                    : 'btn-outline'
                } ${isPremium && plan.name === 'Premium' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPremium && plan.name === 'Premium' ? 'Current Plan' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Trusted by 20,000+ professionals</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <span className="text-2xl font-bold text-gray-400">Google</span>
            <span className="text-2xl font-bold text-gray-400">Microsoft</span>
            <span className="text-2xl font-bold text-gray-400">Amazon</span>
            <span className="text-2xl font-bold text-gray-400">Flipkart</span>
            <span className="text-2xl font-bold text-gray-400">TCS</span>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="card group"
              >
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900">
                  <span className="flex items-center gap-3">
                    <HelpCircle size={20} className="text-primary-600" />
                    {faq.question}
                  </span>
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 pl-8">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 card gradient-bg text-white text-center py-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join 20,000+ professionals who trust ResumeForge for their career growth
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
          >
            Get Started for Free
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutForm
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};

export default Pricing;