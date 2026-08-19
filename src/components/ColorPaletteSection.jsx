import React, { useState } from 'react';
import { Palette, CheckCircle2, Sparkles } from 'lucide-react';

export default function ColorPaletteSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const colors = [
    {
      id: 'burgundy',
      name: 'Royal Burgundy',
      hex: '#5B0E2D',
      bgGradient: 'linear-gradient(180deg, #8C244C 0%, #5B0E2D 100%)',
      textLight: true,
      defaultRotate: -12,
      role: "Groom's Family & Bridal Train",
      description: 'Rich wine red symbolising royalty, warmth, and everlasting devotion.'
    },
    {
      id: 'sage',
      name: 'Earthy Sage Green',
      hex: '#8F8D5F',
      bgGradient: 'linear-gradient(180deg, #A4A376 0%, #8F8D5F 100%)',
      textLight: true,
      defaultRotate: -4,
      role: "Bride's Family & Traditional Maidens",
      description: 'Serene sage green representing new growth, harmony, and natural grace.'
    },
    {
      id: 'olive',
      name: 'Deep Olive Green',
      hex: '#4A583F',
      bgGradient: 'linear-gradient(180deg, #6B7B5D 0%, #4A583F 100%)',
      textLight: true,
      defaultRotate: 4,
      role: 'Cultural Elders & VIP Guests',
      description: 'Noble olive green honoring wisdom, stability, and rooted heritage.'
    },
    {
      id: 'nude',
      name: 'Warm Nude / Champagne',
      hex: '#E5D9C3',
      bgGradient: 'linear-gradient(180deg, #FAF6F0 0%, #E5D9C3 100%)',
      textLight: false,
      defaultRotate: 12,
      role: 'Friends & Honored Celebrants',
      description: 'Soft champagne nude representing purity, warmth, and joyful celebration.'
    }
  ];

  return (
    <section id="colors" className="section-padding" style={{ background: 'var(--nude-bg)', overflow: 'hidden' }}>
      <div className="max-w-content text-center">
        
        <span className="section-eyebrow">
          <Palette size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Interactive Swatch Fan
        </span>
        <h2 className="section-title-script">
          Wedding Color Code & Attire
        </h2>
        <p className="section-subtitle">
          Hover or tap any slanted color bar to straighten it and reveal guest dress code guidelines.
        </p>

        {/* Slanted Fanned-Out Vertical Color Deck (Resting on one another, straightening on hover) */}
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
                    ? '0 30px 60px rgba(91, 14, 45, 0.4), 0 0 25px rgba(197, 160, 89, 0.7)'
                    : '0 15px 35px rgba(0, 0, 0, 0.18)',
                  border: isHovered ? '3px solid var(--gold)' : '1.5px solid rgba(255, 255, 255, 0.5)',
                  margin: '0 -22px', // Overlapping card deck effect resting on one another
                  zIndex: isHovered ? 20 : idx + 1,
                  transform: isHovered
                    ? 'translateY(-34px) rotate(0deg) scale(1.08)'
                    : `rotate(${color.defaultRotate}deg) translateY(0px)`,
                  transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, border-color 0.4s ease',
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
                    background: color.textLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
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

        {/* Selected Hover Detail Card */}
        {hoveredIdx !== null ? (
          <div
            className="glass-card"
            style={{
              maxWidth: '520px',
              margin: '0 auto',
              padding: '1.2rem 1.5rem',
              border: '1.5px solid var(--gold)',
              background: '#FFFFFF',
              borderRadius: '16px',
              animation: 'fadeIn 0.35s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--burgundy)' }} />
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--burgundy)' }}>
                {colors[hoveredIdx].name} ({colors[hoveredIdx].hex})
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              <strong>Recommended Attire:</strong> {colors[hoveredIdx].role} — {colors[hoveredIdx].description}
            </p>
          </div>
        ) : (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Hover over any color card to unfold details
          </p>
        )}

      </div>
    </section>
  );
}
