import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../../store/slices/uiSlices';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.ui);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.show, dispatch]);

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />,
    warning: <AlertCircle className="text-yellow-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="fixed top-10 right-4 z-99 animate-slide-up">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border ${bgColors[toast.type]} shadow-lg max-w-md`}>
        {icons[toast.type]}
        <p className="flex-1 text-gray-800 font-medium">{toast.message}</p>
        <button
          onClick={() => dispatch(hideToast())}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toast;