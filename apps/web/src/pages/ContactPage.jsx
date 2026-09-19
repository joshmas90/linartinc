import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Phone, ArrowUpRight } from 'lucide-react';

const initial = {
  name: '',
  email: '',
  phone: '',
  city: '',
  service: 'Home Addition',
  timing: 'Planning / researching',
  contact: 'Phone',
  message: '',
};

const ContactPage = () => {
  const [form, setForm] = useState(initial);

  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Linart project inquiry — ${form.service} — ${form.city || 'NJ'}`);
    const body = encodeURIComponent(
`Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
City / ZIP: ${form.city}
Project type: ${form.service}
Timing: ${form.timing}
Preferred contact: ${form.contact}

Project description:
${form.message}`
    );
    window.location.href = `mailto:services@linartinc.com?subject=${subject}&body=${body}`;
  };

  const inputClass =
    'w-full border-0 border-b border-black/28 bg-transparent px-0 py-3.5 text-[17px] font-medium text-[#22262a] outline-none transition-colors placeholder:text-black/30 focus:border-[#9b7b4f] focus:ring-0';

  return (
    <>
      <Helmet>
        <title>Start a Project | Linart Construction Inc.</title>
        <meta name="description" content="Contact Linart Construction Inc. about a residential addition, renovation or remodeling project in New Jersey." />
      </Helmet>

      <section className="brand-stone pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
        <div className="site-container">
          <p className="eyebrow">Project Inquiry</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <h1 className="display-serif inner-hero-title max-w-[10ch]">
              Tell us what
              <span className="block italic text-[#e0c89e]">you’re planning.</span>
            </h1>
            <p className="max-w-xl text-[17px] leading-8 text-white/88 sm:text-[18px]">
              The first conversation is about fit: where the project is, what you want to change, your timing and the level of work involved.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee5] section-shell">
        <div className="site-container">
          <div className="grid gap-14 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20">
            <aside>
              <p className="eyebrow">Direct Contact</p>
              <a href="tel:6092097810" className="mt-5 flex items-center gap-3 text-xl font-semibold">
                <Phone size={18} className="text-[#a97f47]" /> 609-209-7810
              </a>
              <a href="mailto:services@linartinc.com" className="mt-4 flex items-center gap-3 text-[16px] font-medium text-[#3f3a35] hover:text-black">
                <Mail size={17} className="text-[#a97f47]" /> services@linartinc.com
              </a>

              <div className="mt-10 border-t hairline pt-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#514b44]">What helps</p>
                <ul className="mt-4 space-y-3 text-[16px] leading-8 text-[#3f3a35]">
                  <li>• Municipality or ZIP</li>
                  <li>• Type of project</li>
                  <li>• Approximate timing</li>
                  <li>• A short description of the work</li>
                </ul>
              </div>
            </aside>

            <form onSubmit={submit} className="border-t hairline">
              <div className="grid gap-x-8 sm:grid-cols-2">
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Name</span>
                  <input required name="name" value={form.name} onChange={change} className={inputClass} placeholder="Your name" />
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">City / ZIP</span>
                  <input required name="city" value={form.city} onChange={change} className={inputClass} placeholder="Project location" />
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Email</span>
                  <input required type="email" name="email" value={form.email} onChange={change} className={inputClass} placeholder="name@example.com" />
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Phone</span>
                  <input required type="tel" name="phone" value={form.phone} onChange={change} className={inputClass} placeholder="Phone number" />
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Project Type</span>
                  <select name="service" value={form.service} onChange={change} className={inputClass}>
                    <option>Home Addition</option>
                    <option>Whole-Home Renovation</option>
                    <option>Kitchen Remodeling</option>
                    <option>Bathroom Remodeling</option>
                    <option>Basement Finishing</option>
                    <option>Structural Remodeling</option>
                    <option>Other Residential Work</option>
                  </select>
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Timing</span>
                  <select name="timing" value={form.timing} onChange={change} className={inputClass}>
                    <option>Planning / researching</option>
                    <option>Within 3 months</option>
                    <option>3–6 months</option>
                    <option>6–12 months</option>
                    <option>12+ months</option>
                  </select>
                </label>
                <label className="py-5 sm:col-span-2">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Preferred Contact</span>
                  <select name="contact" value={form.contact} onChange={change} className={inputClass}>
                    <option>Phone</option>
                    <option>Email</option>
                    <option>Text</option>
                  </select>
                </label>
                <label className="py-5 sm:col-span-2">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Project Description</span>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={change}
                    rows="6"
                    className={`${inputClass} resize-none`}
                    placeholder="What are you looking to change?"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-4 border-t hairline pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-[14px] leading-6 text-[#49443e]">
                  This version opens your email application with the project brief pre-addressed to services@linartinc.com. A server-side submission can be added next.
                </p>
                <button type="submit" className="premium-button-dark shrink-0">
                  Email Project Brief <ArrowUpRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
