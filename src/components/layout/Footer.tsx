import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, ExternalLink, ChevronRight } from 'lucide-react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import melodivaLogo from '/public/melodiva-logo.png';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-300 relative border-t border-zinc-800/80 mt-28 overflow-hidden">
      {/* Top Gradient Highlight Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-16 max-w-[1600px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <img
                src={melodivaLogo}
                alt="Melodiva Logo"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xl font-extrabold text-white group-hover:text-primary transition-colors">
                Melodiva Skin Care
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your trusted source for 100% pure organic skincare. Handcrafted in Nigeria with plant-based oils and black soaps to enhance your natural glow.
            </p>
            {/* Social Links with Hover Badges */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://www.facebook.com/share/1DtvKgX3Qs/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@melodivaproducts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
              >
                <FaTiktok className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/2348078725283"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Quick Navigation</h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group"
                >
                  <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5" />
                  <span>Shop Catalog</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate"
                  className="hover:text-white hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group"
                >
                  <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5" />
                  <span>Affiliate Program</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/checklist"
                  className="hover:text-white hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group"
                >
                  <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5" />
                  <span>Skincare Checklist</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Support Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Policies & Help</h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group"
                >
                  <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-white hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group"
                >
                  <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5" />
                  <span>Shipping Rates & Hubs</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-white hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group"
                >
                  <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5" />
                  <span>Returns & Refund Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group"
                >
                  <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="hover:text-white hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group"
                >
                  <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Get In Touch</h3>
            <ul className="space-y-3.5 text-xs text-zinc-400">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-primary flex items-center justify-center shrink-0">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-zinc-300">melodivaproducts@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-primary flex items-center justify-center shrink-0">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-zinc-300">+234 807 872 5283</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-zinc-300">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-zinc-800/80 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p className="flex items-center flex-wrap gap-1 text-zinc-400">
            <span>&copy; {new Date().getFullYear()} Melodiva Skin Care. All rights reserved</span>
            <span className="mx-1 text-zinc-600">||</span>
            <span>Built by</span>
            <a
              href="https://www.tmb.it.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold inline-flex items-center gap-1 transition-colors"
            >
              <span>TMB</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </p>
          <div className="flex gap-4 text-xs">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
            <span className="text-zinc-700">•</span>
            <Link to="/returns" className="hover:text-primary transition-colors">Returns</Link>
            <span className="text-zinc-700">•</span>
            <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
