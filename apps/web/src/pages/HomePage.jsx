import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Hammer,
  HardHat,
  Home,
  Layout,
  Phone,
  Ruler,
  Construction
} from 'lucide-react';

const services = [
  {
    number: '01',
    title: 'Home Additions',
    description:
      'Thoughtful expansions designed to feel original to the home—from structure and envelope through the final interior details.',
    icon: Home,
  },
  {
    number: '02',
    title: 'Kitchen Remodeling',
    description:
      'High-function kitchens with better flow, durable finishes, carefully coordinated cabinetry, fixtures, lighting, and trim.',
    icon: Layout,
  },
  {
    number: '03',
    title: 'Bathroom Remodeling',
    description:
      'Well-built bathrooms centered on waterproofing, clean detailing, efficient layouts, tilework, and long-term durability.',
    icon: Hammer,
  },
  {
    number: '04',
    title: 'Basement Finishing',
    description:
      'Comfortable finished space for offices, recreation, guests, and everyday living—planned around the way your family uses the home.',
    icon: Ruler,
  },
  {
    number: '05',
    title: 'Full Home Renovations',
    description:
      'Coordinated interior and exterior renovations managed as one cohesive project with attention to sequencing and finish quality.',
    icon: Construction,
  },
  {
    number: '06',
    title: 'Structural Remodeling',
    description:
      'Carefully planned structural changes for open layouts, load-bearing modifications, and major reconfiguration work.',
    icon: HardHat,
  },
];

const proof = [
  'Family-owned since 2004',
  '80+ years combined experience',
  'Residential construction throughout New Jersey',
];

const process = [
  {
    number: '01',
    title: 'Consult',
    description: 'We start with the way you want the space to work, your priorities, and the scope required to get there.',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'We coordinate the work before construction begins so decisions, sequencing, and expectations are clear.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'The project is executed with disciplined site management, communication, and attention to the details that matter.',
  },
  {
    number: '04',
    title: 'Finish',
    description: 'We close out the work carefully, review the finished space with you, and make sure the final result feels complete.',
  },
];

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Linart Construction Inc. | Residential Additions & Remodeling in New Jersey</title>
        <meta
          name="description"
          content="Family-owned since 2004. Linart Construction provides residential additions, renovations, kitchens, bathrooms and structural remodeling throughout New Jersey."
        />
      </Helmet>

      <section className="relative min-h-[92svh] overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="https://horizons-cdn.hostinger.com/ee08914b-5384-4cd2-8f63-8b9f3f228829/remotemediafile_6619721_0_2022_05_05_12_30_52-sS9RR.jpeg"
            alt="New Jersey residential construction project"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1218]/95 via-[#0d1218]/78 to-[#0d1218]/28" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1218]/55 via-transparent to-[#0d1218]/20" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-center px-5 pb-16 pt-32 sm:px-6 lg:px-8 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-white/45" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-sm">
                New Jersey Residential Construction · Since 2004
              </p>
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Residential construction,
              <span className="block text-white/72">elevated.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
              Additions, full-home renovations, kitchens, bathrooms, basements and structural remodeling—managed with experienced craftsmanship and clear communication.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/contact"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-bold tracking-wide text-charcoal transition-transform duration-300 hover:-translate-y-0.5"
              >
                Discuss Your Project
                <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                to="/projects"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.07] px-7 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/12"
              >
                View Our Work
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-12 grid max-w-3xl gap-3 border-t border-white/20 pt-6 sm:grid-cols-3 sm:gap-6">
              {proof.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm leading-6 text-white/70">
                  <Check size={16} className="mt-1 shrink-0 text-white" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-[#f6f5f2] to-transparent" />
      </section>

      <section className="bg-[#f6f5f2] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="premium-eyebrow">Why Linart</p>
              <h2 className="premium-heading mt-4 max-w-xl">
                Experience shows up in the details.
              </h2>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-lg leading-8 text-slate-600">
                Major residential work should feel organized, considered, and built to last. Linart Construction brings decades of combined field experience to every phase—from early planning through the final walkthrough.
              </p>
              <Link
                to="/about"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-charcoal"
              >
                About Linart Construction
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="mt-16 grid divide-y divide-black/10 border-y border-black/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              ['2004', 'Family-owned and operated'],
              ['80+', 'Years of combined experience'],
              ['NJ', 'Residential projects statewide'],
            ].map(([value, label]) => (
              <div key={value} className="px-0 py-8 md:px-8 md:first:pl-0 md:last:pr-0">
                <div className="text-4xl font-semibold tracking-[-0.04em] text-charcoal">{value}</div>
                <div className="mt-2 text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="premium-eyebrow">Capabilities</p>
              <h2 className="premium-heading mt-4 max-w-2xl">
                One contractor for the work that changes how your home lives.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-500">
              From targeted renovations to major structural transformations, our work is centered on durable construction, thoughtful coordination, and a finished result that belongs in the home.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 border-l border-t border-black/10 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="group min-h-[320px] border-b border-r border-black/10 p-7 transition-colors duration-300 hover:bg-[#f7f6f3] sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    {service.number}
                  </span>
                  <service.icon size={23} strokeWidth={1.5} className="text-slate-400 transition-colors group-hover:text-deep-blue" />
                </div>
                <h3 className="mt-14 text-2xl font-semibold tracking-[-0.025em] text-charcoal">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {service.description}
                </p>
                <Link
                  to="/services"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-charcoal opacity-75 transition-all group-hover:gap-3 group-hover:opacity-100"
                >
                  Explore service
                  <ArrowRight size={15} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111820] py-24 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">How We Work</p>
              <h2 className="mt-5 max-w-md text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                A better build starts with a better process.
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-white/60">
                Premium construction is not just the finish. It is the planning, communication, sequencing, and accountability that get the project there.
              </p>
            </div>

            <div className="border-t border-white/15">
              {process.map((step) => (
                <div
                  key={step.number}
                  className="grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[70px_150px_1fr] sm:items-start"
                >
                  <span className="text-xs font-semibold tracking-[0.2em] text-white/35">{step.number}</span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="max-w-xl text-sm leading-7 text-white/55">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f5f2] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-deep-blue px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Start a Conversation
                </p>
                <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Planning an addition or renovation?
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                  Tell us what you are considering and where the project is located. We will help you determine the right next step.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  to="/contact"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-deep-blue"
                >
                  Request an Estimate
                  <ArrowUpRight size={17} />
                </Link>
                <a
                  href="tel:6092097810"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-sm font-semibold text-white"
                >
                  <Phone size={17} />
                  609-209-7810
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
