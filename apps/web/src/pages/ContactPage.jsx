import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, ArrowUpRight, Check, Copy, AlertCircle, Loader2 } from 'lucide-react';
import Img from '@/components/Img';

const initial = {
  name: '',
  email: '',
  phone: '',
  city: '',
  service: 'New Custom Home Construction',
  timing: 'Planning / researching',
  contact: 'Phone',
  message: '',
};

const ContactPage = () => {
  const [form, setForm] = useState(initial);
  const [copyStatus, setCopyStatus] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
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

  const projectBrief = `Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
City / ZIP: ${form.city}
Project type: ${form.service}
Timing: ${form.timing}
Preferred contact: ${form.contact}

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

  /** Only offered once the direct submission has failed — never as the primary path. */
  const emailFallback = () => {
    const subject = encodeURIComponent(`Linart project inquiry — ${form.service} — ${form.city || 'NJ'}`);
    window.location.href = `mailto:services@linartinc.com?subject=${subject}&body=${encodeURIComponent(projectBrief)}`;
  };

  const copyBrief = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(projectBrief);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = projectBrief;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
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
    'w-full border-0 border-b border-black/28 bg-transparent px-0 py-3.5 text-[17px] font-medium text-[#22262a] outline-none transition-colors placeholder:text-black/30 focus:border-[#9b7b4f] focus:ring-0';

  return (
    <>

      <section className="brand-stone pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
        <div className="site-container">
          <p className="eyebrow">Project Inquiry</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <h1 className="display-serif inner-hero-title max-w-[10ch]">
              Tell us what
              <span className="block italic text-[#e0c89e]">you’re planning.</span>
            </h1>
            <p className="max-w-xl text-[17px] leading-8 text-white/88 sm:text-[18px]">
              From a new custom home to a substantial renovation, the first conversation is about fit: location, scope, timing and the level of coordination involved.
            </p>
          </div>
        </div>
      </section>

      <section className="lux-light-section bg-[#f3eee5] section-shell">
        <div className="site-container">
          <div className="grid gap-14 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20">
            <aside className="self-start lg:sticky lg:top-28">
              <p className="eyebrow">Direct Contact</p>
              <a href="tel:6092097810" className="mt-5 flex items-center gap-3 text-xl font-semibold">
                <Phone size={18} className="text-[#a97f47]" /> 609-209-7810
              </a>
              <a href="mailto:services@linartinc.com" className="mt-4 flex items-center gap-3 text-[16px] font-medium text-[#3f3a35] hover:text-black">
                <Mail size={17} className="text-[#a97f47]" /> services@linartinc.com
              </a>

              <div className="mt-10 border-t hairline pt-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#514b44]">What helps</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-8 text-[#3f3a35] marker:text-[#a97f47]">
                  <li>Municipality or ZIP</li>
                  <li>Type of project</li>
                  <li>Approximate timing</li>
                  <li>A short description of the work</li>
                </ul>
              </div>

              <div className="relative mt-10 overflow-hidden border border-[#ad8653]/35 bg-[#0c0e11] px-7 py-9 shadow-[0_24px_70px_rgba(25,20,14,.16)] sm:px-9">
                <div className="pointer-events-none absolute inset-0 opacity-35" style={{ backgroundImage: 'linear-gradient(rgba(220,197,157,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(220,197,157,.08) 1px, transparent 1px), radial-gradient(circle at 20% 20%, rgba(173,134,83,.24), transparent 35%)', backgroundSize: '28px 28px, 28px 28px, auto' }} />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4 border-b border-[#d4bb91]/25 pb-5"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcc59d]">Linart · New Jersey</span><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">Est. 2004</span></div>
                  <img src="/branding/linart-logo-lockup.png" alt="Linart Construction Inc." className="mx-auto mt-8 w-full max-w-[390px] drop-shadow-[0_12px_30px_rgba(0,0,0,.35)]" loading="lazy" decoding="async" />
                  <div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-[#d4bb91] to-transparent" />
                  <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#dcc59d]">Build · Renovate · Expand</p>
                  <p className="mx-auto mt-3 max-w-sm text-center text-[14px] leading-6 text-white/66">Purposeful construction, disciplined coordination and a finish standard designed to hold up over time.</p>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-7 text-[#504a43]">One accountable point of contact from the first project conversation through closeout.</p>
            </aside>

            {status === 'sent' ? (
              <div ref={resultRef} tabIndex={-1} className="border-t hairline pt-10 outline-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2f5d3f] text-white">
                  <Check size={22} />
                </div>
                <h2 className="display-serif mt-6 text-4xl leading-none sm:text-5xl">Your project brief is in.</h2>
                <p className="body-copy mt-5 max-w-xl">
                  Thank you{form.name ? `, ${form.name.split(' ')[0]}` : ''}. We have your details and will follow up by{' '}
                  {form.contact.toLowerCase()}, usually within one business day. If the project is time-sensitive, call
                  609-209-7810 directly.
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
            <form onSubmit={submit} aria-busy={status === 'sending'} className="cream-panel relative rounded-[28px] border border-black/10 p-6 shadow-[0_22px_70px_rgba(46,37,27,.08)] sm:p-8 lg:p-10">
              <div className="mb-2 flex flex-col gap-4 border-b hairline pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Private Project Brief</p><h2 className="display-serif mt-4 text-4xl leading-none sm:text-5xl">Start with the essentials.</h2></div><p className="max-w-xs text-[13px] leading-6 text-[#5a534a]">Sent directly to <a className="font-bold text-[#765326] underline decoration-[#ad8653]/45 underline-offset-4" href="mailto:services@linartinc.com">services@linartinc.com</a>.</p></div>
              {/* Honeypot — hidden from people, tempting to bots. */}
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

              <div className="grid gap-x-8 sm:grid-cols-2">
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Name</span>
                  <input required maxLength={120} autoComplete="name" name="name" value={form.name} onChange={change} className={inputClass} placeholder="Your name" {...errorAttributes('name')} />
                  {fieldError('name')}
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">City / ZIP</span>
                  <input required maxLength={120} autoComplete="postal-code" name="city" value={form.city} onChange={change} className={inputClass} placeholder="Project location" {...errorAttributes('city')} />
                  {fieldError('city')}
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Email</span>
                  <input required maxLength={180} autoComplete="email" type="email" name="email" value={form.email} onChange={change} className={inputClass} placeholder="name@example.com" {...errorAttributes('email')} />
                  {fieldError('email')}
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Phone</span>
                  <input required maxLength={60} autoComplete="tel" inputMode="tel" type="tel" name="phone" value={form.phone} onChange={change} className={inputClass} placeholder="Phone number" {...errorAttributes('phone')} />
                  {fieldError('phone')}
                </label>
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Project Type</span>
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
                <label className="py-5">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Timing</span>
                  <select name="timing" value={form.timing} onChange={change} className={inputClass} {...errorAttributes('timing')}>
                    <option>Planning / researching</option>
                    <option>Within 3 months</option>
                    <option>3–6 months</option>
                    <option>6–12 months</option>
                    <option>12+ months</option>
                  </select>
                  {fieldError('timing')}
                </label>
                <label className="py-5 sm:col-span-2">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Preferred Contact</span>
                  <select name="contact" value={form.contact} onChange={change} className={inputClass} {...errorAttributes('contact')}>
                    <option>Phone</option>
                    <option>Email</option>
                    <option>Text</option>
                  </select>
                  {fieldError('contact')}
                </label>
                <label className="py-5 sm:col-span-2">
                  <span className="text-[13px] font-bold uppercase tracking-[0.11em] text-[#49433d]">Project Description</span>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={change}
                    minLength={10}
                    maxLength={6000}
                    rows="6"
                    className={`${inputClass} resize-none`}
                    placeholder="What are you looking to change?"
                    {...errorAttributes('message')}
                  />
                  {fieldError('message')}
                </label>
              </div>

              {status === 'error' && error && (
                <div
                  ref={errorRef}
                  tabIndex={-1}
                  role="alert"
                  className="mb-6 flex items-start gap-3 border-l-2 border-[#8c2f22] bg-[#8c2f22]/5 py-4 pl-4 text-[15px] leading-7 text-[#5f2118] outline-none"
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

              <div className="flex flex-col gap-5 border-t hairline pt-7 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-lg"><p className="text-[14px] leading-6 text-[#49443e]">Your details go straight to our project inbox at <a className="font-semibold text-[#765326] hover:text-black" href="mailto:services@linartinc.com">services@linartinc.com</a>. We reply to every inquiry, usually within one business day.</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b6257]"><span>Direct to Linart</span><span>Private inquiry</span><span>No mailing list</span></div></div>
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
                      Send Project Brief <ArrowUpRight size={16} />
                    </>
                  )}
                </button>
              </div>
              <p aria-live="polite" className="mt-3 min-h-6 text-[13px] font-semibold text-[#765326]">{copyStatus}</p>
            </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
