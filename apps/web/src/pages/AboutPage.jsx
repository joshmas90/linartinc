import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Img from '@/components/Img';

const AboutPage = () => (
  <>

    <section className="brand-stone pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <p className="eyebrow">About Linart</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <h1 className="display-serif inner-hero-title max-w-[10ch]">
            The family name
            <span className="block italic text-[#e0c89e]">is on the work.</span>
          </h1>
          <p className="max-w-xl text-[17px] leading-8 text-white/88 sm:text-[18px]">
            Linart Construction has been family-owned since 2004. The company’s reputation is built one project at a time. That makes consistency, accountability and the finished work more important than marketing language.
          </p>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f3eee5] section-shell">
      <div className="site-container">
        <div className="grid gap-14 lg:grid-cols-[0.56fr_0.44fr] lg:gap-20">
          <div>
            <p className="eyebrow">The Company</p>
            <h2 className="section-title mt-5">Established experience. Personal accountability.</h2>
            <div className="mt-8 space-y-6 body-copy">
              <p>
                Linart Construction Inc. was established in 2004 to provide New Jersey homeowners with experienced residential construction and remodeling services.
              </p>
              <p>
                The company focuses on new custom homes, residential additions, renovations, kitchens, bathrooms, basements, decks and patios. The scope changes from project to project. The standard should not.
              </p>
              <p>
                Planning, site management, communication and finish quality are treated as parts of the same job. That operating standard carries each project from the first conversation through the final detail.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 border-y hairline sm:grid-cols-3">
              <div className="py-6">
                <div className="display-serif text-4xl">2004</div>
                <div className="mt-1 text-[13px] font-bold uppercase tracking-[0.11em] text-[#4f4942]">Established</div>
              </div>
              <div className="border-l hairline px-6 py-6">
                <div className="display-serif text-4xl">80+</div>
                <div className="mt-1 text-[13px] font-bold uppercase tracking-[0.11em] text-[#4f4942]">Combined years</div>
              </div>
              <div className="col-span-2 border-t hairline py-6 sm:col-span-1 sm:border-l sm:border-t-0 sm:px-6">
                <div className="display-serif text-4xl">NJ</div>
                <div className="mt-1 text-[13px] font-bold uppercase tracking-[0.11em] text-[#4f4942]">Residential focus</div>
              </div>
            </div>
          </div>

          <div>
            <div className="relative pb-16 sm:pl-10 lg:pb-20">
              <div className="project-frame ml-auto aspect-[4/5] w-[88%]">
                <Img
                  src="/images/about/linart-crew-framing.webp"
                  alt="Linart Construction crew framing a residential addition in New Jersey"
                  sizes="(min-width: 1024px) 38vw, 88vw"
                />
              </div>
              <div className="project-frame absolute bottom-0 left-0 aspect-[4/3] w-[62%] border-[8px] border-[#f3eee5] shadow-[0_18px_50px_rgba(11,13,16,0.18)]">
                <Img
                  src="/images/about/linart-truck-jobsite.webp"
                  alt="Linart Construction branded truck at an active residential jobsite"
                  sizes="(min-width: 1024px) 26vw, 62vw"
                />
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-7 text-[#49443e]">
              Real Linart crews and active New Jersey residential work—the people, planning and accountability behind each project.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f8f4ec] section-shell-tight">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[0.62fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Built in the Details</p>
            <h2 className="section-title mt-5 max-w-xl">Craft is visible long after the crew leaves.</h2>
          </div>
          <p className="body-copy max-w-2xl lg:justify-self-end">
            The finished impression is carried by the details: clean transitions, aligned materials, durable assemblies and the discipline to resolve what most people never see.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <figure className="md:col-span-5">
            <div className="project-frame aspect-[5/4]">
              <Img src="/images/about/butcher-block-detail.webp" alt="Finished butcher-block work surface and surrounding cabinetry"
                sizes="(min-width: 1024px) 30vw, 90vw"
              />
            </div>
            <figcaption className="mt-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#5a534b]">Material alignment</figcaption>
          </figure>
          <figure className="md:col-span-3">
            <div className="project-frame aspect-[3/4]">
              <Img src="/images/about/kitchen-cabinetry-detail.webp" alt="Finished custom cabinetry, stone backsplash and range wall"
                sizes="(min-width: 1024px) 30vw, 90vw"
              />
            </div>
            <figcaption className="mt-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#5a534b]">Finish consistency</figcaption>
          </figure>
          <figure className="md:col-span-4 md:pt-14">
            <div className="project-frame aspect-[4/3]">
              <Img src="/images/about/bathroom-craft.webp" alt="Finished bathroom with freestanding tub, blue vanity and large-format tile"
                sizes="(min-width: 1024px) 30vw, 90vw"
              />
            </div>
            <figcaption className="mt-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#5a534b]">Precise installation</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="brand-stone section-shell text-white">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow">What Clients Should Feel</p>
            <h2 className="display-serif mt-5 text-5xl leading-[0.95] sm:text-6xl">Confidence before the finish line.</h2>
          </div>
          <div className="border-t border-[#d4bb91]/22">
            {[
              ['Clarity', 'The scope, decisions and next steps should be understandable.'],
              ['Respect', 'The home remains a home while construction is underway.'],
              ['Continuity', 'The details should be carried consistently from planning through closeout.'],
              ['Accountability', 'A problem should have an owner, not a chain of excuses.'],
            ].map(([title, copy], i) => (
              <div key={title} className="premium-row grid gap-3 border-b border-[#d4bb91]/22 py-6 sm:grid-cols-[70px_170px_1fr]">
                <span className="text-[12px] font-semibold tracking-[0.16em] text-white/54">0{i + 1}</span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-[16px] leading-8 text-white/80">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#d7cec1] section-shell-tight">
      <div className="site-container flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">See the Work</p>
          <h2 className="display-serif mt-4 text-5xl leading-none sm:text-6xl">The portfolio should prove the promise.</h2>
        </div>
        <Link to="/projects" className="link-arrow text-[#0b0d10]">
          View projects <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  </>
);

export default AboutPage;
