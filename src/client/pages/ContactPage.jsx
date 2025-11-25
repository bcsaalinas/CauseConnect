import React, { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { CONTACT_VALIDATORS } from '../data';

function ContactPage() {
  useDocumentTitle("Contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ submitting: false, flash: null });

  const validateField = (name, value) => {
    const validator = CONTACT_VALIDATORS[name];
    return validator ? validator(value) : "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fieldErrors = Object.keys(form).reduce((acc, field) => {
      acc[field] = validateField(field, form[field]);
      return acc;
    }, {});
    setErrors(fieldErrors);
    const hasErrors = Object.values(fieldErrors).some(Boolean);
    if (hasErrors) return;

    setStatus({ submitting: true, flash: null });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to send message");
      }
      setForm({ name: "", email: "", message: "" });
      setStatus({ submitting: false, flash: { type: "success", message: data.message } });
    } catch (error) {
      setStatus({ submitting: false, flash: { type: "danger", message: error.message || "Unable to send message" } });
    }
  };

  return (
    <>
      <section className="page-section contact-hero snap-target" data-animate="section">
        <div className="content-max text-center fade-up" data-animate="stagger">
          <p className="eyebrow text-uppercase mb-2">contact</p>
          <h1 className="hero-title fs-1 mb-3" data-animate="split-lines">
            We’d love to hear from you
          </h1>
          <p className="hero-subtitle fs-5 mb-0" data-animate="fade">
            Reach out with questions, partnerships, or ideas to support local initiatives.
          </p>
        </div>
      </section>

      <section className="page-section contact-form-section snap-target" data-animate="section">
        <div className="content-max position-relative" data-animate="stagger">
          <div className="contact-ambient" aria-hidden="true"></div>
          <div className="row g-4 align-items-start position-relative" data-animate="stagger" data-stagger-target=".glass-panel, form[data-animate]">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="contact-details glass-panel p-4 fade-up reveal-mask" data-animate="float-card">
                <h2 className="h4 mb-3">Office & support</h2>
                <p className="mb-3">Our team is based in Guadalajara. We’ll get back to you within 2 business days.</p>
                <ul className="list-unstyled d-grid gap-3 mb-4">
                  <li className="d-flex gap-3">
                    <span className="badge-soft">Email</span>
                    <span>hello@causeconnect.org</span>
                  </li>
                  <li className="d-flex gap-3">
                    <span className="badge-soft">Phone</span>
                    <span>+52 (33) 5555 1234</span>
                  </li>
                  <li className="d-flex gap-3">
                    <span className="badge-soft">Address</span>
                    <span>Av. Chapultepec 123, Guadalajara, Jal.</span>
                  </li>
                </ul>
                <div className="contact-social d-flex gap-3" data-animate="stagger" data-stagger-target=".social-card">
                  <a href="#" className="social-card glass-panel tilt-card d-flex align-items-center justify-content-center" data-animate="magnet">
                    FB
                  </a>
                  <a href="#" className="social-card glass-panel tilt-card d-flex align-items-center justify-content-center" data-animate="magnet">
                    IG
                  </a>
                  <a href="#" className="social-card glass-panel tilt-card d-flex align-items-center justify-content-center" data-animate="magnet">
                    TW
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <form className="contact-form glass-panel p-4 p-md-5 fade-up reveal-mask" noValidate data-animate="float-card" onSubmit={handleSubmit}>
                <div className={`contact-field ${errors.name ? "is-invalid" : ""}`}>
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input name="name" type="text" className="form-control" id="name" placeholder="Full name" value={form.name} onChange={handleChange} />
                  <small className="form-text invalid-feedback">{errors.name}</small>
                </div>
                <div className={`contact-field ${errors.email ? "is-invalid" : ""}`}>
                  <label className="form-label" htmlFor="email">
                    E-mail
                  </label>
                  <input name="email" type="email" className="form-control" id="email" placeholder="email@example.com" value={form.email} onChange={handleChange} />
                  <small className="form-text invalid-feedback">{errors.email}</small>
                </div>
                <div className={`contact-field ${errors.message ? "is-invalid" : ""}`}>
                  <label className="form-label" htmlFor="message">
                    Message
                  </label>
                  <textarea name="message" className="form-control" id="message" rows="4" placeholder="Write your message..." value={form.message} onChange={handleChange}></textarea>
                  <small className="form-text invalid-feedback">{errors.message}</small>
                </div>
                <button type="submit" className="btn btn-pill btn-pill-primary w-100" data-animate="magnet" disabled={status.submitting}>
                  {status.submitting ? "Sending..." : "Submit"}
                </button>
                {status.flash && (
                  <div className={`contact-flash alert alert-${status.flash.type} mt-3 fade-up is-visible`}>
                    {status.flash.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
