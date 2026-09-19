import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';

const groups = [
  ['North Jersey', ['Bergen', 'Essex', 'Hudson', 'Morris', 'Passaic', 'Sussex', 'Warren']],
  ['Central Jersey', ['Hunterdon', 'Mercer', 'Middlesex', 'Monmouth', 'Somerset', 'Union']],
  ['South Jersey', ['Atlantic', 'Burlington', 'Camden', 'Cape May', 'Cumberland', 'Gloucester', 'Ocean', 'Salem']],
];

const ServiceAreasPage = () => (
  <>
    <Helmet>
      <title>New Jersey Service Areas | Linart Construction Inc.</title>
      <meta name="description" content="Linart Construction Inc. serves residential construction and remodeling clients throughout New Jersey." />
    </Helmet>

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
            <div className="project-frame aspect-[4/5]">
              <img src="/placeholders/service-map.svg" alt="Temporary New Jersey service area visual" />
            </div>
            <div className="mt-4 flex items-start gap-3 text-[15px] leading-7 text-[#49443e]">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#a97f47]" />
              Replace with a real New Jersey project map or a strong geographic/project montage once final assets are selected.
            </div>
          </div>

          <div>
            <p className="eyebrow">Coverage</p>
            <h2 className="section-title mt-5">Local knowledge without the clutter.</h2>
            <p className="body-copy mt-6 max-w-2xl">
              Coverage is supporting information, not the brand itself. The work, the process and the fit of the project remain the focus.
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
