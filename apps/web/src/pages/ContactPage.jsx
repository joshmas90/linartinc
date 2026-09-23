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

const PROJECT_INBOX = 'services@linartinc.com';

const initial = {
  name: '',
  email: '',
  phone: '',
  city: '',
  service: 'New Custom Home Construction',
  timing: '',
  contact: 'Phone',
  message: '',
};

const ContactPage = () => {
  const [form, setForm] = useState(initial);
  const [copyStatus, setCopyStatus] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const honeypot = useRef('');
  const inquiryKey = useRef(crypto.randomUUID());
  const [deliveryUncertain, setDeliveryUncertain] = useState(false);
  const statusDialogRef = useRef(null);
  const formRef = useRef(null);

  const feedbackOpen = status !== 'idle';

  useEffect(() => {
    if (!feedbackOpen) return undefined;

    statusDialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && status !== 'sending') {
        setStatus('idle');
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [feedbackOpen, status]);

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

  const validateClient = () => {
    const next = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = form.phone.replace(/\D/g, '');

    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!emailPattern.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (phoneDigits.length < 10) next.phone = 'Please enter a phone number with at least 10 digits.';
    if (!form.city.trim()) next.city = 'Please enter the project city or ZIP.';

    setFieldErrors(next);

    if (Object.keys(next).length) {
      setError('Please review the highlighted fields before we send your project inquiry.');
      setStatus('validation');
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (deliveryUncertain) { setError('Delivery is unconfirmed. Contact LINART before sending again to avoid a duplicate inquiry.'); setStatus('error'); return; }
    if (!validateClient()) return;

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
        body: JSON.stringify({ ...form, request_id: inquiryKey.current, company: honeypot.current }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus('sent');
        return;
      }

      if (res.status >= 500 || res.status === 409 || (!data.fields && !data.error)) setDeliveryUncertain(true);
      const responseFields = data.fields || {};
      setFieldErrors(responseFields);
      setError(data.error || 'We could not confirm delivery of your project inquiry.');
      setStatus(Object.keys(responseFields).length ? 'validation' : 'error');
    } catch (requestError) {
      setDeliveryUncertain(true);
      setError(
        requestError.name === 'AbortError'
          ? 'Delivery could not be confirmed. Contact LINART before sending again to avoid a duplicate inquiry.'
          : 'Delivery could not be confirmed. Contact LINART before sending again to avoid a duplicate inquiry.',
      );
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const emailFallback = () => {
    const subject = encodeURIComponent(`Linart project inquiry — ${form.service} — ${form.city || 'NJ'}`);
    window.location.href = `mailto:${PROJECT_INBOX}?subject=${subject}&body=${encodeURIComponent(projectBrief)}`;
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(projectBrief);
      setCopyStatus('Project brief copied');
    } catch {
      setCopyStatus('Copy unavailable—select Email Project Brief instead');
    }
  };

  const closeFeedback = () => {
    setStatus('idle');
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const resetForm = () => {
    if (deliveryUncertain) { setError('Please contact LINART to confirm receipt before starting another inquiry.'); return; }
    inquiryKey.current = crypto.randomUUID();
    setForm(initial);
    setStatus('idle');
    setCopyStatus('');
    setError('');
    setFieldErrors({});
    honeypot.current = '';
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
    'contact-premium-field mt-2 w-full rounded-[8px] border border-black/18 bg-white/72 px-4 py-3.5 text-[16px] font-medium text-[#22262a] outline-none transition-all placeholder:text-black/32 focus:border-[#9b7b4f] focus:ring-2 focus:ring-[#9b7b4f]/10';

  return (
    <>
      <section className="contact-premium-page lux-light-section bg-[#f7f4ed] pb-16 pt-32 sm:pt-36">
        <div className="site-container">
          <div className="grid gap-12 xl:grid-cols-[0.39fr_0.61fr] xl:gap-14">
            <aside className="contact-premium-aside self-start xl:sticky xl:top-28">
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

              <a href={`mailto:${PROJECT_INBOX}`} className="mt-3 flex items-center gap-3 text-[16px] font-medium text-[#2d3032] hover:text-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c49c5d] text-black"><Mail size={16} /></span>
                {PROJECT_INBOX}
              </a>

              <div className="mt-6 border-t hairline pt-5">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#46413c]">What helps</p>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] leading-7 text-[#4a4540] marker:text-[#a1753e]">
                  <li>Municipality or ZIP</li>
                  <li>Type of project</li>
                  <li>Approximate timing, if known</li>
                  <li>A short description, if helpful</li>
                </ul>
              </div>

              <img
                src="/branding/linart-premium-contact-card.webp"
                alt="Linart Construction Inc. premium brand mark"
                className="contact-brand-card mt-8 aspect-square w-full max-w-[500px] object-cover shadow-[0_22px_60px_rgba(33,27,20,.16)]"
                loading="lazy"
                decoding="async"
              />
            </aside>

            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              aria-busy={status === 'sending'}
              className="contact-premium-form relative self-start rounded-[22px] border border-black/12 bg-white/52 p-6 shadow-[0_22px_70px_rgba(46,37,27,.08)] backdrop-blur-sm sm:p-8 lg:p-10"
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
                  <input maxLength={120} autoComplete="name" name="name" value={form.name} onChange={change} className={inputClass} placeholder="Your full name" {...errorAttributes('name')} />
                  {fieldError('name')}
                </label>

                <label className="py-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Email *</span>
                  <input maxLength={180} autoComplete="email" type="email" name="email" value={form.email} onChange={change} className={inputClass} placeholder="you@example.com" {...errorAttributes('email')} />
                  {fieldError('email')}
                </label>

                <label className="py-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Phone *</span>
                  <input maxLength={60} autoComplete="tel" inputMode="tel" type="tel" name="phone" value={form.phone} onChange={change} className={inputClass} placeholder="(609) 123-4567" {...errorAttributes('phone')} />
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
                  <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Timing <span className="font-medium tracking-[0.08em] text-[#8b8277]">(Optional)</span></span>
                  <select name="timing" value={form.timing} onChange={change} className={inputClass} {...errorAttributes('timing')}>
                    <option value="">Not sure / not specified</option>
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
                  <input maxLength={120} autoComplete="postal-code" name="city" value={form.city} onChange={change} className={inputClass} placeholder="Town, city, or ZIP code" {...errorAttributes('city')} />
                  {fieldError('city')}
                </label>
              </div>


              <label className="mt-6 block">
                <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3f3b36]">Project Description <span className="font-medium tracking-[0.08em] text-[#8b8277]">(Optional)</span></span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={change}
                  maxLength={1000}
                  rows="5"
                  className={`${inputClass} min-h-[128px] resize-none`}
                  placeholder="Optional - tell us about your project, goals, or any details you would like us to know..."
                  {...errorAttributes('message')}
                />
                <div className="mt-1 flex items-start justify-between gap-4">
                  <div>{fieldError('message')}</div>
                  <span className="text-[11px] text-[#777067]">{form.message.length}/1000</span>
                </div>
              </label>

              <div className="mt-6 flex flex-col gap-5 border-t hairline pt-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-[#765326]">
                    <ShieldCheck size={14} />
                    Secure project inquiry
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-[#555048]">
                    Your details are submitted directly to <a className="font-semibold text-[#765326]" href={`mailto:${PROJECT_INBOX}`}>{PROJECT_INBOX}</a>. We reply to every inquiry, usually within one business day.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="premium-button-dark shrink-0 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  Send Project Inquiry <ArrowUpRight size={16} />
                </button>
              </div>

              <p aria-live="polite" className="mt-3 min-h-5 text-[12px] font-semibold text-[#765326]">{copyStatus}</p>
            </form>
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

      {feedbackOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#050607]/72 px-5 py-10 backdrop-blur-md"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && status !== 'sending') setStatus('idle');
          }}
        >
          <div
            ref={statusDialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-submit-title"
            className="relative w-full max-w-[560px] overflow-hidden rounded-[22px] border border-[#d8bb89]/35 bg-[linear-gradient(145deg,#17191c_0%,#090a0c_100%)] p-7 text-white shadow-[0_34px_100px_rgba(0,0,0,.52),inset_0_1px_0_rgba(255,255,255,.06)] outline-none sm:p-10"
          >
            <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-[#b88a4d]/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e1c89e]/80 to-transparent" />

            {status === 'sending' && (
              <div className="relative text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#d8bb89]/30 bg-[#d8bb89]/8 shadow-[0_0_45px_rgba(190,145,84,.10)]">
                  <Loader2 size={36} className="animate-spin text-[#e1c89e]" />
                </div>
                <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d9bd8b]">Secure transmission</p>
                <h2 id="project-submit-title" className="display-serif mt-3 text-4xl leading-none sm:text-5xl">Sending your project inquiry.</h2>
                <p className="mx-auto mt-5 max-w-md text-[15px] leading-7 text-white/68">
                  We’re validating your details and securely submitting them to <span className="font-semibold text-[#e1c89e]">{PROJECT_INBOX}</span>.
                </p>
                <div className="mx-auto mt-7 h-[3px] max-w-sm overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[#87602e] via-[#e1c89e] to-[#87602e]" />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-white/38">Please keep this window open</p>
              </div>
            )}

            {status === 'sent' && (
              <div className="relative text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#b9d2bb]/25 bg-[#315b3b]/55 text-white shadow-[0_0_45px_rgba(70,125,83,.12)]">
                  <Check size={34} strokeWidth={2.2} />
                </div>
                <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d9bd8b]">Submission confirmed</p>
                <h2 id="project-submit-title" className="display-serif mt-3 text-4xl leading-none sm:text-5xl">Your inquiry has been sent.</h2>
                <p className="mx-auto mt-5 max-w-md text-[15px] leading-7 text-white/70">
                  The website accepted your project details for delivery to <span className="font-semibold text-[#e1c89e]">{PROJECT_INBOX}</span>. We typically respond within one business day.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button type="button" onClick={() => setStatus('idle')} className="premium-button-light">
                    Done <Check size={16} />
                  </button>
                  <button type="button" onClick={resetForm} className="premium-button-ghost">
                    Start Another Inquiry <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {status === 'validation' && (
              <div className="relative text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#d8bb89]/28 bg-[#b88a4d]/12 text-[#e1c89e]">
                  <AlertCircle size={34} />
                </div>
                <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d9bd8b]">Quick review needed</p>
                <h2 id="project-submit-title" className="display-serif mt-3 text-4xl leading-none sm:text-5xl">A few details need attention.</h2>
                <p className="mx-auto mt-5 max-w-md text-[15px] leading-7 text-white/70">
                  {error || 'Please review the highlighted fields before submitting your project inquiry.'}
                </p>
                <button type="button" onClick={closeFeedback} className="premium-button-light mt-8">
                  Review Highlighted Fields <ArrowUpRight size={16} />
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="relative text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#b45f50]/35 bg-[#7c3028]/25 text-[#f1b7ac]">
                  <AlertCircle size={34} />
                </div>
                <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d9bd8b]">Delivery not confirmed</p>
                <h2 id="project-submit-title" className="display-serif mt-3 text-4xl leading-none sm:text-5xl">We couldn’t confirm the send.</h2>
                <p className="mx-auto mt-5 max-w-md text-[15px] leading-7 text-white/70">
                  {error}
                </p>
                <p className="mx-auto mt-3 max-w-md text-[13px] leading-6 text-white/48">
                  Your project details are still in the form. You can review them, copy the brief, or open your email app with everything prefilled.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={closeFeedback} className="premium-button-light">
                    Review &amp; Retry <ArrowUpRight size={16} />
                  </button>
                  <button type="button" onClick={emailFallback} className="premium-button-ghost">
                    Email Project Brief <Mail size={16} />
                  </button>
                  <button type="button" onClick={copyBrief} className="premium-button-ghost sm:col-span-2">
                    {copyStatus === 'Project brief copied' ? <Check size={16} /> : <Copy size={16} />}
                    {copyStatus === 'Project brief copied' ? 'Project Brief Copied' : 'Copy Project Brief'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ContactPage;
