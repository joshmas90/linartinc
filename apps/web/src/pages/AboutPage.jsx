import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutPage = () => (
  <>
    <Helmet>
      <title>About Linart Construction Inc. | Family-Owned Since 2004</title>
      <meta name="description" content="Linart Construction Inc. is a family-owned New Jersey residential construction company established in 2004." />
    </Helmet>

    <section className="bg-[#0b0d10] pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <p className="eyebrow">About Linart</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <h1 className="display-serif text-6xl leading-[0.88] tracking-[-0.045em] sm:text-8xl lg:text-[7.5rem]">
            The family name
            <span className="block italic text-[#d7c6a9]">is on the work.</span>
          </h1>
          <p className="max-w-xl text-sm leading-7 text-white/52 sm:text-base sm:leading-8">
            Linart Construction has been family-owned since 2004. The company’s reputation is built one project at a time, in the same communities where the team lives and works.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-[#f5f1e8] py-20 sm:py-28">
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
                The company focuses on residential additions, renovations, kitchens, bathrooms, basements and structural remodeling. The work may change from project to project; the standard should not.
              </p>
              <p>
                Planning, site management, communication and finish quality are treated as parts of the same job. That is the operating idea behind the company and the standard the redesigned site is built to communicate.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 border-y hairline sm:grid-cols-3">
              <div className="py-6">
                <div className="display-serif text-4xl">2004</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#77726a]">Established</div>
              </div>
              <div className="border-l hairline px-6 py-6">
                <div className="display-serif text-4xl">80+</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#77726a]">Combined years</div>
              </div>
              <div className="col-span-2 border-t hairline py-6 sm:col-span-1 sm:border-l sm:border-t-0 sm:px-6">
                <div className="display-serif text-4xl">NJ</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#77726a]">Residential focus</div>
              </div>
            </div>
          </div>

          <div>
            <div className="project-frame aspect-[4/5]">
              <img src="/placeholders/about-team.svg" alt="Temporary Linart team and project placeholder" />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#81786c]">
              Recommended replacement: Linart owner/team on a real project site, photographed naturally rather than posed.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#171b20] py-20 text-white sm:py-24">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow">What Clients Should Feel</p>
            <h2 className="display-serif mt-5 text-5xl leading-[0.95] sm:text-6xl">Confidence before the finish line.</h2>
          </div>
          <div className="border-t border-white/14">
            {[
              ['Clarity', 'The scope, decisions and next steps should be understandable.'],
              ['Respect', 'The home remains a home while construction is underway.'],
              ['Continuity', 'The details should be carried consistently from planning through closeout.'],
              ['Accountability', 'A problem should have an owner, not a chain of excuses.'],
            ].map(([title, copy], i) => (
              <div key={title} className="grid gap-3 border-b border-white/14 py-6 sm:grid-cols-[70px_170px_1fr]">
                <span className="text-[10px] tracking-[0.2em] text-white/30">0{i + 1}</span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm leading-7 text-white/50">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#d8d0c4] py-16 sm:py-20">
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
