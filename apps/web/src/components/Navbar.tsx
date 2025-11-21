import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Leaf } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { useState } from 'react';

export const Navbar = () => {
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="border-b sticky top-0 bg-white/95 backdrop-blur-md z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-sage-600 to-sage-700 p-2 rounded-lg group-hover:shadow-glow transition-all">
              <Leaf className="text-white" size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-sage-900">VigorAyurveda</div>
              <div className="text-xs text-sage-600 -mt-1">Natural Wellness</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/shop"
              className="text-gray-700 hover:text-sage-600 font-medium transition-colors relative group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage-600 group-hover:w-full transition-all"></span>
            </Link>
            <Link
              to="/learn"
              className="text-gray-700 hover:text-sage-600 font-medium transition-colors relative group"
            >
              Learn
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage-600 group-hover:w-full transition-all"></span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-sage-600 font-medium transition-colors relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage-600 group-hover:w-full transition-all"></span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative hover:text-sage-600 transition-colors group"
            >
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              to={user ? '/account' : '/account'}
              className="hover:text-sage-600 transition-colors group"
            >
              <User size={22} className="group-hover:scale-110 transition-transform" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-sage-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 animate-slide-down">
            <div className="flex flex-col gap-4">
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-sage-600 font-medium py-2"
              >
                Shop
              </Link>
              <Link
                to="/learn"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-sage-600 font-medium py-2"
              >
                Learn
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-sage-600 font-medium py-2"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};