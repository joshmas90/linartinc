import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Clock, Home } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Linart Construction Inc. - Family Owned Since 2004</title>
        <meta name="description" content="Learn about Linart Construction Inc., a family-owned residential remodeling contractor serving New Jersey since 2004 with 80+ years of combined experience." />
      </Helmet>

      {/* Header */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">Our Story</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Honest work. Quality materials. A family business built on reputation.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <h2 className="text-3xl font-bold text-charcoal mb-4">Family-Owned & Operated Since 2004</h2>
              <p>
                Linart Construction Inc. was founded in 2004 with a clear mission: to provide New Jersey homeowners with a reliable, skilled, and honest partner for their renovation needs. We aren't a massive corporate franchise. We are a family-owned business that lives and works in the same communities you do.
              </p>
              <p>
                Over the last two decades, we have focused exclusively on residential projects. We understand that remodeling isn't just about lumber and drywall—it's about respecting your home, minimizing disruption to your daily life, and delivering a finished product that stands the test of time.
              </p>
              <p>
                When you hire Linart Construction, you are hiring a team that takes personal pride in every nail driven and every tile laid. We don't cut corners because our family name is on the line.
              </p>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
                <h3 className="font-bold text-charcoal mb-4 text-xl">Why Homeowners Trust Us</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-deep-blue mt-1" size={20} />
                    <span><strong>Family-Owned Since 2004:</strong> Stability and accountability you can count on.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-deep-blue mt-1" size={20} />
                    <span><strong>Residential Specialists:</strong> We know homes inside and out.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-deep-blue mt-1" size={20} />
                    <span><strong>Serving NJ Homeowners:</strong> Local expertise in NJ building codes and styles.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <img
                src="https://images.unsplash.com/photo-1682697285306-9bf98aa0100d"
                alt="Construction team reviewing plans"
                className="w-full rounded-xl shadow-lg"
              />
              
              <div className="bg-charcoal text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Our Experience by the Numbers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <Clock className="text-blue-400" size={32} />
                    <div>
                      <div className="text-3xl font-bold">80+</div>
                      <div className="text-slate-400 text-sm">Years Combined Experience</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Home className="text-blue-400" size={32} />
                    <div>
                      <div className="text-3xl font-bold">2004</div>
                      <div className="text-slate-400 text-sm">Year Established</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Commitment */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-charcoal mb-6">Our Commitment to You</h2>
          <p className="text-xl text-slate-700 leading-relaxed mb-8">
            We believe that good communication is just as important as good carpentry. From our first meeting to the final walkthrough, we keep you informed. No hidden fees, no surprise delays, just honest work done right.
          </p>
          <div className="flex justify-center">
            <Users size={48} className="text-deep-blue" />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;