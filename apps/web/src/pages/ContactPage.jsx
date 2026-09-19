import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Phone, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Success simulation
    toast({
      title: "Request Sent Successfully!",
      description: "Thanks for contacting Linart Construction. We'll be in touch shortly.",
      variant: "default" 
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact Linart Construction - Free Estimates</title>
        <meta name="description" content="Contact us today for a free estimate on your residential remodeling project in New Jersey. Call 609-209-7810." />
      </Helmet>

      {/* Header */}
      <section className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-slate-300">
            Contact Linart Construction Inc. to discuss your project and request a free estimate.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Prominent Phone Number */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-10 text-center border border-slate-100">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Immediate Assistance</h2>
            <p className="text-slate-600 mb-6">Prefer to speak with someone right away?</p>
            <a 
              href="tel:6092097810" 
              className="inline-flex items-center gap-3 text-3xl font-bold text-deep-blue hover:text-blue-700 transition-colors"
            >
              <Phone size={32} />
              609-209-7810
            </a>
            <p className="text-sm text-slate-500 mt-4 font-semibold uppercase tracking-wider">Free Estimates Available</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-blue focus:border-transparent transition-all"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-blue focus:border-transparent transition-all"
                    placeholder="609-209-7810"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-blue focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-blue focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project (e.g., Kitchen Remodel, Home Addition...)"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-deep-blue text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Request Free Estimate
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;