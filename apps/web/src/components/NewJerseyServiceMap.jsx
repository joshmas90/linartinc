import React, { useState } from 'react';
import { njServiceCounties, njServiceOutline } from '@/data/njServiceMap';

const tierDetails = {
  core: {
    label: 'Core service area',
    note: 'Where we do most of our work',
  },
  extended: {
    label: 'Outer project reach',
    note: 'Project-dependent travel range',
  },
  north: {
    label: 'Occasional projects only',
    note: 'Project-dependent, outside our normal service area',
  },
};

const NewJerseyServiceMap = () => {
  const [activeCounty, setActiveCounty] = useState('Burlington');
  const selected = njServiceCounties.find((county) => county.name === activeCounty) ?? njServiceCounties[0];

  return (
    <div className="nj-service-map">
      <div className="nj-service-map__heading">
        <div>
          <span className="nj-service-map__kicker">Service footprint</span>
          <h3>Built close to home.</h3>
        </div>
        <span className="nj-service-map__state">New Jersey</span>
      </div>

      <svg
        className="nj-service-map__svg"
        viewBox="0 0 480 660"
        role="img"
        aria-labelledby="nj-service-map-title nj-service-map-description"
      >
        <title id="nj-service-map-title">Linart Construction New Jersey service area map</title>
        <desc id="nj-service-map-description">
          County map showing Linart&apos;s core service area, typical outer project reach and occasional project counties.
        </desc>
        <defs>
          <linearGradient id="nj-map-core" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ead1a7" />
            <stop offset="55%" stopColor="#c09258" />
            <stop offset="100%" stopColor="#996936" />
          </linearGradient>
          <pattern id="nj-map-extended" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#d9cbb5" />
            <circle cx="2.2" cy="2.2" r="1" fill="#9b7040" opacity="0.62" />
          </pattern>
          <pattern id="nj-map-north" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="11" height="11" fill="#242625" />
            <path d="M0 1H11" stroke="#ad8a5d" strokeWidth="1" opacity="0.2" />
          </pattern>
        </defs>

        <g>
          {njServiceCounties.map((county) => (
            <path
              key={county.id}
              d={county.path}
              className={`nj-service-map__county nj-service-map__county--${county.tier}${selected.name === county.name ? ' is-active' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={`${county.name} County — ${tierDetails[county.tier].label}`}
              onPointerEnter={() => setActiveCounty(county.name)}
              onFocus={() => setActiveCounty(county.name)}
              onClick={() => setActiveCounty(county.name)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setActiveCounty(county.name);
                }
              }}
            />
          ))}
          <path d={njServiceOutline} className="nj-service-map__outline" />
        </g>

        <g aria-hidden="true">
          {njServiceCounties.map((county) => (
            <text
              key={county.id}
              x={county.label[0]}
              y={county.label[1]}
              className={`nj-service-map__label nj-service-map__label--${county.tier}`}
            >
              {county.abbreviation}
            </text>
          ))}
        </g>
      </svg>

      <div className="nj-service-map__selection" aria-live="polite">
        <div>
          <span>Selected county</span>
          <strong>{selected.name} County</strong>
        </div>
        <div className={`nj-service-map__selection-tier nj-service-map__selection-tier--${selected.tier}`}>
          <span>{tierDetails[selected.tier].label}</span>
          <small>{tierDetails[selected.tier].note}</small>
        </div>
      </div>

      <div className="nj-service-map__legend" aria-label="Map legend">
        <span><i className="nj-service-map__swatch nj-service-map__swatch--core" />Core</span>
        <span><i className="nj-service-map__swatch nj-service-map__swatch--extended" />Outer reach</span>
        <span><i className="nj-service-map__swatch nj-service-map__swatch--north" />Occasional</span>
      </div>
    </div>
  );
};

export default NewJerseyServiceMap;
