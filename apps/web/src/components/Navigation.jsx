import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b0d10]/96 shadow-[0_8px_30px_rgba(0,0,0,0.14)] backdrop-blur-xl">
      <div className="site-container">
        <div className={`flex items-center justify-between transition-all ${scrolled ? 'h-[68px]' : 'h-[82px]'}`}>
          <Link to="/" className="relative z-50 flex items-center gap-3 text-white" aria-label="Linart Construction home">
            <span className="display-serif text-[2rem] leading-none tracking-[-0.04em]">L</span>
            <span className="h-7 w-px bg-[#9b7b4f]" />
            <span className="flex flex-col">
              <span className="text-[1.05rem] font-bold leading-none tracking-[0.09em]">LINART</span>
              <span className="mt-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-white/82">
                Construction Inc.
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <nav className="flex items-center gap-7">
              {links.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-2 text-[0.9rem] font-bold uppercase tracking-[0.075em] ${
                      active ? 'text-white' : 'text-white/88 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-px bg-[#9b7b4f] transition-all ${active ? 'w-full' : 'w-0'}`} />
                  </Link>
                );
              })}
            </nav>

            <span className="h-6 w-px bg-white/12" />

            <a href="tel:6092097810" className="flex items-center gap-2 text-[0.9rem] font-semibold text-white/90 hover:text-white">
              <Phone size={14} />
              609-209-7810
            </a>

            <Link to="/contact" className="premium-button-light">
              Start a Project
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white lg:hidden"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
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
            className="fixed inset-0 z-40 bg-[#0b0d10] lg:hidden"
          >
            <div className="flex min-h-screen flex-col px-6 pb-8 pt-28">
              <div className="border-t border-white/12">
                {[{ name: 'Home', path: '/' }, ...links, { name: 'Contact', path: '/contact' }].map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.035 }}
                    className="border-b border-white/12"
                  >
                    <Link to={link.path} className="flex items-center justify-between py-5 text-2xl font-medium text-white">
                      {link.name}
                      <ArrowUpRight size={18} className="text-[#9b7b4f]" />
                    </Link>
                  </motion.div>
                ))}
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
