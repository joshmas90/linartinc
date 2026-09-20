import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Img from '@/components/Img';
import { serviceDetails } from '@/content/serviceDetails';

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
        <div className="grid gap-12 lg:grid-cols-[0.30fr_minmax(0,0.70fr)] lg:gap-14 xl:grid-cols-[0.32fr_minmax(0,0.68fr)] xl:gap-16">
          <div>
            <p className="eyebrow">What We Handle</p>
            <h2 className="display-serif mt-5 max-w-[12ch] text-4xl leading-[0.98] sm:text-5xl xl:text-6xl">From a new custom home to a whole-home transformation.</h2>
            <p className="body-copy mt-6">
              Linart coordinates the visible finish with the structural and technical work behind it—from new custom home framing and exterior integration to cabinetry, tile and finish carpentry.
            </p>
            <div className="project-frame mt-8 aspect-[4/3]">
              <Img
                src="/images/projects/bathroom/bathroom-vanity-progress.webp"
                alt="Custom wood vanity installation in progress during a Linart bathroom renovation"
                sizes="(min-width: 1024px) 28vw, 90vw"
              />
            </div>
          </div>

          <div className="border-t hairline">
            {serviceDetails.map((service) => (
              <article
                id={service.id}
                key={service.number}
                aria-labelledby={`${service.id}-title`}
                className="premium-row service-row grid min-w-0 scroll-mt-28 gap-5 border-b hairline py-8 md:grid-cols-[44px_140px_minmax(0,1fr)] lg:grid-cols-[44px_150px_minmax(0,1fr)] xl:grid-cols-[48px_164px_minmax(0,1fr)]"
              >
                <span aria-hidden="true" className="text-[13px] font-bold tracking-[0.14em] text-[#504a43]">{service.number}</span>
                <div className="project-frame aspect-[4/3] sm:aspect-square">
                  <Img src={service.image} alt={service.alt}
                    sizes="(min-width: 1280px) 164px, (min-width: 1024px) 150px, (min-width: 768px) 140px, 90vw"
                  />
                </div>
                <div className="min-w-0">
                  <h2 id={`${service.id}-title`} className="display-serif break-words text-[2.15rem] leading-[0.98] sm:text-[2.3rem] lg:text-[2.45rem] xl:text-[2.6rem]">
                    <Link to={`/services/${service.slug}`} className="transition-colors hover:text-[#765326]">
                      {service.title}
                    </Link>
                  </h2>
                  <p className="body-copy mt-4 max-w-2xl">{service.summary}</p>
                  <div className="mt-6 grid min-w-0 grid-cols-1 gap-x-8 gap-y-3 text-[11px] font-semibold uppercase leading-5 tracking-[0.045em] text-[#3d3934] sm:grid-cols-2">
                    {service.details.map((detail) => <span key={detail} className="min-w-0 break-words">{detail}</span>)}
                  </div>
                  <Link to={`/services/${service.slug}`} className="link-arrow mt-6 text-[#17191b]">
                    Explore {service.title} <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#d7cec1] section-shell-tight">
      <div className="site-container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Next Step</p>
          <h2 className="display-serif mt-4 max-w-4xl text-4xl leading-[0.98] sm:text-5xl lg:text-6xl">
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
