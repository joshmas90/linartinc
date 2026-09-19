import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Img from '@/components/Img';

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
    title: 'Connected Kitchen Renovation',
    location: 'New Jersey',
    scope: 'Cabinetry · Flooring · Lighting · Backsplash · Connected living space',
    stage: 'Finished + progress views',
    size: 'small',
  },
  {
    images: [
      ['/images/projects/bathroom/bath-main.webp', 'Finished bathroom with freestanding tub and black hexagonal tile'],
      ['/images/projects/bathroom/bath-detail-01.webp', 'Bathroom vanity, freestanding tub and window detail'],
      ['/images/projects/bathroom/bath-detail-02.webp', 'Walk-in shower with white tile and black fixtures'],
      ['/images/projects/bathroom/bath-detail-03.webp', 'Completed bathroom viewed from the entry'],
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
    kicker: 'Addition + Structure',
    title: 'Residential Addition Framing',
    location: 'New Jersey',
    scope: 'Site preparation · Structural framing · Roof integration · Exterior tie-in',
    stage: 'Construction sequence',
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
      ['/images/projects/patio/patio-finished.webp', 'Finished poured concrete patio beside a New Jersey home'],
      ['/images/projects/patio/patio-prep-01.webp', 'Excavated and compacted patio area before concrete placement'],
      ['/images/projects/patio/patio-prep-02.webp', 'Formed patio area prepared for a concrete pour'],
    ],
    kicker: 'Concrete + Hardscape',
    title: 'Poured Concrete Patio',
    location: 'New Jersey',
    scope: 'Excavation · Base preparation · Forming · Concrete placement',
    stage: 'Preparation + finished result',
    size: 'small',
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
            A portfolio should make the standard visible. These Linart projects show completed spaces, construction details and the work behind the finished result.
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
              <div>
                <div className={`project-frame ${project.size === 'large' ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
                  <Img
                    src={project.images[0][0]}
                    alt={project.images[0][1]}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {project.images.slice(1).map(([src, alt]) => (
                    <div key={src} className="project-frame aspect-[4/3]">
                      <Img src={src} alt={alt}
                        sizes="(min-width: 1024px) 16vw, 31vw"
                      />
                    </div>
                  ))}
                </div>
              </div>

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
