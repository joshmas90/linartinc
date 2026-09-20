import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import LinartBrand from '@/components/LinartBrand';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="brand-stone text-white">
      <div className="site-container py-18 sm:py-24">
        <div className="grid gap-12 border-b border-[#d4bb91]/18 pb-14 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
          <div>
            <Link to="/" aria-label="Linart Construction home" className="inline-flex text-white">
              <LinartBrand footer />
            </Link>
            <p className="mt-6 max-w-sm text-[16px] leading-8 text-white/78">
              Residential additions, renovations and structural remodeling throughout New Jersey. Family-owned and building under the Linart name since 2004.
            </p>
          </div>

          <div>
            <p className="eyebrow">Company</p>
            <div className="mt-5 space-y-3 text-[16px] text-white/80">
              <Link className="block hover:text-white" to="/about">About</Link>
              <Link className="block hover:text-white" to="/projects">Projects</Link>
              <Link className="block hover:text-white" to="/service-areas">Service Areas</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow">Services</p>
            <div className="mt-5 space-y-3 text-[16px] text-white/80">
              <Link className="block hover:text-white" to="/services#new-custom-home-construction">Custom Homes</Link>
              <Link className="block hover:text-white" to="/services#home-additions">Additions</Link>
              <Link className="block hover:text-white" to="/services#whole-home-renovations">Renovations</Link>
              <Link className="block hover:text-white" to="/services#kitchen-remodeling">Kitchens & Baths</Link>
              <Link className="block hover:text-white" to="/services#structural-remodeling">Structural Work</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow">Contact</p>
            <div className="mt-5 space-y-4 text-[16px] text-white/80">
              <a href="tel:6092097810" className="flex items-center gap-3 hover:text-white">
                <Phone size={15} className="text-[#c9a978]" /> 609-209-7810
              </a>
              <a href="mailto:services@linartinc.com" className="flex items-center gap-3 hover:text-white">
                <Mail size={15} className="text-[#c9a978]" /> services@linartinc.com
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#c9a978]" />
                <span>Serving New Jersey</span>
              </div>
              <Link to="/contact" className="link-arrow pt-2 text-white">
                Discuss a project <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[13px] text-white/66 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Linart Construction Inc. All rights reserved.</p>
          <p>Residential construction · New Jersey · Since 2004</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
