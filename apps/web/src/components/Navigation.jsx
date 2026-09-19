import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 28);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Service Areas', path: '/service-areas' },
  ];

  const onHome = location.pathname === '/';

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled || !onHome
          ? 'border-b border-white/10 bg-[#0B0F14]/96 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl'
          : 'bg-gradient-to-b from-black/45 to-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-[72px]' : 'h-[86px]'}`}>
          <Link to="/" className="group relative z-50 flex items-center" aria-label="Linart Construction home">
            <div className="flex flex-col text-white">
              <span className="text-[1.65rem] font-semibold leading-none tracking-[-0.04em]">Linart</span>
              <span className="mt-1 text-[0.62rem] font-semibold uppercase leading-none tracking-[0.23em] text-white/58">
                Construction Inc.
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <div className="flex items-center gap-7">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-3 text-[0.82rem] font-semibold tracking-wide transition-colors ${
                      active ? 'text-white' : 'text-white/62 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-1 left-0 h-px bg-bronze transition-all duration-300 ${
                        active ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            <span className="h-6 w-px bg-white/15" />

            <a
              href="tel:6092097810"
              className="flex items-center gap-2 text-[0.82rem] font-semibold text-white/72 transition-colors hover:text-white"
            >
              <Phone size={15} />
              609-209-7810
            </a>

            <Link
              to="/contact"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F5F1E9] px-5 text-[0.78rem] font-bold tracking-wide text-charcoal transition-transform hover:-translate-y-0.5"
            >
              Start a Project
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <button
            onClick={() => setIsOpen((value) => !value)}
            className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur lg:hidden"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#0B0F14] lg:hidden"
          >
            <div className="flex min-h-screen flex-col px-6 pb-8 pt-28">
              <div className="border-t border-white/12">
                {[...navLinks, { name: 'Contact', path: '/contact' }].map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index }}
                    className="border-b border-white/12"
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center justify-between py-5 text-2xl font-semibold tracking-[-0.025em] ${
                        location.pathname === link.path ? 'text-white' : 'text-white/62'
                      }`}
                    >
                      {link.name}
                      <ArrowUpRight size={18} className="opacity-45" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto border-t border-white/12 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Call Linart Construction</p>
                <a href="tel:6092097810" className="mt-2 inline-flex items-center gap-3 text-xl font-semibold text-white">
                  <Phone size={19} />
                  609-209-7810
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
