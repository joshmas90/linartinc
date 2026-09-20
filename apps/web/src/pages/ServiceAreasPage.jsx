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
                  src="/images/service-areas/local-patio-project.webp"
                  alt="Fresh concrete foundation for a residential project in New Jersey"
                  sizes="(min-width: 1024px) 24vw, 56vw"
                />
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 text-[15px] leading-7 text-[#49443e]">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#a97f47]" />
              Proud to live, work and build in the New Jersey communities we call home.
            </div>
          </div>

          <div>
            <p className="eyebrow">Our Community</p>
            <h2 className="section-title mt-5">Built nearby. Accountable long after.</h2>
            <p className="body-copy mt-6 max-w-2xl">
              Working close to home means understanding New Jersey communities, housing stock and the practical realities of building here. We welcome conversations from homeowners across the state and choose projects where our team can be fully present from planning through finish.
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
                Your town may not be listed here, but it may still be a fit. Tell us where you live and what you are considering—we would be glad to talk it through.
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
