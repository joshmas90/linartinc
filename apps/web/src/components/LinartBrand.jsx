import React from 'react';

export const LinartMark = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="29" fill="#0b0d10" stroke="#d7c19a" strokeWidth="1.25" />
    <circle cx="32" cy="32" r="25.5" stroke="#765326" strokeWidth="0.75" />
    <path d="M19.5 16.5V46.5H47" stroke="#d7c19a" strokeWidth="3.2" strokeLinecap="square" />
    <path d="M23.5 35.5L35.5 24.5L50 37" stroke="#ad8653" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
    <path d="M29 33.5V46H46V35" stroke="#ad8653" strokeWidth="1.5" />
    <path d="M34 35H42V43H34V35Z" fill="#d7c19a" />
    <path d="M38 35V43M34 39H42" stroke="#0b0d10" strokeWidth="1" />
  </svg>
);

const LinartBrand = ({ className = '', compact = false, footer = false }) => (
  <span className={`linart-brand ${footer ? 'linart-brand-footer' : ''} ${className}`}>
    <LinartMark className={compact ? 'h-11 w-11 sm:h-12 sm:w-12' : 'h-[82px] w-[82px] sm:h-[92px] sm:w-[92px]'} />
    <span className="flex min-w-0 flex-col">
      <span className={`linart-wordmark ${compact ? 'text-[1.08rem] sm:text-[1.18rem]' : 'text-[1.42rem] sm:text-[1.65rem]'}`}>
        LINART
      </span>
      <span className={`linart-company-line ${compact ? 'mt-1 text-[0.54rem] sm:text-[0.58rem]' : 'mt-1.5 text-[0.61rem] sm:text-[0.66rem]'}`}>
        Construction Inc.
      </span>
      {!compact && (
        <span className="linart-brand-meta mt-2.5">
          New Jersey <span aria-hidden="true">·</span> Est. 2004
        </span>
      )}
    </span>
  </span>
);

export default LinartBrand;
