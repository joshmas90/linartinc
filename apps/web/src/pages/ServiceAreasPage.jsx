import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceAreasPage = () => {
  const serviceAreas = {
    'North Jersey': [
      'Bergen County',
      'Essex County',
      'Hudson County',
      'Morris County',
      'Passaic County',
      'Sussex County',
      'Warren County'
    ],
    'Central Jersey': [
      'Hunterdon County',
      'Mercer County',
      'Middlesex County',
      'Monmouth County',
      'Somerset County',
      'Union County'
    ],
    'South Jersey': [
      'Atlantic County',
      'Burlington County',
      'Camden County',
      'Cape May County',
      'Cumberland County',
      'Gloucester County',
      'Ocean County',
      'Salem County'
    ],
    'Surrounding Areas': [
      'Parts of Pennsylvania',
      'Parts of New York',
      'Contact us for specific locations'
    ]
  };

  return (
    <>
      <Helmet>
        <title>Service Areas - Linart Construction Inc.</title>
        <meta name="description" content="Linart Construction serves New Jersey and surrounding areas with expert residential remodeling services. Check if we serve your area." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 bg-charcoal text-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Service Areas</h1>
            <p className="text-xl text-slate-gray max-w-3xl mx-auto">
              Proudly serving homeowners throughout New Jersey and surrounding areas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Coverage Section */}
      <section className="py-16 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 bg-deep-blue/10 px-6 py-3 rounded-full mb-6">
              <MapPin className="text-deep-blue" size={24} />
              <span className="text-deep-blue font-semibold text-lg">New Jersey & Beyond</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">Where We Work</h2>
            <p className="text-lg text-slate-gray max-w-3xl mx-auto">
              With over 20 years of experience serving the New Jersey community, we've built lasting relationships throughout the state. Our team is committed to providing exceptional residential remodeling services wherever you call home.
            </p>
          </motion.div>

          {/* Service Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {Object.entries(serviceAreas).map(([region, counties], index) => (
              <motion.div
                key={region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-charcoal mb-6">{region}</h3>
                <ul className="space-y-3">
                  {counties.map((county) => (
                    <li key={county} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-deep-blue flex-shrink-0 mt-1" />
                      <span className="text-slate-gray">{county}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Expertise Section */}
      <section className="py-16 bg-charcoal text-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Local Expertise You Can Trust</h2>
              <div className="space-y-4 text-slate-gray">
                <p className="text-lg leading-relaxed">
                  As a New Jersey-based company, we understand the unique architectural styles, building codes, and permit requirements specific to each region. Our deep familiarity with local regulations ensures smooth, compliant project execution.
                </p>
                <p className="text-lg leading-relaxed">
                  We've built strong relationships with local suppliers and subcontractors, allowing us to source quality materials efficiently and complete projects on schedule. Our reputation in the community speaks to our commitment to excellence.
                </p>
                <p className="text-lg leading-relaxed">
                  Whether you're in a historic neighborhood in Princeton or a modern development in Jersey City, we bring the same dedication and expertise to every project, no matter the location.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-gray/10 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Why Choose Local?</h3>
              <ul className="space-y-4">
                {[
                  'Familiarity with local building codes and permits',
                  'Knowledge of regional architectural styles',
                  'Established relationships with quality suppliers',
                  'Quick response times for consultations',
                  'Understanding of local climate considerations',
                  'Community reputation and accountability'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-deep-blue flex-shrink-0 mt-1" />
                    <span className="text-slate-gray">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Don't See Your Area Section */}
      <section className="py-16 bg-warm-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
              Don't See Your Area Listed?
            </h2>
            <p className="text-lg text-slate-gray mb-8">
              We're always looking to expand our service areas. Contact us to discuss your project location and we'll let you know if we can help bring your remodeling vision to life.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-deep-blue text-warm-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Us About Your Location
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Service Commitment */}
      <section className="py-16 bg-deep-blue text-warm-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Service Commitment</h2>
            <p className="text-xl leading-relaxed">
              No matter where you're located within our service area, you'll receive the same exceptional quality, professionalism, and attention to detail that has made Linart Construction a trusted name in residential remodeling for over 20 years.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServiceAreasPage;