import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer" style={{
      background: 'linear-gradient(180deg, #3B081B 0%, #2A0513 100%)',
      color: '#FFFFFF',
      padding: '4rem 1.5rem 2.5rem',
      textAlign: 'center',
      borderTop: '2px solid var(--gold)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <img src="/assets/footer-botanical-sprays.png" alt="" aria-hidden="true" className="footer-botanical-frame" />
      
      <div className="max-w-content" style={{ margin: '0 auto', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Exact D & T Burgundy Wax Seal Badge in Footer (Perfect Centering on Mobile and Desktop) */}
        <div className="footer-seal-badge">
          <img
            src="/assets/dt-script-wax-seal.png"
            alt="D and T burgundy wax seal"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* Script Names */}
        <h2 style={{
          fontFamily: 'var(--font-script)',
          fontSize: 'clamp(2.8rem, 8vw, 4rem)',
          color: '#F4ECE1',
          margin: 0,
          lineHeight: 1.1,
          textAlign: 'center'
        }}>
          Deborah & Tom
        </h2>

        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '1rem',
          color: '#E4C889',
          letterSpacing: '0.1em',
          marginTop: '0.4rem',
          textAlign: 'center'
        }}>
<<<<<<< HEAD
          #DTLoveTale26
=======
          #TheBestOfDeb · #dtlovestory
>>>>>>> 8a3ef3d815eda969f71b255c75fe0d9e2ee90bc0
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          margin: '2rem 0',
          fontSize: '0.9rem',
          color: 'rgba(244, 236, 225, 0.85)',
          textAlign: 'center'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} style={{ color: 'var(--gold)' }} />
            December 17th & 19th, 2026
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} style={{ color: 'var(--gold)' }} />
            Abuja, Nigeria
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginTop: '2.5rem', borderTop: '1px solid rgba(197, 160, 89, 0.25)', paddingTop: '1.5rem', width: '100%', textAlign: 'center' }}>
          Crafted with love for Deborah & Tom’s Wedding Celebration. All rights reserved © 2026.
        </p>
      </div>
    </footer>
  );
}
