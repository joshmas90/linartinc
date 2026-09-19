import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    image: '/placeholders/project-exterior.svg',
    kicker: 'Addition + Exterior',
    title: 'Residence 01',
    location: 'New Jersey',
    scope: 'Addition · Exterior integration · Interior finish',
    size: 'large',
  },
  {
    image: '/placeholders/project-kitchen.svg',
    kicker: 'Kitchen + Interior',
    title: 'Residence 02',
    location: 'New Jersey',
    scope: 'Kitchen · Millwork · Lighting · Finish coordination',
    size: 'small',
  },
  {
    image: '/placeholders/project-bath.svg',
    kicker: 'Bath + Millwork',
    title: 'Residence 03',
    location: 'New Jersey',
    scope: 'Bath renovation · Tile · Fixtures · Finish work',
    size: 'small',
  },
  {
    image: '/placeholders/project-whole-home.svg',
    kicker: 'Whole Home',
    title: 'Residence 04',
    location: 'New Jersey',
    scope: 'Whole-home renovation · Structural work · Interiors',
    size: 'large',
  },
];

const ProjectsPage = () => (
  <>
    <Helmet>
      <title>Projects | Linart Construction Inc.</title>
      <meta name="description" content="Selected residential additions and renovation work by Linart Construction Inc. throughout New Jersey." />
    </Helmet>

    <section className="bg-[#0b0d10] pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h1 className="display-serif mt-5 text-6xl leading-[0.88] tracking-[-0.045em] sm:text-8xl lg:text-[7.5rem]">
              Work worth
              <span className="block italic text-[#d7c6a9]">looking closely at.</span>
            </h1>
          </div>
          <p className="max-w-xl text-[16px] leading-8 text-white/76 sm:text-[17px] lg:justify-self-end">
            This temporary portfolio structure is ready for Linart’s real project photography. Each project is presented as work—not as a generic card.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-[#f5f1e8] py-16 sm:py-24">
      <div className="site-container">
        <div className="space-y-20 sm:space-y-28">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className={`grid gap-7 ${index % 2 ? 'lg:grid-cols-[0.42fr_0.58fr]' : 'lg:grid-cols-[0.62fr_0.38fr]'} lg:items-end`}
            >
              <div className={`project-frame ${project.size === 'large' ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
                <img src={project.image} alt="Temporary Linart project photography placeholder" />
              </div>

              <div className={`${index % 2 ? 'lg:order-first lg:pr-10' : 'lg:pl-10'} border-t hairline pt-5`}>
                <div className="flex items-center justify-between">
                  <p className="eyebrow">{project.kicker}</p>
                  <span className="text-[11px] font-semibold tracking-[0.17em] text-[#675f55]">0{index + 1}</span>
                </div>
                <h2 className="display-serif mt-4 text-5xl leading-none sm:text-6xl">{project.title}</h2>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-[#5f5a52]">{project.location}</p>
                <p className="mt-3 max-w-lg text-[16px] leading-8 text-[#47433d]">{project.scope}</p>
                <div className="mt-8 text-[12px] font-bold uppercase tracking-[0.12em] text-[#825f2d]">
                  Project photography to be replaced
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#171b20] py-16 text-white sm:py-20">
      <div className="site-container flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your Project</p>
          <h2 className="display-serif mt-4 text-5xl leading-none sm:text-6xl">Planning something substantial?</h2>
        </div>
        <Link to="/contact" className="premium-button-light">
          Start a Conversation <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  </>
);

export default ProjectsPage;
