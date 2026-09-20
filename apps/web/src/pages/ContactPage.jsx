import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Check,
  Copy,
  Hammer,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';

const interestOptions = [
  'New Custom Home Construction',
  'Home Additions',
  'Whole Home Renovations',
  'Kitchen Renovations',
  'Bathroom Renovations',
  'Basement Finishing',
  'Outdoor Living / Decks / Patios',
  'Exterior Improvements',
  'Other',
];

const initial = {
  name: '',
  email: '',
  phone: '',
  city: '',
  service: 'New Custom Home Construction',
  timing: 'Planning / researching',
  contact: 'Phone',
  interests: [],
  message: '',
};

const ContactPage = () => {
  const [form, setForm] = useState(initial);
  const [copyStatus, setCopyStatus] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const honeypot = useRef('');
  const resultRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (status === 'sent') resultRef.current?.focus();
    if (status === 'error') errorRef.current?.focus();
  }, [status]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const projectBrief = `Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
City / ZIP: ${form.city}
Project type: ${form.service}
Timing: ${form.timing}
Preferred contact: ${form.contact}
Services interested in: ${form.interests.length ? form.interests.join(', ') : 'Not specified'}

Project description:
${form.message}`;

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setError('');
    setFieldErrors({});
    setCopyStatus('');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch('/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company: honeypot.current }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus('sent');
        return;
      }

      setFieldErrors(data.fields || {});
      setError(data.error || 'Something went wrong sending your message.');
      setStatus('error');
    } catch (requestError) {
      setError(
        requestError.name === 'AbortError'
          ? 'The request took too long. Call 609-209-7810, or copy the brief below and email it to us.'
          : 'We could not reach the server. Call 609-209-7810, or copy the brief below and email it to us.',
      );
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const emailFallback = () => {
    const subject = encodeURIComponent(`Linart project inquiry — ${form.service} — ${form.city || 'NJ'}`);
    window.location.href = `mailto:services@linartinc.com?subject=${subject}&body=${encodeURIComponent(projectBrief)}`;
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(projectBrief);
      setCopyStatus('Project brief copied');
    } catch {
      setCopyStatus('Copy unavailable—select Email Project Brief instead');
    }
  };

  const fieldError = (key) =>
    fieldErrors[key] ? (
      <span id={`${key}-error`} className="mt-2 block text-[13px] font-medium text-[#8c2f22]">
        {fieldErrors[key]}
      </span>
    ) : null;

  const errorAttributes = (key) => ({
    'aria-invalid': fieldErrors[key] ? 'true' : undefined,
    'aria-describedby': fieldErrors[key] ? `${key}-error` : undefined,
  });

  const inputClass =
    'mt-2 w-full rounded-[6px] border border-black/18 bg-white/72 px-4 py-3.5 text-[16px] font-medium text-[#22262a] outline-none transition-colors placeholder:text-black/32 focus:border-[#9b7b4f] focus:ring-2 focus:ring-[#9b7b4f]/10';

  return (
    <>
      <section className="lux-light-section bg-[#f7f4ed] pb-16 pt-32 sm:pt-36">
        <div className="site-container">
          <div className="grid gap-12 xl:grid-cols-[0.39fr_0.61fr] xl:gap-14">
            <aside className="self-start">
              <div className="flex items-center gap-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#a1753e]">Get in touch</p>
                <span className="h-px w-40 bg-[#b8925d]/55" />
              </div>

              <h1 className="display-serif mt-5 max-w-[9ch] text-[clamp(3.5rem,6vw,6.2rem)] leading-[0.92] tracking-[-0.04em] text-[#15181a]">
                Let’s Build What’s Next
              </h1>

              <p className="mt-6 max-w-xl text-[17px] leading-8 text-[#56504a]">
                Have a project in mind? We’d love to hear about it. Tell us what you’re planning and our team will get back to you promptly. Whether it’s a home addition, renovation, or new custom home, we’re here to help bring your vision to life.
              </p>

              <a href="tel:6092097810" className="mt-5 flex items-center gap-3 text-[18px] font-semibold text-[#17191b]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c49c5d] text-black"><Phone size={16} /></span>
                609-209-7810
              </a>

              <a href="mailto:services@linartinc.com" className="mt-3 flex items-center gap-3 text-[16px] font-medium text-[#2d3032] hover:text-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c49c5d] text-black"><Mail size={16} /></span>
                services@linartinc.com
              </a>

              <div className="mt-6 border-t hairline pt-5">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#46413c]">What helps</p>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] leading-7 text-[#4a4540] marker:text-[#a1753e]">
                  <li>Municipality or ZIP</li>
                  <li>Type of project</li>
                  <li>Approximate timing</li>
                  <li>A short description of the work</li>
                </ul>
              </div>

              <img
                src="/branding/linart-premium-contact-card.webp"
                alt="Linart Construction Inc. premium brand mark"
                className="mt-8 aspect-square w-full max-w-[540px] object-cover shadow-[0_22px_60px_rgba(33,27,20,.16)]"
                loading="lazy"
                decoding="async"
              />
            </aside>

            {status === 'sent' ? (
              <div ref={resultRef} tabIndex={-1} className="self-start rounded-[20px] border border-black/10 bg-white/70 p-8 shadow-[0_22px_70px_rgba(46,37,27,.08)] outline-none sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2f5d3f] text-white">
                  <Check size={22} />
                </div>
                <h2 className="display-serif mt-6 text-4xl leading-none sm:text-5xl">Your project inquiry is in.</h2>
                <p className="body-copy mt-5 max-w-xl">
                  Thank you{form.name ? `, ${form.name.split(' ')[0]}` : ''}. We have your details and will follow up by {form.contact.toLowerCase()}, usually within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(initial);
                    setStatus('idle');
                    setCopyStatus('');
                    setError('');
                    setFieldErrors({});
                    honeypot.current = '';
                  }}
                  className="link-arrow mt-8 text-[#0b0d10]"
                >
                  Send another inquiry <ArrowUpRight size={15} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                aria-busy={status === 'sending'}
                className="self-start rounded-[20px] border border-black/12 bg-white/52 p-6 shadow-[0_22px_70px_rgba(46,37,27,.08)] backdrop-blur-sm sm:p-8 lg:p-10"
              >
                <div className="flex flex-col gap-3 border-b hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="display-serif text-3xl leading-none sm:text-4xl">Project Inquiry</h2>
                  <div className="flex items-center gap-4">
                    <span className="hidden h-px w-28 bg-[#b8925d]/50 sm:block" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6a6259]">Tell us about your project</span>
                  </div>
                </div>

                <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Company
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      onChange={(e) => {
                        honeypot.current = e.target.value;
                      }}
                    />
                  </label>
                </div>

                <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
                  <label className="py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Name *</span>
                    <input required maxLength={120} autoComplete="name" name="name" value={form.name} onChange={change} className={inputClass} placeholder="Your full name" {...errorAttributes('name')} />
                    {fieldError('name')}
                  </label>

                  <label className="py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Email *</span>
                    <input required maxLength={180} autoComplete="email" type="email" name="email" value={form.email} onChange={change} className={inputClass} placeholder="you@example.com" {...errorAttributes('email')} />
                    {fieldError('email')}
                  </label>

                  <label className="py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Phone *</span>
                    <input required maxLength={60} autoComplete="tel" inputMode="tel" type="tel" name="phone" value={form.phone} onChange={change} className={inputClass} placeholder="(609) 123-4567" {...errorAttributes('phone')} />
                    {fieldError('phone')}
                  </label>

                  <label className="py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Preferred Contact Method *</span>
                    <select name="contact" value={form.contact} onChange={change} className={inputClass} {...errorAttributes('contact')}>
                      <option>Phone</option>
                      <option>Email</option>
                      <option>Text</option>
                    </select>
                    {fieldError('contact')}
                  </label>

                  <label className="py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Project Type *</span>
                    <select name="service" value={form.service} onChange={change} className={inputClass} {...errorAttributes('service')}>
                      <option>New Custom Home Construction</option>
                      <option>Home Addition</option>
                      <option>Whole-Home Renovation</option>
                      <option>Kitchen Remodeling</option>
                      <option>Bathroom Remodeling</option>
                      <option>Basement Finishing</option>
                      <option>Deck / Patio Construction</option>
                      <option>Other Residential Work</option>
                    </select>
                    {fieldError('service')}
                  </label>

                  <label className="py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Timing *</span>
                    <select name="timing" value={form.timing} onChange={change} className={inputClass} {...errorAttributes('timing')}>
                      <option>Planning / researching</option>
                      <option>Within 3 months</option>
                      <option>3–6 months</option>
                      <option>6–12 months</option>
                      <option>12+ months</option>
                    </select>
                    {fieldError('timing')}
                  </label>

                  <label className="py-3 sm:col-span-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Service Areas / Municipality or ZIP *</span>
                    <input required maxLength={120} autoComplete="postal-code" name="city" value={form.city} onChange={change} className={inputClass} placeholder="Town, city, or ZIP code" {...errorAttributes('city')} />
                    {fieldError('city')}
                  </label>
                </div>

                <fieldset className="mt-4">
                  <legend className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Services Interested In (Check All That Apply)</legend>
                  <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                    {interestOptions.map((interest) => (
                      <label key={interest} className="flex cursor-pointer items-start gap-3 text-[13px] leading-5 text-[#3f3b36]">
                        <input
                          type="checkbox"
                          checked={form.interests.includes(interest)}
                          onChange={() => toggleInterest(interest)}
                          className="mt-0.5 h-4 w-4 rounded border-black/25 accent-[#9b7339]"
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="mt-6 block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Project Description *</span>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={change}
                    minLength={10}
                    maxLength={1000}
                    rows="5"
                    className={`${inputClass} min-h-[128px] resize-none`}
                    placeholder="Tell us about your project, your goals, and any specific details..."
                    {...errorAttributes('message')}
                  />
                  <div className="mt-1 flex items-start justify-between gap-4">
                    <div>{fieldError('message')}</div>
                    <span className="text-[11px] text-[#777067]">{form.message.length}/1000</span>
                  </div>
                </label>

                {status === 'error' && error && (
                  <div
                    ref={errorRef}
                    tabIndex={-1}
                    role="alert"
                    className="mt-5 flex items-start gap-3 border-l-2 border-[#8c2f22] bg-[#8c2f22]/5 py-4 pl-4 text-[14px] leading-6 text-[#5f2118] outline-none"
                  >
                    <AlertCircle size={17} className="mt-1 shrink-0" />
                    <div>
                      <p>{error}</p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={copyBrief} className="premium-button premium-button-outline shrink-0">
                          {copyStatus === 'Project brief copied' ? <Check size={16} /> : <Copy size={16} />}
                          Copy Brief
                        </button>
                        <button type="button" onClick={emailFallback} className="premium-button premium-button-outline shrink-0">
                          Open Email App <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-5 border-t hairline pt-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-xl">
                    <p className="text-[12px] leading-5 text-[#555048]">
                      Your details go straight to our project inbox at <a className="font-semibold text-[#765326]" href="mailto:services@linartinc.com">services@linartinc.com</a>. We reply to every inquiry, usually within one business day.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="premium-button-dark shrink-0 disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    {status === 'sending' ? (
                      <>
                        Sending <Loader2 size={16} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Send Project Inquiry <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                <p aria-live="polite" className="mt-3 min-h-5 text-[12px] font-semibold text-[#765326]">{copyStatus}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0d10] text-white">
        <div className="site-container grid sm:grid-cols-2 xl:grid-cols-4">
          {[
            [ShieldCheck, 'Licensed & Insured', 'Your Project. Our Responsibility.'],
            [Hammer, 'Quality Craftsmanship', 'Built to Last.'],
            [MapPin, 'Local & Trusted', 'Proudly Serving New Jersey.'],
            [Building2, 'Residential & Commercial', 'Projects of Every Scale.'],
          ].map(([Icon, title, copy], index) => (
            <div key={title} className={`flex min-h-[118px] items-center gap-4 py-6 sm:px-6 ${index > 0 ? 'sm:border-l sm:border-white/12' : ''}`}>
              <Icon size={32} strokeWidth={1.5} className="shrink-0 text-[#d1ad72]" />
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#e3c998]">{title}</p>
                <p className="mt-1 text-[13px] text-white/65">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ContactPage;
