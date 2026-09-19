import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0d10] text-white">
      <div className="site-container py-16 sm:py-20">
        <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="display-serif text-4xl leading-none">L</span>
              <span className="h-8 w-px bg-[#9b7b4f]" />
              <div>
                <div className="text-sm font-semibold tracking-[0.14em]">LINART</div>
                <div className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/62">Construction Inc.</div>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/72">
              Residential additions, renovations and structural remodeling throughout New Jersey. Family-owned since 2004.
            </p>
          </div>

          <div>
            <p className="eyebrow">Company</p>
            <div className="mt-5 space-y-3 text-[15px] text-white/72">
              <Link className="block hover:text-white" to="/about">About</Link>
              <Link className="block hover:text-white" to="/projects">Projects</Link>
              <Link className="block hover:text-white" to="/service-areas">Service Areas</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow">Services</p>
            <div className="mt-5 space-y-3 text-[15px] text-white/72">
              <Link className="block hover:text-white" to="/services">Additions</Link>
              <Link className="block hover:text-white" to="/services">Renovations</Link>
              <Link className="block hover:text-white" to="/services">Kitchens & Baths</Link>
              <Link className="block hover:text-white" to="/services">Structural Work</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow">Contact</p>
            <div className="mt-5 space-y-4 text-[15px] text-white/72">
              <a href="tel:6092097810" className="flex items-center gap-3 hover:text-white">
                <Phone size={15} className="text-[#9b7b4f]" /> 609-209-7810
              </a>
              <a href="mailto:services@linartinc.com" className="flex items-center gap-3 hover:text-white">
                <Mail size={15} className="text-[#9b7b4f]" /> services@linartinc.com
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#9b7b4f]" />
                <span>Serving New Jersey</span>
              </div>
              <Link to="/contact" className="link-arrow pt-2 text-white">
                Discuss a project <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[12px] text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Linart Construction Inc. All rights reserved.</p>
          <p>Residential construction · New Jersey · Since 2004</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
