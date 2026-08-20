import React from 'react';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero-section"
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '110px 1.5rem 60px',
        position: 'relative',
        background: 'radial-gradient(circle at 50% 28%, rgba(255, 253, 252, 0.88) 0%, rgba(248, 240, 232, 0.96) 46%, var(--nude-soft) 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Background Floral/Arch Stage */}
      <img
        className="hero-floral-frame"
        src="/assets/hero-floral-frame.png"
        alt=""
        aria-hidden="true"
      />
      <div className="max-w-content text-center" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        
        {/* Save The Date Arch Frame */}
        <div
          className="animate-float hero-invitation-card"
          style={{
            margin: '0 auto',
            width: 'min(92vw, 620px)',
            background: 'rgba(255, 253, 252, 0.96)',
            border: '2.5px solid var(--gold)',
            borderRadius: '310px 310px 24px 24px',
            boxShadow: '0 25px 60px rgba(38, 54, 34, 0.11), inset 0 0 30px rgba(197, 160, 89, 0.1)',
            padding: 'clamp(2.75rem, 6vw, 4.5rem) clamp(1.75rem, 6vw, 4.25rem)',
            position: 'relative'
          }}
        >
          {/* Inner Decorative Arch Border */}
          <div style={{
            position: 'absolute',
            inset: '12px',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            borderRadius: '298px 298px 16px 16px',
            pointerEvents: 'none'
          }} />

          {/* Eyebrow */}
          <span style={{
            display: 'inline-block',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold-dark)',
            marginBottom: '0.5rem'
          }}>
            Save The Date
          </span>

          {/* Script Title */}
          <h1 style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(3.5rem, 10vw, 5.5rem)',
            color: 'var(--burgundy)',
            fontWeight: 400,
            lineHeight: 1.05,
            margin: '0.5rem 0'
          }}>
            Deborah & Tom
          </h1>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.35rem 0.85rem',
            border: '1px solid rgba(197, 160, 89, 0.42)',
            borderRadius: '999px',
            background: 'rgba(251, 247, 239, 0.72)',
            color: 'var(--olive)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            marginBottom: '0.75rem'
          }}>
            #TheBestOfDeb
          </span>

          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontStyle: 'italic',
            color: 'var(--olive)',
            marginBottom: '1.5rem'
          }}>
            are getting married
          </p>

          {/* Date & Location Summary */}
          <div style={{
            borderTop: '1px solid var(--nude-border)',
            borderBottom: '1px solid var(--nude-border)',
            padding: '1rem 0',
            margin: '1.5rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--burgundy)', marginBottom: '0.4rem' }}>
              <Calendar size={18} style={{ color: 'var(--gold)' }} />
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.05em' }}>
                17th & 19th December 2026
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <MapPin size={16} style={{ color: 'var(--gold-dark)' }} />
              <span>Abuja, Nigeria</span>
            </div>
          </div>

          {/* Venue Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.8rem', fontSize: '0.85rem' }}>
            <p style={{ color: 'var(--burgundy-medium)', fontWeight: 500 }}>
              <span style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>Traditional:</span> The Nest Gardens, Guzape
            </p>
            <p style={{ color: 'var(--burgundy-medium)', fontWeight: 500 }}>
              <span style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>White Wedding:</span> Bolton White Event Centre
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
            <a href="#rsvp" className="btn btn-burgundy" style={{ width: '100%' }}>
              RSVP Invitation
            </a>
            <a href="#events" className="btn btn-outline-gold" style={{ width: '100%' }}>
              Explore Event Details
            </a>
          </div>
        </div>

        {/* Scroll Chevron */}
        <div style={{ marginTop: '2.5rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Scroll to Discover
          </span>
          <ChevronDown size={22} style={{ color: 'var(--burgundy-medium)', animation: 'floatGentle 2s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}
