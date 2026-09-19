import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LinartBrand from '@/components/LinartBrand';

const links = [
  { name: 'Projects', path: '/projects' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Service Areas', path: '/service-areas' },
];

const Navigation = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-[#b58f5c]/30 bg-black/95 shadow-[0_10px_34px_rgba(0,0,0,0.34)] backdrop-blur-xl">
      <div className="site-container">
        <div className={`flex items-center justify-between transition-all ${scrolled ? 'h-[68px]' : 'h-[76px]'}`}>
          <Link
            to="/"
            className="relative z-50 text-white"
            aria-label="Linart Construction home"
          >
            <LinartBrand compact />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            <nav aria-label="Primary navigation" className="flex items-center gap-6">
              {links.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? 'page' : undefined}
                    className="relative py-2 text-[0.82rem] font-bold uppercase tracking-[0.10em] transition-opacity hover:opacity-100"
                    style={{ color: active ? '#fffaf1' : '#e8e0d4', opacity: active ? 1 : 0.92 }}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-px bg-[#b58f5c] transition-all ${active ? 'w-full' : 'w-0'}`} />
                  </Link>
                );
              })}
            </nav>

            <span className="h-6 w-px bg-white/12" />

            <a href="tel:6092097810" className="flex items-center gap-2 text-[0.82rem] font-semibold hover:opacity-100" style={{ color: "#f3ece1", opacity: 0.94 }}>
              <Phone size={14} />
              609-209-7810
            </a>

            <Link to="/contact" className="premium-button-light nav-premium-cta !min-h-[48px] !px-6">
              Start a Project
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white lg:hidden"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="mobile-navigation"
            role="navigation"
            aria-label="Site navigation"
            className="fixed inset-0 z-40 bg-[#0b0d10] lg:hidden"
          >
            <div className="flex min-h-screen flex-col px-6 pb-8 pt-28">
              <div className="border-t border-white/12">
                {[{ name: 'Home', path: '/' }, ...links, { name: 'Contact', path: '/contact' }].map((link, i) => {
                  const active = location.pathname === link.path;
                  return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.035 }}
                    className="border-b border-white/12"
                  >
                    <Link
                      to={link.path}
                      aria-current={active ? 'page' : undefined}
                      className="flex items-center justify-between py-5 text-2xl font-medium text-white"
                    >
                      {link.name}
                      <ArrowUpRight size={18} className="text-[#c9a978]" />
                    </Link>
                  </motion.div>
                  );
                })}
              </div>
              <div className="mt-auto border-t border-white/12 pt-6">
                <p className="eyebrow">Direct</p>
                <a href="tel:6092097810" className="mt-3 block text-xl text-white">609-209-7810</a>
                <a href="mailto:services@linartinc.com" className="mt-2 block text-[15px] text-white/78">services@linartinc.com</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
