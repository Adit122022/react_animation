import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>

          <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
          
          <p className="text-gray-600 mb-8">
            Welcome to Premium! You now have access to all features.
          </p>

          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold mb-3">What's Next?</h2>
            <ul className="text-left space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Create unlimited resumes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Access all premium templates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Download without watermark
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Priority support
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary w-full btn-lg"
            >
              Go to Dashboard
              <ArrowRight size={20} />
            </button>
            
            <button
              onClick={() => navigate('/templates')}
              className="btn btn-outline w-full"
            >
              Browse Templates
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Receipt has been sent to your email
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;