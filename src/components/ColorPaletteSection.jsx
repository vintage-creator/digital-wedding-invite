import React, { useState } from 'react';
import { Palette } from 'lucide-react';

export default function ColorPaletteSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const colors = [
    {
      id: 'burgundy',
      name: 'Burgundy',
      hex: '#5B0E2D',
      bgGradient: 'linear-gradient(180deg, #8C244C 0%, #5B0E2D 100%)',
      textLight: true,
      defaultRotate: -12,
      role: 'Primary Accent',
      description: 'Rich, ceremonial, and elegant.'
    },
    {
      id: 'sage-olive',
      name: 'Sage / Olive Green',
      hex: '#4A583F',
      bgGradient: 'linear-gradient(180deg, #8B9E7B 0%, #4A583F 100%)',
      textLight: true,
      defaultRotate: 0,
      role: 'Secondary Accent',
      description: 'Soft botanical calm with depth.'
    },
    {
      id: 'nude',
      name: 'Nude / Champagne',
      hex: '#E5D9C3',
      bgGradient: 'linear-gradient(180deg, #FAF6F0 0%, #E5D9C3 100%)',
      textLight: false,
      defaultRotate: 12,
      role: 'Main Background',
      description: 'Warm, polished, and understated.'
    }
  ];

  return (
    <section id="colors" className="section-padding" style={{ background: 'var(--section-sage)', overflow: 'hidden' }}>
      <div className="max-w-content text-center">
        
        <span className="section-eyebrow">
          <Palette size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Wedding Color Guide
        </span>
        <h2 className="section-title-script">
          Wedding Color Code & Attire
        </h2>
        <p className="section-subtitle">
          Guests are warmly invited to dress within the couple’s chosen tones.
        </p>

        <div className="color-deck"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '3.5rem',
            marginBottom: '2.5rem',
            padding: '40px 10px',
            minHeight: '400px',
            position: 'relative'
          }}
        >
          {colors.map((color, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={color.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setHoveredIdx(hoveredIdx === idx ? null : idx)}
                className="color-card"
                style={{
                  width: 'clamp(140px, 20vw, 200px)',
                  height: '350px',
                  background: color.bgGradient,
                  borderRadius: '24px',
                  boxShadow: isHovered
                    ? '0 26px 54px rgba(38, 54, 34, 0.28), 0 0 18px rgba(197, 160, 89, 0.45)'
                    : '0 15px 35px rgba(38, 54, 34, 0.14)',
                  border: isHovered ? '3px solid var(--gold)' : '1.5px solid rgba(255, 253, 252, 0.72)',
                  margin: '0 -22px',
                  zIndex: isHovered ? 20 : idx + 1,
                  transform: isHovered
                    ? 'translateY(-34px) rotate(0deg) scale(1.08)'
                    : `rotate(${color.defaultRotate}deg) translateY(0px)`,
                  transition: 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease, border-color 0.45s ease',
                  willChange: 'transform',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem 1rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Top Badge Hex Code */}
                <div style={{
                  textAlign: 'center',
                  opacity: isHovered ? 1 : 0.85
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: color.textLight ? '#F4ECE1' : 'var(--burgundy-dark)',
                    background: color.textLight ? 'rgba(38, 54, 34, 0.35)' : 'rgba(255,255,255,0.72)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    display: 'inline-block'
                  }}>
                    {color.hex}
                  </span>
                </div>

                {/* Bottom Content Detail */}
                <div style={{
                  textAlign: 'center',
                  color: color.textLight ? '#FFFFFF' : 'var(--burgundy-dark)'
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    margin: '0 0 0.3rem 0',
                    lineHeight: 1.2,
                    textShadow: color.textLight ? '0 2px 4px rgba(0,0,0,0.4)' : 'none'
                  }}>
                    {color.name}
                  </h3>

                  <span style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    opacity: 0.95
                  }}>
                    {color.role}
                  </span>

                  <p style={{
                      fontSize: '0.76rem',
                      lineHeight: 1.4,
                      opacity: isHovered ? 0.95 : 0,
                      margin: '0.5rem 0 0 0',
                      maxHeight: isHovered ? '80px' : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.35s ease 0.08s, transform 0.45s ease 0.05s, max-height 0.45s ease'
                    }}>
                      {color.description}
                    </p>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
          Burgundy, sage or olive green, and nude.
        </p>

      </div>
    </section>
  );
}
