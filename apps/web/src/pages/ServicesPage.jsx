import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const services = [
  {
    number: '01',
    title: 'Home Additions',
    copy: 'Expansions planned to feel connected to the original house—not appended to it.',
    details: ['Structural framing', 'Exterior envelope', 'Interior integration', 'Finish coordination'],
  },
  {
    number: '02',
    title: 'Whole-Home Renovations',
    copy: 'Large-scope renovation work coordinated across rooms, systems and trades.',
    details: ['Phased planning', 'Interior reconfiguration', 'Finish consistency', 'Trade coordination'],
  },
  {
    number: '03',
    title: 'Kitchen Remodeling',
    copy: 'Kitchens designed around circulation, storage, durable materials and clean installation.',
    details: ['Layout', 'Cabinetry', 'Lighting', 'Fixtures + finish work'],
  },
  {
    number: '04',
    title: 'Bathroom Remodeling',
    copy: 'Bathrooms built around waterproofing, precise tilework and durable daily use.',
    details: ['Waterproofing', 'Tile', 'Fixtures', 'Ventilation + finish'],
  },
  {
    number: '05',
    title: 'Basement Finishing',
    copy: 'Comfortable lower-level living space planned around the realities of the existing home.',
    details: ['Layout', 'Moisture considerations', 'Mechanical integration', 'Finish work'],
  },
  {
    number: '06',
    title: 'Structural Remodeling',
    copy: 'Major reconfiguration and load-bearing changes approached with careful planning and sequencing.',
    details: ['Openings', 'Load-bearing changes', 'Reconfiguration', 'Trade coordination'],
  },
];

const ServicesPage = () => (
  <>
    <Helmet>
      <title>Residential Construction Services | Linart Construction Inc.</title>
      <meta name="description" content="Home additions, whole-home renovations, kitchen and bathroom remodeling, basement finishing and structural remodeling in New Jersey." />
    </Helmet>

    <section className="bg-[#0b0d10] pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <p className="eyebrow">Capabilities</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <h1 className="display-serif text-6xl leading-[0.88] tracking-[-0.045em] sm:text-8xl lg:text-[7.5rem]">
            Residential work,
            <span className="block italic text-[#d7c6a9]">properly coordinated.</span>
          </h1>
          <p className="max-w-xl text-[17px] leading-8 text-white/84 sm:text-[18px]">
            The service list matters less than how the work is managed. Linart focuses on substantial residential projects where sequencing, communication and finish quality all matter.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-[#f5f1e8] py-16 sm:py-24">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="project-frame aspect-[4/5]">
              <img src="/placeholders/service-detail.svg" alt="Temporary construction detail placeholder" />
            </div>
            <p className="mt-4 text-[15px] leading-7 text-[#45413b]">
              Replace this placeholder with a strong Linart detail image: craftsmanship, framing, millwork, tile or finish work.
            </p>
          </div>

          <div className="border-t hairline">
            {services.map((service) => (
              <div key={service.number} className="grid gap-5 border-b hairline py-8 sm:grid-cols-[60px_1fr]">
                <span className="text-[13px] font-bold tracking-[0.14em] text-[#504a43]">{service.number}</span>
                <div>
                  <h2 className="display-serif text-4xl leading-none sm:text-5xl">{service.title}</h2>
                  <p className="body-copy mt-4 max-w-2xl">{service.copy}</p>
                  <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] font-semibold uppercase tracking-[0.065em] text-[#3d3934] sm:grid-cols-4">
                    {service.details.map((detail) => <span key={detail}>{detail}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#d8d0c4] py-16 sm:py-20">
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
