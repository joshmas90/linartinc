import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <span className="text-2xl font-bold text-white block">Linart</span>
              <span className="text-sm text-slate-400 uppercase tracking-widest">Construction Inc.</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted partner for residential additions and remodeling in New Jersey. Family-owned and operated since 2004.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-bronze">
                <CheckCircle size={14} /> Family Owned
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-bronze">
                <CheckCircle size={14} /> Fully Licensed & Insured
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Home Additions</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Kitchen Remodeling</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Bathroom Remodeling</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Basement Finishing</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Whole Home Renovations</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Our Projects</Link></li>
              <li><Link to="/service-areas" className="hover:text-white transition-colors">Service Areas</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-bronze mt-0.5" size={18} />
                <span>Serving New Jersey &<br/>Surrounding Areas</span>
              </li>
              <li>
                <a href="tel:6092097810" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone className="text-bronze" size={18} />
                  609-209-7810
                </a>
              </li>
              <li>
                <a href="mailto:services@linartinc.com" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail className="text-bronze" size={18} />
                  services@linartinc.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} Linart Construction Inc. All rights reserved.</p>
          <p>Residential Additions & Remodeling Specialists</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;