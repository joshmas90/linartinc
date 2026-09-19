import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    image: '/placeholders/project-exterior.svg',
    kicker: 'Addition + Exterior',
    title: 'Project 01',
    location: 'New Jersey',
    scope: 'Addition · Exterior integration · Interior finish',
    size: 'large',
  },
  {
    image: '/placeholders/project-kitchen.svg',
    kicker: 'Kitchen + Interior',
    title: 'Project 02',
    location: 'New Jersey',
    scope: 'Kitchen · Millwork · Lighting · Finish coordination',
    size: 'small',
  },
  {
    image: '/placeholders/project-bath.svg',
    kicker: 'Bath + Millwork',
    title: 'Project 03',
    location: 'New Jersey',
    scope: 'Bath renovation · Tile · Fixtures · Finish work',
    size: 'small',
  },
  {
    image: '/placeholders/project-whole-home.svg',
    kicker: 'Whole Home',
    title: 'Project 04',
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

    <section className="brand-stone pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h1 className="display-serif inner-hero-title mt-5 max-w-[10ch]">
              Selected work,
              <span className="block italic text-[#e0c89e]">presented with restraint.</span>
            </h1>
          </div>
          <p className="max-w-xl text-[17px] leading-8 text-white/88 sm:text-[18px] lg:justify-self-end">
            A portfolio should make the standard visible. The final Linart photography will live here at full scale, with concise project information and room for the work to lead.
          </p>
        </div>
      </div>
    </section>

    <section className="lux-light-section bg-[#f3eee5] section-shell">
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
                  <span className="text-[13px] font-bold tracking-[0.13em] text-[#504a43]">0{index + 1}</span>
                </div>
                <h2 className="display-serif mt-4 text-5xl leading-none sm:text-6xl">{project.title}</h2>
                <p className="mt-5 text-[14px] font-bold uppercase tracking-[0.095em] text-[#47423c]">{project.location}</p>
                <p className="mt-3 max-w-lg text-[17px] leading-8 text-[#393631]">{project.scope}</p>
                <div className="mt-8 text-[13px] font-bold uppercase tracking-[0.10em] text-[#735024]">
                  Temporary photography placeholder
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="lux-cta-panel brand-stone section-shell-tight text-white">
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
