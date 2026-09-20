import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import NewJerseyServiceMap from '@/components/NewJerseyServiceMap';

const groups = [
  {
    number: '01',
    title: 'Core service area',
    note: 'Where we do most of our work',
    counties: ['Atlantic', 'Burlington', 'Camden', 'Gloucester', 'Ocean'],
  },
  {
    number: '02',
    title: 'Outer project reach',
    note: 'The farthest we typically travel',
    ranges: [
      ['Central', ['Mercer', 'Middlesex', 'Monmouth']],
      ['South', ['Cape May', 'Cumberland', 'Salem']],
    ],
  },
  {
    number: '03',
    title: 'Occasional projects only',
    note: 'Project-dependent areas outside our normal service footprint',
    counties: ['Hunterdon', 'Somerset', 'Union', 'Bergen', 'Essex', 'Hudson', 'Morris', 'Passaic', 'Sussex', 'Warren'],
  },
];

const ServiceAreasPage = () => (
  <>

    <section className="brand-stone pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <p className="eyebrow">Proudly Local</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <h1 className="display-serif inner-hero-title max-w-[10ch]">
            New Jersey is home.
            <span className="block italic text-[#e0c89e]">So is the work.</span>
          </h1>
          <p className="max-w-xl text-[17px] leading-8 text-white/88 sm:text-[18px]">
            Linart is rooted here, lives here and builds for neighbors across New Jersey. That local connection shapes how we communicate, care for each home and stand behind the finished work.
          </p>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f3eee5] section-shell">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.47fr_0.53fr] lg:gap-16 xl:gap-20">
          <div>
            <NewJerseyServiceMap />
            <div className="mt-5 flex items-start gap-3 text-[15px] leading-7 text-[#49443e]">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#a97f47]" />
              Based locally and proud to build for homeowners throughout the New Jersey communities we call home.
            </div>
          </div>

          <div>
            <p className="eyebrow">Our Community</p>
            <h2 className="section-title mt-5">Built nearby. Accountable long after.</h2>
            <p className="body-copy mt-6 max-w-2xl">
              Working close to home means understanding New Jersey communities, housing stock and the practical realities of building here. Most of our work is concentrated across Atlantic, Burlington, Camden, Gloucester and Ocean counties, with select projects extending through Central and South Jersey.
            </p>

            <div className="mt-10 border-t hairline">
              {groups.map((group) => (
                <div key={group.title} className="premium-row grid gap-5 border-b hairline py-7 sm:grid-cols-[42px_185px_1fr]">
                  <span className="service-area-index">{group.number}</span>
                  <div>
                    <h3 className="font-semibold">{group.title}</h3>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#8a6840]">{group.note}</p>
                  </div>
                  <div className="text-[15px] leading-7 text-[#3f3b36]">
                    {group.counties && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {group.counties.map((county) => <span key={county}>{county} County</span>)}
                      </div>
                    )}
                    {group.ranges?.map(([range, counties]) => (
                      <div key={range} className="service-area-range">
                        <strong>{range}</strong>
                        <span>{counties.map((county) => `${county} County`).join(' · ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-l-2 border-[#9b7b4f] pl-5">
              <p className="text-[16px] leading-8 text-[#3c3833]">
                Live near the edge of our service area? Tell us where you are and what you are considering. We will let you know honestly whether the project is a good fit.
              </p>
              <Link to="/contact" className="link-arrow mt-4 text-[#0b0d10]">
                Start a local conversation <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default ServiceAreasPage;
