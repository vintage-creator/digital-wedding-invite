import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer" style={{
      background: 'linear-gradient(180deg, #320C30 0%, #200720 100%)',
      color: '#FFFFFF',
      padding: '4rem 1.5rem 2.5rem',
      textAlign: 'center',
      borderTop: '2px solid var(--gold)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="max-w-content" style={{ margin: '0 auto', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Access Card OT Wax Seal */}
        <div style={{
          width: '90px',
          height: '90px',
          marginBottom: '1rem',
          filter: 'drop-shadow(0 6px 18px rgba(0, 0, 0, 0.45))'
        }}>
          <img
            src="/assets/ot_wax_seal.png"
            alt="OT plum wax seal"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>

        {/* Script Names */}
        <h2 style={{
          fontFamily: 'var(--font-script)',
          fontSize: 'clamp(2.8rem, 8vw, 4rem)',
          color: '#FAF6FA',
          margin: 0,
          lineHeight: 1.1,
          textAlign: 'center'
        }}>
          Opeyemi &amp; Temilayojesu
        </h2>

        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '1.05rem',
          color: '#9CE3B3',
          letterSpacing: '0.14em',
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          #EVERAFTER21'
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          margin: '2rem 0',
          fontSize: '0.9rem',
          color: 'rgba(250, 246, 250, 0.88)',
          textAlign: 'center'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} style={{ color: 'var(--gold-light)' }} />
            Saturday, 21st November 2026 • 10:00 AM
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} style={{ color: 'var(--gold-light)' }} />
            Green Life Event Center, Oregun, Lagos
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginTop: '2.5rem', borderTop: '1px solid rgba(114, 199, 142, 0.25)', paddingTop: '1.5rem', width: '100%', textAlign: 'center' }}>
          Crafted with love for Opeyemi &amp; Temilayojesu’s Wedding Celebration. All rights reserved © 2026.
        </p>
      </div>
    </footer>
  );
}
