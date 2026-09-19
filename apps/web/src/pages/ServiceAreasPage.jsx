import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Img from '@/components/Img';

const groups = [
  ['North Jersey', ['Bergen', 'Essex', 'Hudson', 'Morris', 'Passaic', 'Sussex', 'Warren']],
  ['Central Jersey', ['Hunterdon', 'Mercer', 'Middlesex', 'Monmouth', 'Somerset', 'Union']],
  ['South Jersey', ['Atlantic', 'Burlington', 'Camden', 'Cape May', 'Cumberland', 'Gloucester', 'Ocean', 'Salem']],
];

const ServiceAreasPage = () => (
  <>

    <section className="brand-stone pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <p className="eyebrow">Where We Work</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <h1 className="display-serif inner-hero-title max-w-[10ch]">
            New Jersey,
            <span className="block italic text-[#e0c89e]">one project at a time.</span>
          </h1>
          <p className="max-w-xl text-[17px] leading-8 text-white/88 sm:text-[18px]">
            Linart serves homeowners throughout New Jersey. Project fit depends on scope, schedule and location—not on how many towns can be listed on a page.
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
                  alt="Linart Construction residential project underway in New Jersey"
                  sizes="(min-width: 1024px) 38vw, 90vw"
                />
              </div>
              <div className="project-frame absolute bottom-0 right-0 aspect-[4/3] w-[62%] border-[8px] border-[#f3eee5] shadow-[0_18px_50px_rgba(11,13,16,0.18)]">
                <Img
                  src="/images/about/linart-truck-jobsite.webp"
                  alt="Linart Construction truck at an active New Jersey jobsite"
                  sizes="(min-width: 1024px) 24vw, 56vw"
                />
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 text-[15px] leading-7 text-[#49443e]">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#a97f47]" />
              Residential additions, renovations and structural work throughout New Jersey.
            </div>
          </div>

          <div>
            <p className="eyebrow">Coverage</p>
            <h2 className="section-title mt-5">Local knowledge without the clutter.</h2>
            <p className="body-copy mt-6 max-w-2xl">
              Each inquiry is evaluated around location, scope, schedule and the demands of the home. Share the municipality early so logistics, permitting and project fit can be discussed clearly.
            </p>

            <div className="mt-10 border-t hairline">
              {groups.map(([region, counties]) => (
                <div key={region} className="premium-row grid gap-5 border-b hairline py-7 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold">{region}</h3>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-[16px] leading-7 text-[#3f3b36]">
                    {counties.map((county) => <span key={county}>{county} County</span>)}
                  </div>
                </div>
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
