import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Send, CheckCircle2, User, Mail, Phone, MessageSquare, Users } from 'lucide-react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName) {
      if (onTriggerToast) {
        onTriggerToast({
          type: 'error',
          message: 'Please enter your full name.'
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

    window.open(`https://wa.me/2348132804142?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);

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
        type: 'success',
        message: `WhatsApp is ready with ${formData.fullName}'s RSVP details.`
      });
    }
  };

  return (
    <section id="rsvp" className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="max-w-narrow text-center">
        
        <span className="section-eyebrow">
          <Heart size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Kindly Respond By Nov 15, 2026
        </span>
        <h2 className="section-title-script">
          RSVP Invitation
        </h2>
        <p className="section-subtitle">
          Your presence would mean the world to us. Please fill out the form below to confirm your attendance.
        </p>

        <div className="glass-card" style={{
          padding: 'clamp(1.5rem, 5vw, 3rem)',
          border: '1.5px solid var(--nude-border)',
          background: 'var(--nude-bg)',
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
                WhatsApp has opened with your RSVP details. Tap Send there so the couple receives your response.
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
                    Phone Number / WhatsApp
                  </label>
                  <input
                    id="phone"
                    type="tel"
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
                        border: formData.attendance === opt.id ? '2px solid var(--olive)' : '1px solid var(--nude-border)',
                        background: formData.attendance === opt.id ? 'rgba(74, 88, 63, 0.12)' : '#FFFFFF',
                        color: formData.attendance === opt.id ? 'var(--olive-dark)' : 'var(--text-dark)',
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
              <button type="submit" className="btn btn-burgundy" style={{ width: '100%', marginTop: '1rem' }}>
                <Send size={16} />
                Send RSVP
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
