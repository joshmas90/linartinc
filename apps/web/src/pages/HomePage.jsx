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
    image: '/images/projects/bathroom/bathroom-shower-detail.webp',
    alt: 'Walk-in shower with white tile and matte-black fixtures',
    title: 'Modern Bathroom Remodel',
    copy: 'Functionality meets elegance.',
  },
  {
    image: '/images/projects/kitchen/kitchen-main.webp',
    alt: 'Completed white kitchen with farmhouse sink and hardwood floors',
    title: 'Open Concept Kitchen',
    copy: 'Connected spaces built for daily life.',
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
    <section className="relative overflow-hidden bg-[#0d1013] text-white">
      <div className="grid lg:min-h-[560px] lg:grid-cols-[0.42fr_0.58fr]">
        <div className="relative z-10 flex items-center bg-[linear-gradient(135deg,#101316_0%,#161a1e_100%)] px-6 pb-14 pt-32 sm:px-10 sm:pb-16 lg:px-[max(3rem,calc((100vw-1320px)/2))] lg:pr-10 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-[650px]"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#e3c693]">
              Expert craftsmanship. Lasting value.
            </p>

            <h1 className="display-serif mt-5 max-w-[9ch] text-[clamp(3.5rem,6vw,6rem)] leading-[0.9] tracking-[-0.045em] text-white">
              Transforming Homes. Building What’s Next.
            </h1>

            <p className="mt-7 max-w-xl text-[17px] leading-8 text-white/88 sm:text-[19px] sm:leading-9">
              From luxury renovations to new custom home construction, Linart delivers exceptional craftsmanship and timeless results across New Jersey.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="premium-button-light">
                Start Your Project <ArrowUpRight size={16} />
              </Link>
              <Link to="/projects" className="premium-button-ghost">
                View Our Work <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="relative min-h-[390px] overflow-hidden sm:min-h-[460px] lg:min-h-[560px]">
          <Img
            src="/images/home/linart-reference-hero.webp"
            alt="Luxury Linart bathroom renovation with freestanding tub, exposed brick and glass shower"
            className="absolute inset-0 h-full w-full object-cover object-center"
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-[#121518] to-transparent lg:block" />
        </div>
      </div>
    </section>

    <section className="border-b border-black/10 bg-[#fbfaf7]">
      <div className="site-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {serviceHighlights.map(({ icon: Icon, label, copy, to }, index) => (
            <Link
              key={label}
              to={to}
              className={`group flex min-h-[126px] items-center gap-4 py-6 sm:px-6 ${index > 0 ? 'sm:border-l sm:border-black/10' : ''}`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center text-[#a47b3d] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon size={36} strokeWidth={1.55} />
              </div>
              <div>
                <h2 className="text-[14px] font-bold uppercase tracking-[0.055em] text-[#16191c]">{label}</h2>
                <p className="mt-1 text-[14px] leading-6 text-[#59534d]">{copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-white section-shell-tight">
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

        <div className="mt-8 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
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
              <h3 className="mt-4 text-[15px] font-bold uppercase tracking-[0.035em] text-[#17191b]">{project.title}</h3>
              <p className="mt-1 text-[15px] leading-6 text-[#5b554f]">{project.copy}</p>
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
