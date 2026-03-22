import { Check, Zap } from 'lucide-react';
import { usePayment } from '@hooks/usePayment';
import { useAuth } from '@hooks/useAuth';

const PricingPlans = () => {
  const { initializePayment, isProcessing } = usePayment();
  const { isPremium } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      features: [
        '1 Resume',
        'Basic Templates',
        'PDF Download',
        'Email Support',
      ],
      limitations: [
        'No premium templates',
        'No unlimited resumes',
        'Ads included',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Premium',
      price: '₹199',
      period: 'month',
      features: [
        'Unlimited Resumes',
        'All Premium Templates',
        'No Watermark',
        'Priority Support',
        'Advanced Analytics',
        'Custom Branding',
        'ATS Optimization',
      ],
      cta: 'Upgrade Now',
      popular: true,
      planType: 'monthly',
    },
    {
      name: 'Premium Yearly',
      price: '₹1,499',
      period: 'year',
      originalPrice: '₹2,388',
      discount: 'Save 37%',
      features: [
        'Everything in Premium',
        '2 Months Free',
        'Career Coaching Session',
        'LinkedIn Profile Review',
      ],
      cta: 'Best Value',
      popular: false,
      planType: 'yearly',
    },
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="section-title">Choose Your Plan</h2>
        <p className="section-subtitle">
          Start free, upgrade when you need more power
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`card ${plan.popular ? 'ring-2 ring-primary-600 relative' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Zap size={16} />
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-gradient">
                  {plan.price}
                </span>
                <span className="text-gray-500">/ {plan.period}</span>
              </div>
              
              {plan.originalPrice && (
                <div className="mt-2">
                  <span className="text-gray-400 line-through text-sm">
                    {plan.originalPrice}
                  </span>
                  <span className="ml-2 badge badge-success text-xs">
                    {plan.discount}
                  </span>
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
              
              {plan.limitations?.map((limitation, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-400">
                  <X className="flex-shrink-0 mt-0.5" size={18} />
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => plan.planType && initializePayment(plan.planType)}
              disabled={isProcessing || (plan.name === 'Free' && !isPremium)}
              className={`w-full btn ${
                plan.popular
                  ? 'btn-primary'
                  : plan.name === 'Free'
                  ? 'btn-secondary cursor-not-allowed'
                  : 'btn-outline'
              }`}
            >
              {isProcessing ? 'Processing...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Money Back Guarantee */}
      <div className="text-center mt-12 text-gray-600">
        <p className="font-medium">30-Day Money Back Guarantee</p>
        <p className="text-sm mt-1">No questions asked. Cancel anytime.</p>
      </div>
    </div>
  );
};

export default PricingPlans;