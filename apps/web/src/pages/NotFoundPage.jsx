import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="brand-stone flex min-h-[78svh] items-center pb-20 pt-36 text-white sm:pt-44">
    <div className="site-container">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">404 · Page Not Found</p>
          <p aria-hidden="true" className="display-serif mt-7 text-[7rem] leading-none text-[#d7c19a]/22 sm:text-[11rem]">404</p>
        </div>
        <div className="border-l border-[#d4bb91]/32 pl-6 sm:pl-9">
          <h1 className="display-serif max-w-[11ch] text-5xl leading-[0.94] sm:text-7xl">
            This page is no longer on the plan.
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-8 text-white/78">
            The address may have changed. Return home or explore Linart’s residential construction services.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="premium-button-light">
              <ArrowLeft size={16} /> Return Home
            </Link>
            <Link to="/services" className="premium-button premium-button-ghost">
              View Services <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default NotFoundPage;
