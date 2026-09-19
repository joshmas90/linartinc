import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Img from '@/components/Img';

/**
 * Linart primarily services the southern half of New Jersey. Listing all 21
 * counties reads as filler and splits local search relevance across places we
 * do not actually work.
 *
 * EDIT ME: trim or extend the town lists to the municipalities Linart genuinely
 * serves. These names are what local search matches on, so accuracy beats length.
 */
const primary = [
  ['Burlington County', ['Moorestown', 'Mount Laurel', 'Medford', 'Marlton', 'Cinnaminson', 'Delran', 'Mount Holly', 'Bordentown']],
  ['Camden County', ['Cherry Hill', 'Haddonfield', 'Voorhees', 'Collingswood', 'Gloucester Township', 'Washington Township']],
  ['Gloucester County', ['Mullica Hill', 'Deptford', 'Mantua', 'Woolwich', 'Harrison Township']],
  ['Atlantic County', ['Linwood', 'Northfield', 'Egg Harbor Township', 'Galloway', 'Margate', 'Ventnor']],
  ['Ocean County', ['Toms River', 'Brick', 'Point Pleasant', 'Manahawkin', 'Long Beach Island']],
];

const secondary = [
  ['Mercer County', ['Princeton', 'Hamilton', 'West Windsor', 'Robbinsville']],
  ['Cumberland County', ['Vineland', 'Millville', 'Bridgeton']],
  ['Salem County', ['Pennsville', 'Woodstown', 'Salem']],
  ['Cape May County', ['Ocean City', 'Avalon', 'Stone Harbor', 'Sea Isle City', 'Cape May']],
];

const Row = ({ county, towns }) => (
  <div className="premium-row grid gap-4 border-b hairline py-7 sm:grid-cols-[200px_1fr] sm:gap-6">
    <h3 className="font-semibold">{county}</h3>
    <p className="text-[16px] leading-7 text-[#3f3b36]">{towns.join(' · ')}</p>
  </div>
);

const ServiceAreasPage = () => (
  <>

    <section className="brand-stone pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <p className="eyebrow">Where We Work</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <h1 className="display-serif inner-hero-title max-w-[10ch]">
            South Jersey,
            <span className="block italic text-[#e0c89e]">and we know it well.</span>
          </h1>
          <p className="max-w-xl text-[17px] leading-8 text-white/88 sm:text-[18px]">
            Linart works across the southern half of New Jersey. Staying inside that radius keeps crews on site early, inspections scheduled on time and the same people on your project from start to finish.
          </p>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f3eee5] section-shell">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
          <div>
            <div className="relative pb-16 sm:pr-8 lg:pb-20">
              <div className="project-frame aspect-[4/5]">
                <Img
                  src="/images/projects/company/residential-project.webp"
                  alt="Linart Construction residential project underway in southern New Jersey"
                  sizes="(min-width: 1024px) 38vw, 90vw"
                />
              </div>
              <div className="project-frame absolute bottom-0 right-0 aspect-[4/3] w-[62%] border-[8px] border-[#f3eee5] shadow-[0_18px_50px_rgba(11,13,16,0.18)]">
                <Img
                  src="/images/about/linart-truck-jobsite.webp"
                  alt="Linart Construction truck at an active southern New Jersey jobsite"
                  sizes="(min-width: 1024px) 24vw, 56vw"
                />
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 text-[15px] leading-7 text-[#49443e]">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#a97f47]" />
              Residential additions, renovations and structural work across southern New Jersey.
            </div>
          </div>

          <div>
            <p className="eyebrow">Coverage</p>
            <h2 className="section-title mt-5">A radius we can actually serve.</h2>
            <p className="body-copy mt-6 max-w-2xl">
              Working one region means we know the local building departments, the inspection schedules and the trades. That shows up as fewer delays once construction starts. Share the municipality early so permitting and project fit can be discussed clearly.
            </p>

            <p className="eyebrow mt-10">Primary service area</p>
            <div className="mt-5 border-t hairline">
              {primary.map(([county, towns]) => (
                <Row key={county} county={county} towns={towns} />
              ))}
            </div>

            <p className="eyebrow mt-12">Also serving</p>
            <div className="mt-5 border-t hairline">
              {secondary.map(([county, towns]) => (
                <Row key={county} county={county} towns={towns} />
              ))}
            </div>

            <div className="mt-8 border-l-2 border-[#9b7b4f] pl-5">
              <p className="text-[16px] leading-8 text-[#3c3833]">
                Don’t see your area? Project scope matters. Contact Linart with the municipality and a short description of the work.
              </p>
              <Link to="/contact" className="link-arrow mt-4 text-[#0b0d10]">
                Check project fit <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default ServiceAreasPage;
