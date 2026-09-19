import React from 'react';

const LinartBrand = ({ className = '', compact = false, footer = false }) => (
  <span className={`linart-brand ${footer ? 'linart-brand-footer' : ''} ${className}`}>
    <img
      src="/branding/linart-seal.png"
      alt=""
      aria-hidden="true"
      width="256"
      height="256"
      className={`linart-brand-seal ${compact ? 'h-11 w-11 sm:h-12 sm:w-12' : 'h-[82px] w-[82px] sm:h-[92px] sm:w-[92px]'}`}
    />
    <span className="flex min-w-0 flex-col">
      <span className={`linart-wordmark ${compact ? 'text-[1.08rem] sm:text-[1.18rem]' : 'text-[1.42rem] sm:text-[1.65rem]'}`}>
        LINART
      </span>
      <span className={`linart-company-line ${compact ? 'mt-1 text-[0.54rem] sm:text-[0.58rem]' : 'mt-1.5 text-[0.61rem] sm:text-[0.66rem]'}`}>
        Construction Inc.
      </span>
      {!compact && (
        <>
          <span className="linart-brand-tagline">Residential Construction, Elevated.</span>
          <span className="linart-brand-meta mt-2">
            New Jersey <span aria-hidden="true">·</span> Since 2004
          </span>
        </>
      )}
    </span>
  </span>
);

export default LinartBrand;
