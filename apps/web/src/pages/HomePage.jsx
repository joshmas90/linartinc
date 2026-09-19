import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Phone } from 'lucide-react';

const featured = [
  {
    image: '/images/home/addition-framing.webp',
    alt: 'Large second-story residential addition being framed by Linart Construction',
    type: 'Addition in Progress',
    title: 'Complex additions are built one coordinated decision at a time.',
    number: '01',
  },
  {
    image: '/images/home/finished-bathroom.webp',
    alt: 'Finished bathroom with a freestanding tub, blue vanity and black fixtures',
    type: 'Bathroom Remodeling',
    title: 'Clean lines depend on careful layout and precise finish work.',
    number: '02',
  },
  {
    image: '/images/home/elevated-deck-detail.webp',
    alt: 'Elevated wood deck with cable railing and a finished covered area below',
    type: 'Outdoor Living',
    title: 'Structure and finish should read as one considered solution.',
    number: '03',
  },
];

const services = [
  ['Home Additions', 'Structure, envelope, interiors and finish work coordinated as one project.'],
  ['Whole-Home Renovations', 'Multi-room renovations with one sequence, one point of accountability and one finish standard.'],
  ['Kitchen Remodeling', 'Layout, cabinetry, lighting, fixtures and finish coordination for the room that works hardest.'],
  ['Bathroom Remodeling', 'Waterproofing, tile, fixtures, ventilation and clean detailing built for long-term use.'],
  ['Basement Finishing', 'Dry, comfortable living space planned around mechanicals, egress, storage and everyday use.'],
  ['Structural Remodeling', 'Openings, load-bearing changes and substantial reconfiguration carefully planned and executed.'],
];

const HomePage = () => (
  <>
    <Helmet>
      <title>Linart Construction Inc. | Residential Construction & Remodeling in New Jersey</title>
      <meta
        name="description"
        content="Linart Construction Inc. provides residential additions, renovations, kitchens, bathrooms and structural remodeling throughout New Jersey. Family-owned since 2004."
      />
    </Helmet>

    <section className="relative min-h-[94svh] overflow-hidden bg-[#0b0d10] text-white">
      <img
        src="/images/home/linart-residence-hero.webp"
        alt="Large brick and stone residence under construction by Linart Construction"
        className="absolute inset-0 h-full w-full object-cover object-[56%_center] opacity-75"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/56 via-transparent to-black/24" />

      <div className="site-container relative z-10 flex min-h-[94svh] items-end pb-14 pt-32 sm:pb-20 lg:items-center lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-[860px] border-l border-[#b9905d]/70 pl-5 sm:pl-7 lg:pl-8"
        >
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-12 bg-[#c19b68]" />
            <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#e1c99e] hero-copy-shadow">New Jersey · Family-owned since 2004</span>
          </div>

          <h1 className="display-serif hero-copy-shadow home-hero-title text-white">
            Built with
            <span className="block italic text-[#e0c89e]">intention.</span>
          </h1>

          <div className="mt-8 grid max-w-4xl gap-8 border-t border-[#d4bb91]/48 pt-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <p className="max-w-2xl hero-copy-shadow text-[18px] leading-8 text-white sm:text-[20px] sm:leading-9">
              Additions, renovations and structural remodeling—planned carefully, managed clearly, and finished to a consistent standard.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link to="/contact" className="premium-button-light">
                Discuss Your Project <ArrowUpRight size={16} />
              </Link>
              <Link to="/projects" className="premium-button premium-button-ghost">
                Selected Work
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f3eee5] section-shell">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="eyebrow">Linart Construction</p>
            <h2 className="section-title mt-5 max-w-lg">A residential builder should feel accountable.</h2>
          </div>
          <div className="lg:pt-10">
            <p className="body-copy max-w-2xl text-[19px] sm:text-[21px] sm:leading-9">
              The best renovation experience is not defined by a single finish. It is defined by the decisions made before demolition, the communication during construction and the discipline to carry details through to completion.
            </p>
            <div className="mt-10 grid border-y hairline sm:grid-cols-3 sm:divide-x divide-black/10">
              {[
                ['2004', 'Family-owned since'],
                ['80+', 'Years combined experience'],
                ['NJ', 'Residential work statewide'],
              ].map(([value, label]) => (
                <div key={value} className="py-6 sm:px-6 first:pl-0">
                  <div className="display-serif text-4xl">{value}</div>
                  <div className="mt-1 text-[13px] font-semibold uppercase tracking-[0.11em] text-[#4e4943]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f8f4ec] section-shell">
      <div className="site-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2 className="section-title mt-5">The work should carry the reputation.</h2>
          </div>
          <Link to="/projects" className="link-arrow text-[#0b0d10]">
            View project portfolio <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <article className="lg:col-span-7">
            <div className="project-frame aspect-[4/3]">
              <img src={featured[0].image} alt={featured[0].alt} loading="lazy" decoding="async" />
            </div>
            <div className="mt-5 flex items-start justify-between gap-6 border-t hairline pt-4">
              <div>
                <p className="eyebrow">{featured[0].type}</p>
                <h3 className="display-serif mt-2 max-w-xl text-3xl leading-tight sm:text-4xl">{featured[0].title}</h3>
              </div>
              <span className="text-[13px] font-semibold tracking-[0.14em] text-[#514b44]">{featured[0].number}</span>
            </div>
          </article>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {featured.slice(1).map((item) => (
              <article key={item.number}>
                <div className="project-frame aspect-[16/9]">
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-5 border-t hairline pt-4">
                  <div>
                    <p className="eyebrow">{item.type}</p>
                    <h3 className="display-serif mt-2 text-2xl leading-tight">{item.title}</h3>
                  </div>
                  <span className="text-[13px] font-semibold tracking-[0.14em] text-[#514b44]">{item.number}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="brand-stone section-shell text-white">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-title mt-5 max-w-md">One team.<br/>One standard.</h2>
            <p className="mt-6 max-w-md text-[16px] leading-8 text-white/82">
              Substantial residential work benefits from continuity. We coordinate the project as a whole rather than treating every trade as a separate experience.
            </p>
          </div>

          <div className="border-t border-[#d4bb91]/22">
            {services.map(([name, copy], index) => (
              <Link
                to="/services"
                key={name}
                className="premium-row group grid gap-3 border-b border-[#d4bb91]/22 py-6 sm:grid-cols-[60px_220px_1fr_24px] sm:items-start"
              >
                <span className="text-[12px] font-semibold tracking-[0.16em] text-white/80">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-[17px] font-semibold">{name}</h3>
                <p className="text-[16px] leading-8 text-white/80">{copy}</p>
                <ArrowUpRight size={16} className="text-[#9b7b4f] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#d7cec1] section-shell-tight">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">The Process</p>
            <h2 className="display-serif mt-4 max-w-4xl text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl">
              Clear decisions before construction. Clear communication during it.
            </h2>
          </div>
          <Link to="/about" className="link-arrow text-[#0b0d10]">
            How Linart works <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-14 grid border-t border-black/16 md:grid-cols-4">
          {[
            ['01', 'Consult', 'Define the scope, priorities and constraints.'],
            ['02', 'Plan', 'Coordinate decisions before work begins.'],
            ['03', 'Build', 'Manage sequencing, site conditions and communication.'],
            ['04', 'Finish', 'Review details and close the project carefully.'],
          ].map(([n, title, copy]) => (
            <div key={n} className="process-step border-b border-black/16 px-4 py-7 md:border-b-0 md:border-r md:px-6 first:pl-0 last:border-r-0">
              <span className="text-[12px] font-semibold tracking-[0.15em] text-[#595249]">{n}</span>
              <h3 className="mt-6 text-[17px] font-semibold">{title}</h3>
              <p className="mt-3 text-[15.5px] leading-7 text-[#3d3934]">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f3eee5] section-shell">
      <div className="site-container">
        <div className="lux-cta-panel brand-stone brand-frame overflow-hidden text-white">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="eyebrow">Start a Conversation</p>
              <h2 className="display-serif mt-5 max-w-3xl text-5xl leading-[0.95] sm:text-6xl">
                Planning a project worth doing properly?
              </h2>
              <p className="mt-6 max-w-2xl text-[17px] leading-8 text-white/84 sm:text-[18px]">
                Tell us where the project is, what you want to change, and what a successful finished home needs to do for you.
              </p>
            </div>
            <div className="flex flex-col justify-end border-t border-white/12 p-8 sm:p-12 lg:border-l lg:border-t-0">
              <Link to="/contact" className="premium-button-light">
                Start Your Project <ArrowUpRight size={16} />
              </Link>
              <a href="tel:6092097810" className="mt-5 flex items-center justify-center gap-2 text-[16px] text-white/88 hover:text-white">
                <Phone size={15} /> 609-209-7810
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default HomePage;
