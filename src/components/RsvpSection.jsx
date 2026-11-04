import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Send, CheckCircle2, User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { createRsvp } from '../lib/supabase';

export default function RsvpSection({ onTriggerToast }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    attendance: 'both', // 'both' | 'decline'
    guestCount: 1,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.fullName.trim()) {
      if (onTriggerToast) {
        onTriggerToast({
          type: 'error',
          message: 'Please enter your full name.'
        });
      }
      return;
    }

    if (!formData.phone.trim()) {
      if (onTriggerToast) {
        onTriggerToast({
          type: 'error',
          message: 'Please enter your phone number.'
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await createRsvp({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        attendance: formData.attendance,
        guestCount: 1,
        message: formData.message.trim(),
        whatsappLinkOpened: false
      });

      setSubmitted(true);

      try {
        confetti({
          particleCount: 35,
          spread: 50,
          startVelocity: 25,
          origin: { y: 0.75 },
          colors: ['#5C2059', '#295D3D', '#72C78E', '#E5D9C3']
        });
      } catch (err) {}

      if (onTriggerToast) {
        onTriggerToast({
          type: 'success',
          message: `Thank you, ${formData.fullName}! Your RSVP has been confirmed.`
        });
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      if (onTriggerToast) {
        onTriggerToast({
          type: 'error',
          message: 'Unable to save your RSVP at the moment. Please try again or contact us directly.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="section-padding" style={{ background: 'var(--section-blush)' }}>
      <div className="max-w-narrow text-center">
        
        <span className="section-eyebrow">
          <Heart size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Kindly Respond By Nov 10, 2026
        </span>
        <h2 className="section-title-script">
          RSVP Invitation
        </h2>
        <p className="section-subtitle">
          Your presence would mean the world to us. Please fill out the form below to confirm your attendance with <strong>#ever_after_21</strong>.
        </p>

        <aside className="rsvp-reminder-note" role="note">
          <p>
            We’re so excited to celebrate our big day with you in Lagos. Kindly ensure you get the <strong>ACCESS CARD</strong> even after RSVPing. Thank you for understanding with us.
          </p>
        </aside>

        {/* RSVP Helpline Notice */}
        <div style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.2rem',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <span>RSVP Contacts:</span>
          <a href="tel:09027330272" style={{ color: 'var(--burgundy)', fontWeight: 600, textDecoration: 'none' }}>
            Seyi: 09027330272
          </a>
          <span>•</span>
          <a href="tel:08132804142" style={{ color: 'var(--burgundy)', fontWeight: 600, textDecoration: 'none' }}>
            Tolu: 08132804142
          </a>
        </div>

        <div className="glass-card" style={{
          padding: 'clamp(1.5rem, 5vw, 3rem)',
          border: '1.5px solid var(--nude-border)',
          background: 'rgba(255, 253, 249, 0.92)',
          textAlign: 'left'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={60} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-script)', fontSize: '3rem', color: 'var(--burgundy)', margin: 0 }}>
                Thank You!
              </h3>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-dark)', margin: '0.5rem 0 1rem' }}>
                We can't wait to celebrate with you, {formData.fullName}!
              </h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
                Your RSVP has been successfully received and recorded for the celebration.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    attendance: 'both',
                    guestCount: 1,
                    message: ''
                  });
                }}
                className="btn btn-outline-burgundy"
              >
                Submit Another RSVP
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="e.g. Chief & Mrs. Adebayo"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              {/* Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Attendance Choice */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">
                  Attendance Selection
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
                  {[
                    { id: 'both', label: 'Joyfully Attending (Nov 21)' },
                    { id: 'decline', label: 'Regretfully Declines' }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      style={{
                        padding: '12px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: formData.attendance === opt.id ? '2px solid var(--blush-muted)' : '1px solid var(--nude-border)',
                        background: formData.attendance === opt.id ? 'var(--blush-soft)' : 'var(--nude-card)',
                        color: formData.attendance === opt.id ? 'var(--burgundy-dark)' : 'var(--text-dark)',
                        fontWeight: formData.attendance === opt.id ? 600 : 400,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={opt.id}
                        checked={formData.attendance === opt.id}
                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                        style={{ display: 'none' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Warm Wishes & Notes */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" htmlFor="message">
                  <MessageSquare size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Wishes for Opeyemi &amp; Temilayojesu / Special Notes
                </label>
                <textarea
                  id="message"
                  placeholder="Share a heartfelt message, song request, or dietary needs..."
                  className="form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-burgundy"
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '1rem', opacity: isSubmitting ? 0.72 : 1 }}
              >
                {isSubmitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                {isSubmitting ? 'Saving RSVP...' : 'Send RSVP'}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
