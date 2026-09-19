import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Kitchen Remodels', 'Bathroom Renovations', 'Additions', 'Basement Finishing', 'Whole-Home'];

  const projects = [
    {
      id: 1,
      title: 'Kitchen Remodel in Princeton',
      category: 'Kitchen Remodels',
      image: 'https://images.unsplash.com/photo-1594297270189-4056091ab583',
      description: 'Modern kitchen transformation with custom cabinetry and quartz countertops'
    },
    {
      id: 2,
      title: 'Bathroom Renovation in Newark',
      category: 'Bathroom Renovations',
      image: 'https://images.unsplash.com/photo-1701250421566-a6ef7ce9bc40',
      description: 'Luxurious spa-like bathroom with walk-in shower and heated floors'
    },
    {
      id: 3,
      title: 'Home Addition in Montclair',
      category: 'Additions',
      image: 'https://images.unsplash.com/photo-1650018984119-8a3fa781fa19',
      description: 'Two-story addition featuring master suite and home office'
    },
    {
      id: 4,
      title: 'Basement Finishing in Jersey City',
      category: 'Basement Finishing',
      image: 'https://images.unsplash.com/photo-1539378404613-121bbd5e4b55',
      description: 'Entertainment space with custom bar and home theater'
    },
    {
      id: 5,
      title: 'Contemporary Kitchen in Summit',
      category: 'Kitchen Remodels',
      image: 'https://images.unsplash.com/photo-1594297270189-4056091ab583',
      description: 'Sleek contemporary design with waterfall island and smart appliances'
    },
    {
      id: 6,
      title: 'Master Bath in Hoboken',
      category: 'Bathroom Renovations',
      image: 'https://images.unsplash.com/photo-1701250421566-a6ef7ce9bc40',
      description: 'Elegant master bathroom with soaking tub and dual vanities'
    },
    {
      id: 7,
      title: 'Sunroom Addition in Madison',
      category: 'Additions',
      image: 'https://images.unsplash.com/photo-1650018984119-8a3fa781fa19',
      description: 'Bright sunroom addition with panoramic windows'
    },
    {
      id: 8,
      title: 'Whole-Home Renovation in Westfield',
      category: 'Whole-Home',
      image: 'https://images.unsplash.com/photo-1507955378777-934d1d6635af',
      description: 'Complete home transformation with modern updates throughout'
    }
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Our Projects - Linart Construction Inc.</title>
        <meta name="description" content="View our portfolio of completed residential remodeling projects including kitchen remodels, bathroom renovations, home additions, and basement finishing in New Jersey." />
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Our Projects</h1>
            <p className="text-xl text-slate-gray max-w-3xl mx-auto">
              Explore our portfolio of completed residential remodeling projects throughout New Jersey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 bg-warm-white border-b border-slate-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-deep-blue text-warm-white shadow-lg'
                    : 'bg-white text-charcoal hover:bg-slate-gray/10 shadow'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-16 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedImage(project)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-warm-white text-sm">{project.description}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-charcoal mb-2">{project.title}</h3>
                    <span className="inline-block bg-deep-blue/10 text-deep-blue px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-warm-white hover:text-deep-blue transition-colors duration-200"
              >
                <X size={32} />
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full rounded-xl shadow-2xl"
              />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-warm-white mb-2">{selectedImage.title}</h3>
                <p className="text-slate-gray">{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsPage;