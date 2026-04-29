'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Building2, CheckCircle2, Mail, MapPin, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { SectionHeader } from './Features';

export function ContactForm() {
  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Contact"
          title="Talk to the team."
          description="Tell us about your project — we'll get back within one business day."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <ContactInfo />
          <ContactFormCard />
        </div>
      </div>
    </section>
  );
}

function ContactInfo() {
  const items = [
    {
      Icon: Mail,
      label: 'Email',
      value: 'hello@sitescope.io',
    },
    {
      Icon: Building2,
      label: 'Headquarters',
      value: 'Berlin · Munich · Vienna',
    },
    {
      Icon: MapPin,
      label: 'Active Projects',
      value: 'A6-Stern, Project X, Project Y',
    },
  ];

  return (
    <div className="flex flex-col justify-center">
      <h3 className="font-display text-2xl font-bold tracking-tight">
        Let&apos;s build something documented.
      </h3>
      <p className="mt-3 text-[#8B949E]">
        Whether you&apos;re running a single site or a portfolio of indoor builds, SiteScope adapts to
        the way your team already works.
      </p>

      <div className="mt-10 space-y-5">
        {items.map(({ Icon, label, value }) => (
          <div key={label} className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-base-700 bg-base-900 text-amber-500">
              <Icon size={16} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B949E]">
                {label}
              </p>
              <p className="mt-0.5 text-[#E6EDF3]">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactFormCard() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-base-800 bg-base-900/60 p-8 backdrop-blur-xl"
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-amber-500/20 text-amber-500"
            >
              <CheckCircle2 size={32} />
            </motion.div>
            <h4 className="mt-6 font-display text-2xl font-bold">Message received.</h4>
            <p className="mt-2 max-w-sm text-[#8B949E]">
              Thanks for reaching out, {form.name || 'friend'}. The team will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setForm({ name: '', email: '', company: '', message: '' });
              }}
              className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-amber-500 hover:underline"
            >
              Send another →
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            className="grid gap-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Name" id="name" required value={form.name} onChange={update('name')} />
              <Field
                label="Email"
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update('email')}
              />
            </div>
            <Field label="Company" id="company" value={form.company} onChange={update('company')} />
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B949E]"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={update('message')}
                className="w-full resize-none rounded-md border border-base-700 bg-base-950/60 px-4 py-3 text-sm text-[#E6EDF3] outline-none transition-colors placeholder:text-[#484F58] focus:border-amber-500"
                placeholder="Tell us about your project..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-amber-gradient px-6 py-3 text-sm font-semibold text-base-950 shadow-xl shadow-amber-600/30 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-base-950/40 border-t-base-950" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Field({
  label,
  id,
  type = 'text',
  required,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B949E]"
      >
        {label}
        {required && <span className="ml-1 text-amber-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-base-700 bg-base-950/60 px-4 py-2.5 text-sm text-[#E6EDF3] outline-none transition-colors placeholder:text-[#484F58] focus:border-amber-500"
      />
    </div>
  );
}
