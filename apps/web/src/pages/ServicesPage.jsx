import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      title: 'Home Additions',
      description: 'Expand your square footage without moving. Whether you need a master suite addition, a second-story extension, or a larger family room, we manage the entire structural and finishing process.',
      problemSolved: 'Perfect for growing families who love their neighborhood but have outgrown their current house.',
      image: 'https://images.unsplash.com/photo-1650018984119-8a3fa781fa19'
    },
    {
      title: 'Kitchen Remodeling',
      description: 'We renovate kitchens to improve workflow, storage, and style. Our team handles demolition, plumbing, electrical, cabinet installation, and custom countertops to create a durable, beautiful kitchen.',
      problemSolved: 'Solves issues with cramped layouts, outdated appliances, and insufficient storage space.',
      image: 'https://images.unsplash.com/photo-1694678902977-e1ad83139572'
    },
    {
      title: 'Bathroom Remodeling',
      description: 'From hall baths to luxury master spas, we specialize in watertight, high-quality bathroom renovations. We install new vanities, tile showers, soaking tubs, and modern fixtures.',
      problemSolved: 'Fixes water damage risks, outdated designs, and poor functionality in older bathrooms.',
      image: 'https://images.unsplash.com/photo-1618836003104-ec6d67239040'
    },
    {
      title: 'Basement Finishing',
      description: 'Transform your cold, concrete basement into a warm, inviting living area. We frame, insulate, and finish basements to create home theaters, gyms, offices, or playrooms.',
      problemSolved: 'Maximizes the usable space in your home by converting neglected storage areas into functional rooms.',
      image: 'https://images.unsplash.com/photo-1539378404613-121bbd5e4b55'
    },
    {
      title: 'Full Home Renovations',
      description: 'Comprehensive gut renovations for older homes. We update systems (HVAC, electric, plumbing) while preserving character, or completely modernize the interior layout.',
      problemSolved: 'Ideal for fixer-upper purchases or revitalizing an aging family property.',
      image: 'https://images.unsplash.com/photo-1507955378777-934d1d6635af'
    },
    {
      title: 'Structural Remodeling',
      description: 'Expert removal of load-bearing walls, beam installation, and structural repairs. We ensure the integrity of your home while opening up floor plans.',
      problemSolved: 'Enables open-concept living in older, compartmented homes safely and legally.',
      image: 'https://images.unsplash.com/photo-1682697285306-9bf98aa0100d'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - Residential Remodeling NJ</title>
        <meta name="description" content="Expert residential services: Home additions, kitchen & bathroom remodeling, basement finishing, and structural renovations in New Jersey." />
      </Helmet>

      {/* Header */}
      <section className="bg-charcoal text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Professional craftsmanship for every room in your house.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold text-charcoal">{service.title}</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {service.description}
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-deep-blue shadow-sm">
                  <p className="text-slate-600 italic">
                    <span className="font-bold text-deep-blue not-italic block mb-1">Why Choose This:</span>
                    "{service.problemSolved}"
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-semibold text-charcoal mb-2 uppercase tracking-wide"></p>
                  <p className="text-slate-600"></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-deep-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't settle for a contractor who cuts corners. Choose experience and quality.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-deep-blue px-8 py-4 rounded-lg text-lg font-bold hover:bg-slate-100 transition-all duration-200 shadow-lg"
          >
            Request a Free Estimate <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;