import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-earth-brown border-t border-primary/20 mt-32">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-white">Melodiva Skincare</span>
            </div>
            <p className="text-sm text-white/70">
              Natural skincare products crafted with authentic ingredients for your beauty and wellness.
            </p>
          </div>

          <div className="animate-fade-in">
            <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-white/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-white/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/affiliate" className="text-sm text-white/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in">
            <h3 className="font-semibold mb-4 text-primary">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-white/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-white/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-white/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in">
            <h3 className="font-semibold mb-4 text-primary">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-white/70 transition-colors duration-300 hover:text-white">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@melodiva.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-white/70 transition-colors duration-300 hover:text-white">
                <Phone className="h-4 w-4 text-primary" />
                <span>+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-white/70 transition-colors duration-300 hover:text-white">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Melodiva Skincare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
