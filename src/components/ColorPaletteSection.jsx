import React, { useState } from 'react';
import { Palette, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ColorPaletteSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const colors = [
    {
      id: 'plum',
      name: 'Royal Plum',
      hex: '#5C2059',
      bgGradient: 'linear-gradient(135deg, #7A2876 0%, #5C2059 50%, #350F33 100%)',
      textLight: true,
      defaultRotate: -8,
      role: 'Primary Regal Tone',
      description: 'Rich, majestic, and celebratory. Ideal for main gowns, jackets, aṣọ-òkè, and caps.'
    },
    {
      id: 'mint-green',
      name: 'Mint Green',
      hex: '#72C78E',
      bgGradient: 'linear-gradient(135deg, #9CE3B3 0%, #72C78E 50%, #295D3D 100%)',
      textLight: true,
      defaultRotate: 0,
      role: 'Signature Botanical Accent',
      description: 'Fresh, graceful, and lively. Perfect for geles, agbádás, dresses, and pocket squares.'
    },
    {
      id: 'soft-lilac',
      name: 'Lilac Mauve',
      hex: '#D6B0D5',
      bgGradient: 'linear-gradient(135deg, #F0DBEF 0%, #D6B0D5 50%, #9B6399 100%)',
      textLight: false,
      defaultRotate: 8,
      role: 'Harmonious Complement',
      description: 'A soft, romantic bridge between plum and mint. Subtle and flattering.'
    }
  ];

  return (
    <section id="colors" className="section-padding" style={{ background: 'var(--section-sage)', overflow: 'hidden' }}>
      <div className="max-w-content text-center">
        
        <span className="section-eyebrow">
          <Palette size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Color of the Day
        </span>
        <h2 className="section-title-script">
          Mint Green &amp; Plum
        </h2>
        <p className="section-subtitle">
          Our wedding color theme is <strong>Mint Green and Plum</strong>. Guests are warmly encouraged to celebrate with us in these festive tones!
        </p>

        {/* 3D Color Swatch Fan Cards */}
        <div
          className="color-deck"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '430px',
            position: 'relative',
            margin: '2rem 0 3rem'
          }}
        >
          {colors.map((c, idx) => {
            const isHovered = hoveredIdx === idx;
            const anyHovered = hoveredIdx !== null;
            
            let rot = c.defaultRotate;
            let transX = (idx - 1) * 70;
            let transY = 0;
            let scale = 1;
            let zIndex = idx + 1;

            if (isHovered) {
              scale = 1.08;
              transY = -32;
              rot = 0;
              zIndex = 10;
            } else if (anyHovered) {
              scale = 0.94;
              transX = (idx - 1) * 110;
              rot = c.defaultRotate * 1.3;
            }

            return (
              <div
                key={c.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: 'absolute',
                  width: 'clamp(230px, 32vw, 290px)',
                  height: 'clamp(330px, 44vw, 390px)',
                  borderRadius: '24px',
                  background: c.bgGradient,
                  color: c.textLight ? '#FFFFFF' : '#2A1529',
                  boxShadow: isHovered
                    ? '0 30px 60px rgba(50, 12, 48, 0.28), 0 0 25px rgba(114, 199, 142, 0.35)'
                    : '0 15px 35px rgba(50, 12, 48, 0.14)',
                  padding: '1.8rem 1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transform: `translateX(${transX}px) translateY(${transY}px) rotate(${rot}deg) scale(${scale})`,
                  transformOrigin: 'bottom center',
                  transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  zIndex: zIndex,
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {/* Top Role / Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    opacity: 0.9
                  }}>
                    {c.role}
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    opacity: 0.85
                  }}>
                    {c.hex}
                  </span>
                </div>

                {/* Bottom Card Copy */}
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.8rem',
                    margin: '0 0 0.5rem',
                    fontWeight: 600
                  }}>
                    {c.name}
                  </h3>
                  <p style={{
                    fontSize: '0.86rem',
                    lineHeight: 1.45,
                    opacity: 0.92,
                    margin: 0
                  }}>
                    {c.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Attire Advice Banner */}
        <div
          className="glass-card"
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '1.4rem 2rem',
            borderRadius: '20px',
            background: 'var(--nude-card)',
            border: '1px solid var(--nude-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'left'
          }}
        >
          <Sparkles size={24} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', color: 'var(--burgundy)', fontSize: '0.98rem' }}>
              Color of the Day: Mint Green &amp; Plum (#EVERAFTER21')
            </strong>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Whether you choose deep plum regal elegance, fresh mint green, or subtle accents, we cannot wait to see you look your absolute best!
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
