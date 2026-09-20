import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import Img from '@/components/Img';
import { serviceBySlug, serviceDetails } from '@/content/serviceDetails';

const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const service = serviceBySlug[serviceSlug];

  if (!service) {
    return (
      <section className="brand-stone min-h-[70vh] pb-24 pt-40 text-white">
        <div className="site-container">
          <p className="eyebrow">Services</p>
          <h1 className="display-serif mt-5 text-5xl sm:text-6xl">Service page not found.</h1>
          <Link to="/services" className="premium-button-light mt-8">
            Explore Services <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const related = serviceDetails.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="brand-stone pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <div className="site-container">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.11em] text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link to="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page" className="text-[#e0c89e]">{service.title}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">{service.eyebrow}</p>
              <h1 className="display-serif mt-5 max-w-[12ch] text-[clamp(3.5rem,6vw,6.4rem)] leading-[0.9] tracking-[-0.045em]">
                {service.h1}
              </h1>
              <p className="mt-7 max-w-2xl text-[17px] leading-8 text-white/82 sm:text-[19px] sm:leading-9">
                {service.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/contact" className="premium-button-light">
                  Start a Project <ArrowUpRight size={16} />
                </Link>
                <Link to="/projects" className="premium-button-ghost">
                  View Project Work <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="project-frame aspect-[4/3]">
              <Img
                src={service.image}
                alt={service.alt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="lux-light-section bg-[#f3eee5] section-shell">
        <div className="site-container">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="eyebrow">Scope</p>
              <h2 className="display-serif mt-5 max-w-[12ch] text-4xl leading-[0.96] sm:text-5xl lg:text-6xl">
                What this work can include.
              </h2>
              <p className="body-copy mt-6">{service.summary}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {service.details.map((detail, index) => (
                <div key={detail} className="cream-panel min-h-[150px] p-6">
                  <span className="text-[11px] font-bold tracking-[0.15em] text-[#8a6840]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="display-serif mt-5 text-3xl leading-none">{detail}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lux-light-section bg-white section-shell">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="eyebrow">Planning Priorities</p>
              <h2 className="display-serif mt-5 max-w-[12ch] text-4xl leading-[0.96] sm:text-5xl lg:text-6xl">
                The details need an order.
              </h2>
              <p className="body-copy mt-6">{service.planning}</p>
            </div>

            <div className="border-t hairline">
              {service.priorities.map(([title, copy]) => (
                <div key={title} className="grid gap-4 border-b hairline py-7 sm:grid-cols-[36px_0.55fr_1fr]">
                  <Check size={18} className="mt-1 text-[#9b7339]" />
                  <h3 className="text-[17px] font-bold text-[#17191b]">{title}</h3>
                  <p className="text-[15.5px] leading-7 text-[#504a43]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="brand-stone section-shell-tight text-white">
        <div className="site-container">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Related Services</p>
              <h2 className="display-serif mt-4 text-4xl leading-none sm:text-5xl">
                Keep the project connected.
              </h2>
            </div>
            <Link to="/services" className="link-arrow text-white">
              View all services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to={`/services/${item.slug}`}
                className="premium-row border border-white/12 p-6"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#d4bb91]">{item.eyebrow}</p>
                <h3 className="display-serif mt-4 text-3xl leading-none">{item.title}</h3>
                <p className="mt-4 text-[14px] leading-6 text-white/65">{item.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-white">
                  Explore <ArrowUpRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="lux-light-section bg-[#d7cec1] section-shell-tight">
        <div className="site-container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Start a Conversation</p>
            <h2 className="display-serif mt-4 max-w-4xl text-4xl leading-[0.98] sm:text-5xl lg:text-6xl">
              Tell us what you want the finished home to do better.
            </h2>
          </div>
          <Link to="/contact" className="premium-button-dark shrink-0">
            Discuss Your Project <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
