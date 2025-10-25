import { Leaf, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-primary/20 mt-32">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-white">Melodiva Skincare</span>
            </div>
            <p className="text-sm text-white/70">
              Your trusted source for pure natural Skin Care products. We believe in the power of nature to enhance your beauty.
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
                <span>melodivaproducts@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-white/70 transition-colors duration-300 hover:text-white">
                <Phone className="h-4 w-4 text-primary" />
                <span>234 807 872 5283</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-white/70 transition-colors duration-300 hover:text-white">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>

            <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com/share/1DtvKgX3Qs/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@melodivaproducts?_t=ZM-8v0fmEeGvhf&_r=1" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                <FaTiktok className="h-5 w-5" />
              </a>
              <a href="https://wa.me/2348078725283" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </div>
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
