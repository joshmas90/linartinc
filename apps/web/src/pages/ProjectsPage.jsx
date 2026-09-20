import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ProjectImageGallery from '@/components/ProjectImageGallery';

const projects = [
  {
    images: [
      ['/images/projects/covered-porch/porch-main.webp', 'Completed covered porch with composite steps, white railing and finished gable'],
      ['/images/projects/covered-porch/porch-progress-01.webp', 'Covered porch wall and finish work in progress'],
      ['/images/projects/covered-porch/porch-progress-02.webp', 'Covered porch ceiling and open wall construction detail'],
      ['/images/projects/covered-porch/porch-exterior.webp', 'Exterior view of the covered porch and deck project'],
    ],
    kicker: 'Porch + Outdoor Living',
    title: 'Covered Porch Build',
    location: 'New Jersey',
    scope: 'Composite decking · Wood ceiling · Exterior integration · Finish carpentry',
    stage: 'Process + detail views',
    size: 'large',
  },
  {
    images: [
      ['/images/projects/kitchen/kitchen-main.webp', 'Completed white kitchen with subway tile, farmhouse sink and hardwood floors'],
      ['/images/projects/kitchen/kitchen-sink-detail.webp', 'White shaker cabinetry and farmhouse sink beneath wide kitchen windows'],
      ['/images/projects/kitchen/kitchen-cabinetry.webp', 'Full kitchen cabinetry run with dark counters and stone backsplash'],
      ['/images/projects/kitchen/kitchen-progress.webp', 'Kitchen cabinetry and flooring installation in progress'],
    ],
    kicker: 'Kitchen + Interior',
    title: 'Open Concept Kitchen Renovation',
    location: 'New Jersey',
    scope: 'Cabinetry · Flooring · Lighting · Backsplash · Open-concept living space',
    stage: 'Finished + progress views',
    size: 'small',
  },
  {
    images: [
      ['/images/projects/bathroom/bathroom-vanity-shower.webp', 'Custom wood vanity beside a glass shower enclosure'],
      ['/images/projects/bathroom/bath-main.webp', 'Finished modern bathroom with freestanding tub and black hexagonal tile'],
      ['/images/projects/bathroom/bathroom-shower-detail.webp', 'Walk-in shower with white tile, patterned floor and matte-black fixtures'],
      ['/images/projects/bathroom/bath-detail-01.webp', 'Modern bathroom vanity, freestanding tub and window detail'],
      ['/images/projects/bathroom/bath-detail-02.webp', 'Modern walk-in shower with white tile and black fixtures'],
      ['/images/projects/bathroom/bath-detail-03.webp', 'Completed modern bathroom viewed from the entry'],
      ['/images/projects/bathroom/bathroom-overview-b.webp', 'Completed bathroom viewed from the entry with shower and vanity'],
    ],
    kicker: 'Bathroom + Tile',
    title: 'Modern Bathroom Renovation',
    location: 'New Jersey',
    scope: 'Freestanding tub · Walk-in shower · Tile · Fixtures · Finish work',
    stage: 'Completed views',
    size: 'small',
  },
  {
    images: [
      ['/images/projects/addition/addition-main.webp', 'Residential addition framing connected to an existing home'],
      ['/images/projects/addition/addition-progress-01.webp', 'Early wall framing stage for a residential addition'],
      ['/images/projects/addition/addition-progress-02.webp', 'Framing crew working on a residential addition'],
      ['/images/projects/addition/addition-progress-03.webp', 'Roof framing stage of a residential addition'],
    ],
    kicker: 'Ground-Up Building + Expansion',
    title: 'New Home Construction + Additions',
    location: 'New Jersey',
    scope: 'Site preparation · Structural framing · Roof systems · Exterior integration',
    stage: 'Framing + structural sequence',
    size: 'large',
  },
  {
    images: [
      ['/images/projects/elevated-deck/deck-main.webp', 'Elevated deck addition attached to a brick home'],
      ['/images/projects/elevated-deck/deck-progress.webp', 'Elevated deck structure and lower covered area during construction'],
      ['/images/projects/elevated-deck/deck-detail-01.webp', 'Composite deck surface with cable railing detail'],
      ['/images/projects/elevated-deck/deck-detail-02.webp', 'Finished deck surface and cable railing overlooking the yard'],
    ],
    kicker: 'Deck + Exterior',
    title: 'Elevated Outdoor Living',
    location: 'New Jersey',
    scope: 'Elevated structure · Composite decking · Cable rail · Covered lower level',
    stage: 'Build + detail views',
    size: 'large',
  },
  {
    images: [
      ['/images/projects/custom-decks/custom-deck-main.webp', 'Finished custom composite deck with white posts and black balusters'],
      ['/images/projects/custom-decks/custom-deck-exterior.webp', 'Custom deck exterior with white rail system and gray composite decking'],
      ['/images/projects/custom-decks/custom-deck-stairs.webp', 'Composite deck stairs with white posts and black metal balusters'],
      ['/images/projects/custom-decks/custom-deck-waterfront.webp', 'Large wood deck overlooking a waterfront property'],
    ],
    kicker: 'Custom Decks + Outdoor Living',
    title: 'Custom Decks & Outdoor Living',
    location: 'New Jersey',
    scope: 'Composite and wood decking Â· Custom rail systems Â· Stairs Â· Structural framing Â· Exterior integration',
    stage: 'Finished builds + detail views',
    size: 'large',
  },
  {
    images: [
      ['/images/projects/hardscape/hardscape-pool-main.webp', 'Custom paver pool surround with integrated deck access and finished waterline'],
      ['/images/projects/hardscape/hardscape-pool-wide.webp', 'Wide view of a custom paver pool deck with curved spa and contrasting border'],
      ['/images/projects/hardscape/hardscape-pool-sunset.webp', 'Panoramic view of a custom paver pool surround at sunset'],
      ['/images/projects/hardscape/hardscape-brick-walk.webp', 'Curved reclaimed-brick walkway with contrasting border through a landscaped side yard'],
      ['/images/projects/hardscape/hardscape-brick-steps.webp', 'Rebuilt brick entry steps and landing with clean mortar joints'],
      ['/images/projects/hardscape/hardscape-concrete-flatwork.webp', 'New concrete flatwork and slab installation beside a residential exterior'],
    ],
    kicker: 'Pavers + Masonry + Hardscape',
    title: 'Custom Hardscapes & Masonry',
    location: 'New Jersey',
    scope: 'Pool decks Â· Interlocking pavers Â· Brick walks Â· Masonry steps Â· Concrete flatwork',
    stage: 'Finished work + installation views',
    size: 'large',
  },
];

const ProjectsPage = () => (
  <>

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
            A portfolio should make the standard visible. These Linart projects show completed spaces, open-concept renovations, new-home and addition framing, custom decks, masonry and outdoor hardscapes, and the work behind the finished result.
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
              <ProjectImageGallery
                images={project.images}
                size={project.size}
                priority={index === 0}
              />

              <div className={`${index % 2 ? 'lg:order-first lg:pr-10' : 'lg:pl-10'} border-t hairline pt-5`}>
                <div className="flex items-center justify-between">
                  <p className="eyebrow">{project.kicker}</p>
                  <span className="text-[13px] font-bold tracking-[0.13em] text-[#504a43]">0{index + 1}</span>
                </div>
                <h2 className="display-serif mt-4 text-5xl leading-none sm:text-6xl">{project.title}</h2>
                <p className="mt-5 text-[14px] font-bold uppercase tracking-[0.095em] text-[#47423c]">{project.location}</p>
                <p className="mt-3 max-w-lg text-[17px] leading-8 text-[#393631]">{project.scope}</p>
                <div className="mt-8 text-[13px] font-bold uppercase tracking-[0.10em] text-[#735024]">{project.stage}</div>
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
