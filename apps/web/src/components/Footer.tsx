import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">VigorAyurveda</h3>
            <p className="text-sm text-gray-600">
              Rooted in Ayurveda. Focused on Power. Built for Today.
            </p>
            <a 
              href="https://www.instagram.com/vigorayurveda/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <Instagram size={20} /> @vigorayurveda
            </a>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?category=sexual-wellness" className="hover:text-primary">Sexual Wellness</Link></li>
              <li><Link to="/shop?category=hormonal-balance" className="hover:text-primary">Hormonal Balance</Link></li>
              <li><Link to="/shop?category=digestive-health" className="hover:text-primary">Digestive Health</Link></li>
              <li><Link to="/shop?category=foundation-stacks" className="hover:text-primary">Foundation Stacks</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/learn" className="hover:text-primary">Blog</Link></li>
              <li><Link to="/learn/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/legal/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            ⚠️ This content is educational only and not medical advice. Sexual-wellness content is 18+.
          </p>
          <p>© 2025 VigorAyurveda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};