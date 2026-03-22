import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, User, LogOut, LayoutDashboard, CreditCard } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, isPremium } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-gradient">ResumeForge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/templates" className="text-gray-700 hover:text-primary-600 transition">
              Templates
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-primary-600 transition">
              Pricing
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-primary-600" />
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  {isPremium && (
                    <span className="badge badge-warning text-xs">PRO</span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </Link>

                    {!isPremium && (
                      <Link
                        to="/pricing"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <CreditCard size={18} />
                        <span>Upgrade to Pro</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition w-full text-left"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/templates"
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary-600 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 transition text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;