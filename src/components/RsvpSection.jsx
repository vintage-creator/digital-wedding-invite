import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Send, CheckCircle2, User, Mail, Phone, MessageSquare, Users, Loader2 } from 'lucide-react';
import { createRsvp } from '../lib/supabase';

export default function RsvpSection({ onTriggerToast }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    attendance: 'both', // 'traditional' | 'white' | 'both' | 'decline'
    guestCount: 1,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.fullName) {
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
          message: 'Please enter your phone or WhatsApp number.'
        });
      }
      return;
    }

    const attendanceLabels = {
      both: 'Both events',
      traditional: 'Traditional wedding only',
      white: 'White wedding only',
      decline: 'Regretfully declines'
    };
    const whatsappMessage = [
      'Hello Deborah & Tom, here is my wedding RSVP:',
      '',
      `Name: ${formData.fullName.trim()}`,
      `Attendance: ${attendanceLabels[formData.attendance]}`,
      `Number of guests: ${formData.guestCount}`,
      formData.phone.trim() ? `Phone: ${formData.phone.trim()}` : null,
      formData.email.trim() ? `Email: ${formData.email.trim()}` : null,
      formData.message.trim() ? `Message / dietary needs: ${formData.message.trim()}` : null
    ].filter(Boolean).join('\n');
    const whatsappUrl = `https://wa.me/2348132804142?text=${encodeURIComponent(whatsappMessage)}`;
    const whatsappWindow = window.open('about:blank', '_blank');

    if (whatsappWindow) {
      try {
        whatsappWindow.opener = null;
        whatsappWindow.document.title = 'Opening WhatsApp…';
        whatsappWindow.document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        whatsappWindow.document.body.style.padding = '2rem';
        whatsappWindow.document.body.innerHTML = '<p>Saving RSVP, then opening WhatsApp…</p>';
      } catch (err) {}
    }

    setIsSubmitting(true);
    let savedToDatabase = false;

    try {
      await createRsvp({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        attendance: formData.attendance,
        guestCount: Number(formData.guestCount) || 1,
        message: formData.message.trim(),
        whatsappLinkOpened: true
      });
      savedToDatabase = true;
    } catch (err) {
      console.log('RSVP database save failed; continuing with WhatsApp fallback:', err);
    }

    if (whatsappWindow && !whatsappWindow.closed) {
      whatsappWindow.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    setSubmitted(true);
    setIsSubmitting(false);

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        startVelocity: 25,
        origin: { y: 0.75 },
        colors: ['#5B0E2D', '#4A583F', '#8EA682', '#E5D9C3']
      });
    } catch (err) {}

    if (onTriggerToast) {
      onTriggerToast({
        type: savedToDatabase ? 'success' : 'info',
        message: savedToDatabase
          ? `${formData.fullName}'s RSVP has been saved. WhatsApp is open as an extra notification.`
          : `WhatsApp is ready with ${formData.fullName}'s RSVP details. Database save did not complete.`
      });
    }
  };

  return (
    <section id="rsvp" className="section-padding" style={{ background: 'var(--section-blush)' }}>
      <div className="max-w-narrow text-center">
        
        <span className="section-eyebrow">
          <Heart size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Kindly Respond By Nov 15, 2026
        </span>
        <h2 className="section-title-script">
          RSVP Invitation
        </h2>
        <p className="section-subtitle">
          Your presence would mean the world to us. Please fill out the form below to confirm your attendance and share the celebration with #TheBestOfDeb.
        </p>

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
                Your RSVP has been saved. WhatsApp has also opened with your details as an extra notification for the couple.
              </p>
              <button
                onClick={() => setSubmitted(false)}
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
                    Phone Number / WhatsApp *
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.8rem' }}>
                  {[
                    { id: 'both', label: 'Both Events' },
                    { id: 'traditional', label: 'Traditional Only' },
                    { id: 'white', label: 'White Wedding Only' },
                    { id: 'decline', label: 'Regretfully Decline' }
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

              {/* Number of Guests */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" htmlFor="guestCount">
                  <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Number of Attending Guests
                </label>
                <select
                  id="guestCount"
                  className="form-select"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                >
                  <option value={1}>1 Guest (Just Me)</option>
                  <option value={2}>2 Guests (Me + Plus One)</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests (Family)</option>
                  <option value={5}>5+ Guests</option>
                </select>
              </div>

              {/* Warm Wishes & Notes */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" htmlFor="message">
                  <MessageSquare size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Wishes for Deborah & Tom / Dietary Requirements
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
