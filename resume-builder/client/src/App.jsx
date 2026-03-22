import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Templates from './pages/Templates';
import MyResumes from './pages/MyResumes';
import Pricing from './pages/Pricing';
import PaymentSuccess from './components/payment/PaymentSuccess';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout wrapper
const Layout = ({ children, showFooter = true }) => {
  const { pathname } = useLocation();
  const hideHeaderFooter = pathname.startsWith('/editor');

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">{children}</main>
      {!hideHeaderFooter && showFooter && <Footer />}
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Check auth status on app load
  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [token, dispatch]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Toast />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout showFooter={false}>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout showFooter={false}>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/templates"
          element={
            <Layout>
              <Templates />
            </Layout>
          }
        />

        <Route
          path="/pricing"
          element={
            <Layout>
              <Pricing />
            </Layout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-resumes"
          element={
            <ProtectedRoute>
              <Layout>
                <MyResumes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-9xl font-bold text-gray-200">404</h1>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                  <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <a
                    href="/"
                    className="btn btn-primary btn-lg"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;