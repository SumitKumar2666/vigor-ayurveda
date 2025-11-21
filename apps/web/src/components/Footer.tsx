import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Leaf } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-sage-900 to-sage-800 text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <Leaf className="text-turmeric-400" size={24} />
              </div>
              <h3 className="font-bold text-xl">VigorAyurveda</h3>
            </div>
            <p className="text-sage-100 text-sm mb-4 leading-relaxed">
              Rooted in Ayurveda. Focused on Power. Built for Today.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/vigorayurveda/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com/vigorayurveda"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/vigorayurveda"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-turmeric-400 mb-4 text-sm uppercase tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/shop?category=stacks"
                  className="text-sage-100 hover:text-white transition-colors"
                >
                  Ayurvedic Stacks
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=single"
                  className="text-sage-100 hover:text-white transition-colors"
                >
                  Single Herbs
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=bestsellers"
                  className="text-sage-100 hover:text-white transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-sage-100 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-bold text-turmeric-400 mb-4 text-sm uppercase tracking-wide">
              Learn
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/learn" className="text-sage-100 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/learn/about"
                  className="text-sage-100 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sage-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sage-100 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-turmeric-400 mb-4 text-sm uppercase tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 text-turmeric-400 flex-shrink-0" />
                <a
                  href="mailto:support@vigorayurveda.com"
                  className="text-sage-100 hover:text-white transition-colors"
                >
                  support@vigorayurveda.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-1 text-turmeric-400 flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="text-sage-100 hover:text-white transition-colors"
                >
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 text-turmeric-400 flex-shrink-0" />
                <span className="text-sage-100">Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-sage-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <Link
                to="/legal/terms"
                className="text-sage-100 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-sage-700">•</span>
              <Link
                to="/legal/privacy"
                className="text-sage-100 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-sage-700">•</span>
              <Link
                to="/legal/disclaimer"
                className="text-sage-100 hover:text-white transition-colors"
              >
                Disclaimer
              </Link>
            </div>
            <p className="text-sage-100 text-sm">© 2025 VigorAyurveda. All rights reserved.</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-sage-300 bg-sage-800/50 rounded-lg p-3">
            ⚠️ This content is educational only and not medical advice. Consult a healthcare
            professional before starting any supplement. Sexual-wellness content is 18+.
          </p>
        </div>
      </div>
    </footer>
  );
};