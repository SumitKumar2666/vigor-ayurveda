import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';

export const Navbar = () => {
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          VigorAyurveda
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <Link to="/learn" className="hover:text-primary">Learn</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          
          <Link to="/cart" className="relative hover:text-primary">
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
          
          <Link to={user ? '/account' : '/account'} className="hover:text-primary">
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};