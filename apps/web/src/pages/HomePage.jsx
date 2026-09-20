import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Bath, Home, Plus, Hammer, Phone } from 'lucide-react';
import Img from '@/components/Img';

const serviceHighlights = [
  {
    icon: Bath,
    label: 'Kitchens & Bathrooms',
    copy: 'Beautiful, functional spaces.',
    to: '/services#kitchen-remodeling',
  },
  {
    icon: Home,
    label: 'New Custom Home Construction',
    copy: 'Your vision. Our expertise.',
    to: '/services#new-custom-home-construction',
  },
  {
    icon: Plus,
    label: 'Additions & Expansions',
    copy: 'More space for what matters.',
    to: '/services#home-additions',
  },
  {
    icon: Hammer,
    label: 'Whole Home Renovations',
    copy: 'Reimagine every detail.',
    to: '/services#whole-home-renovations',
  },
];

const featuredProjects = [
  {
    image: '/images/projects/bathroom/bath-main.webp',
    alt: 'Finished bathroom with freestanding tub and black hexagonal tile',
    title: 'Luxury Bathroom Renovation',
    copy: 'Classic design. Modern comfort.',
  },
  {
    image: '/images/projects/kitchen/kitchen-main.webp',
    alt: 'Completed Linart kitchen renovation with white cabinetry and hardwood floors',
    title: 'Kitchen Remodeling',
    copy: 'Refined layouts. Everyday function.',
  },
  {
    image: '/images/projects/bathroom/bathroom-double-vanity.webp',
    alt: 'Custom double vanity with vessel sinks and black fixtures',
    title: 'Custom Interiors',
    copy: 'Details that make a difference.',
  },
  {
    image: '/images/home/covered-porch-addition.webp',
    alt: 'Completed covered porch addition with finished gable and white railing',
    title: 'Additions & Outdoor Living',
    copy: 'Built to feel like it was always there.',
  },
];

const services = [
  ['New Custom Home Construction', 'Ground-up homes coordinated from structure and envelope through interiors, systems and finish work.', 'new-custom-home-construction'],
  ['Home Additions', 'Structure, envelope, interiors and finish work coordinated as one project.', 'home-additions'],
  ['Whole-Home Renovations', 'Multi-room renovations with one sequence, one point of accountability and one finish standard.', 'whole-home-renovations'],
  ['Kitchen Remodeling', 'Layout, cabinetry, lighting, fixtures and finish coordination for the room that works hardest.', 'kitchen-remodeling'],
  ['Bathroom Remodeling', 'Waterproofing, tile, fixtures, ventilation and clean detailing built for long-term use.', 'bathroom-remodeling'],
  ['Basement Finishing', 'Dry, comfortable living space planned around mechanicals, egress, storage and everyday use.', 'basement-finishing'],
  ['Decks/Patios', 'Custom decks and patios planned for durable outdoor living, clean integration and long-term use.', 'decks-patios'],
];

const HomePage = () => (
  <>
    <section className="relative min-h-[560px] overflow-hidden bg-[#090b0d] text-white sm:min-h-[600px] lg:min-h-[640px]">
      <img
        src="/images/home/linart-premium-hero-generated.webp"
        alt="Luxury Linart bathroom with freestanding tub, exposed brick, marble shower and custom vanity"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(7,9,11,.995) 0%, rgba(7,9,11,.995) 25%, rgba(7,9,11,.97) 34%, rgba(7,9,11,.88) 41%, rgba(7,9,11,.62) 49%, rgba(7,9,11,.30) 58%, rgba(7,9,11,.08) 70%, rgba(7,9,11,0) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-black/10" />

      <div className="pointer-events-none absolute bottom-0 right-0 z-[5] hidden h-[30%] w-[39%] lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,11,8,.18)_0%,rgba(14,11,8,.88)_54%,rgba(9,8,7,.96)_100%)] backdrop-blur-[10px]" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent to-[rgba(14,11,8,.30)]" />
        <div className="relative flex h-full items-center justify-center px-10 text-center">
          <div className="max-w-[430px]">
            <span className="mx-auto mb-5 block h-px w-20 bg-gradient-to-r from-transparent via-[#d8b36f] to-transparent" />
            <p className="display-serif text-[clamp(2rem,2.6vw,3rem)] italic leading-[1.02] tracking-[-0.02em] text-[#fff8ed] drop-shadow-[0_2px_18px_rgba(0,0,0,.72)]">
              “Spaces worth coming home to.”
            </p>
            <span className="mx-auto mt-5 block h-px w-20 bg-gradient-to-r from-transparent via-[#d8b36f] to-transparent" />
          </div>
        </div>
      </div>

      <div className="site-container relative z-10 flex min-h-[560px] items-center pb-14 pt-28 sm:min-h-[600px] lg:min-h-[640px] lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-[700px]"
        >
          <div className="flex items-center gap-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#ddb97c] hero-copy-shadow">
              One Crew, Start to Finish
            </p>
            <span className="hidden h-px w-20 bg-gradient-to-r from-[#a97c3d] to-transparent sm:block" />
          </div>

          <h1 className="display-serif hero-copy-shadow mt-5 max-w-[10.5ch] text-[clamp(3.45rem,5vw,5.7rem)] leading-[0.92] tracking-[-0.045em] text-white">
            Transforming Homes. Building What’s Next.
          </h1>

          <p className="mt-6 max-w-[590px] text-[17px] leading-8 text-white/90 sm:text-[19px] sm:leading-9">
            From luxury renovations to new custom home construction, Linart delivers exceptional craftsmanship and timeless results across New Jersey.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex min-h-[60px] items-center justify-between gap-8 rounded-[3px] border border-[#e1bd78]/55 bg-[linear-gradient(180deg,#c89a4f_0%,#9b702c_100%)] px-8 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.28),0_14px_34px_rgba(0,0,0,.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f0d39a]/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,.32),0_18px_42px_rgba(0,0,0,.34),0_0_24px_rgba(184,132,59,.14)]"
            >
              Start Your Project
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              to="/projects"
              className="group inline-flex min-h-[60px] items-center justify-between gap-8 rounded-[3px] border border-[#c89a4f]/75 bg-[linear-gradient(180deg,rgba(14,16,18,.72),rgba(6,7,8,.58))] px-8 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_14px_34px_rgba(0,0,0,.22)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e1bd78] hover:bg-[linear-gradient(180deg,rgba(34,29,23,.78),rgba(8,9,10,.68))]"
            >
              View Our Work
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="border-b border-black/10 bg-[#fbfaf7]">
      <div className="site-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {serviceHighlights.map(({ icon: Icon, label, copy, to }, index) => (
            <Link
              key={label}
              to={to}
              className={`group flex min-h-[118px] items-center gap-4 py-5 sm:px-6 ${index > 0 ? 'sm:border-l sm:border-black/10' : ''}`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center text-[#a47b3d] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon size={37} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[13px] font-bold uppercase leading-5 tracking-[0.055em] text-[#16191c]">{label}</h2>
                <p className="mt-1 text-[14px] leading-5 text-[#59534d]">{copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-white py-12 sm:py-14 lg:py-16">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#9b7339]">Featured Projects</p>
              <span className="h-px w-10 bg-[#b8925d]/50" />
            </div>
            <h2 className="display-serif mt-3 text-4xl leading-none sm:text-5xl">Real Projects. Lasting Results.</h2>
          </div>
          <Link to="/projects" className="premium-button premium-button-outline">
            View All Projects <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-7 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProjects.map((project) => (
            <Link key={project.title} to="/projects" className="group">
              <div className="project-frame aspect-[4/3] overflow-hidden">
                <Img
                  src={project.image}
                  alt={project.alt}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <h3 className="mt-3 text-[14px] font-bold uppercase tracking-[0.035em] text-[#17191b]">{project.title}</h3>
              <p className="mt-1 text-[14px] leading-6 text-[#5b554f]">{project.copy}</p>
            </Link>
          ))}
        </div>
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

    <section className="brand-stone section-shell text-white">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-title mt-5 max-w-md">One team.<br/>One standard.</h2>
            <p className="mt-6 max-w-md text-[16px] leading-8 text-white/82">
              From new custom home construction to major renovations, substantial residential work benefits from continuity. We coordinate the project as a whole rather than treating every trade as a separate experience.
            </p>
          </div>

          <div className="border-t border-[#d4bb91]/22">
            {services.map(([name, copy, slug], index) => (
              <Link
                to={`/services#${slug}`}
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
            <div className="relative min-h-[340px] overflow-hidden border-t border-white/12 lg:min-h-0 lg:border-l lg:border-t-0">
              <Img
                src="/images/home/open-kitchen.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/52 to-black/14" />
              <div className="relative flex h-full min-h-[340px] flex-col justify-end p-8 sm:p-12">
                <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[#e0c89e]">Built in New Jersey</p>
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
      </div>
    </section>
  </>
);

export default HomePage;
