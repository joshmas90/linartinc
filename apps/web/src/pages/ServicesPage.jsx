import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Img from '@/components/Img';

const services = [
  {
    number: '01',
    id: 'home-additions',
    title: 'Home Additions',
    copy: 'Expansions planned to feel connected to the original house—not appended to it.',
    details: ['Structural framing', 'Exterior envelope', 'Interior integration', 'Finish coordination'],
    image: '/images/home/addition-framing.webp',
    alt: 'Linart Construction crew framing a large residential addition',
  },
  {
    number: '02',
    id: 'whole-home-renovations',
    title: 'Whole-Home Renovations',
    copy: 'Large-scope renovation work coordinated across rooms, systems and trades.',
    details: ['Phased planning', 'Interior reconfiguration', 'Finish consistency', 'Trade coordination'],
    image: '/images/projects/featured/interior-deck-connection.webp',
    alt: 'Interior and exterior living spaces connected through a Linart renovation',
  },
  {
    number: '03',
    id: 'kitchen-remodeling',
    title: 'Kitchen Remodeling',
    copy: 'Kitchens designed around circulation, storage, durable materials and clean installation.',
    details: ['Layout', 'Cabinetry', 'Lighting', 'Fixtures + finish work'],
    image: '/images/projects/featured/finished-kitchen.webp',
    alt: 'Finished custom kitchen cabinetry by Linart Construction',
  },
  {
    number: '04',
    id: 'bathroom-remodeling',
    title: 'Bathroom Remodeling',
    copy: 'Bathrooms built around waterproofing, precise tilework and durable daily use.',
    details: ['Waterproofing', 'Tile', 'Fixtures', 'Ventilation + finish'],
    image: '/images/projects/featured/modern-bathroom.webp',
    alt: 'Finished modern bathroom with precise tile and fixture installation',
  },
  {
    number: '05',
    id: 'basement-finishing',
    title: 'Basement Finishing',
    copy: 'Comfortable lower-level living space planned around the realities of the existing home.',
    details: ['Layout', 'Moisture considerations', 'Mechanical integration', 'Finish work'],
    image: '/images/editorial/hardwood-restoration-progress.webp',
    alt: 'Hardwood floor restoration in progress during a Linart interior renovation',
  },
  {
    number: '06',
    id: 'structural-remodeling',
    title: 'Structural Remodeling',
    copy: 'Major reconfiguration and load-bearing changes approached with careful planning and sequencing.',
    details: ['Openings', 'Load-bearing changes', 'Reconfiguration', 'Trade coordination'],
    image: '/images/about/linart-crew-framing.webp',
    alt: 'Linart crew completing structural framing on a residential project',
  },
];

const ServicesPage = () => (
  <>

    <section className="brand-stone pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <p className="eyebrow">Capabilities</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <h1 className="display-serif inner-hero-title max-w-[10ch]">
            Residential work,
            <span className="block italic text-[#e0c89e]">properly coordinated.</span>
          </h1>
          <p className="max-w-xl text-[17px] leading-8 text-white/88 sm:text-[18px]">
            The service list matters less than how the work is managed. Linart focuses on substantial residential projects where sequencing, communication and finish quality all matter.
          </p>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f3eee5] section-shell">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div>
            <p className="eyebrow">What We Handle</p>
            <h2 className="display-serif mt-5 text-5xl leading-[0.95] sm:text-6xl">Substantial residential work, coordinated as a whole.</h2>
            <p className="body-copy mt-6">
              Linart coordinates the visible finish with the structural and technical work behind it—from framing and exterior integration to cabinetry, tile and finish carpentry.
            </p>
            <div className="project-frame mt-8 aspect-[4/3]">
              <Img
                src="/images/projects/details/wood-ceiling.webp"
                alt="Wood ceiling installation detail by Linart Construction"
                sizes="(min-width: 1024px) 28vw, 90vw"
              />
            </div>
          </div>

          <div className="border-t hairline">
            {services.map((service) => (
              <article
                id={service.id}
                key={service.number}
                aria-labelledby={`${service.id}-title`}
                className="premium-row service-row grid scroll-mt-28 gap-5 border-b hairline py-8 sm:grid-cols-[52px_150px_1fr] lg:grid-cols-[52px_170px_1fr]"
              >
                <span aria-hidden="true" className="text-[13px] font-bold tracking-[0.14em] text-[#504a43]">{service.number}</span>
                <div className="project-frame aspect-[4/3] sm:aspect-square">
                  <Img src={service.image} alt={service.alt}
                    sizes="(min-width: 1024px) 170px, (min-width: 640px) 150px, 90vw"
                  />
                </div>
                <div>
                  <h2 id={`${service.id}-title`} className="display-serif text-4xl leading-none sm:text-[2.65rem]">{service.title}</h2>
                  <p className="body-copy mt-4 max-w-2xl">{service.copy}</p>
                  <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#3d3934] xl:grid-cols-4">
                    {service.details.map((detail) => <span key={detail}>{detail}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#d7cec1] section-shell-tight">
      <div className="site-container flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Next Step</p>
          <h2 className="display-serif mt-4 max-w-4xl text-5xl leading-none sm:text-6xl">
            Tell us what you are considering. We’ll help define the right conversation.
          </h2>
        </div>
        <Link to="/contact" className="premium-button-dark shrink-0">
          Discuss Your Project <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  </>
);

export default ServicesPage;
