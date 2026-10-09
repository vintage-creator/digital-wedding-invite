import React, { useState } from 'react';
import { Palette } from 'lucide-react';

export default function ColorPaletteSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeTab, setActiveTab] = useState('traditionalColors');
  

  const traditionalColors = [
    {
      id: 'ivory',
      name: 'Ivory',
      hex: '#919136',
      bgGradient: 'linear-gradient(to bottom, #919136, #2d3015)',
      textLight: true,
      defaultRotate: -12,
      role: 'Primary Accent',
      description: 'Rich, ceremonial, and elegant.'
    },
    {
      id: 'sage-green',
      name: 'Sage Green',
      hex: '#6b8d6a',
      bgGradient: 'linear-gradient(135deg, #8fae8d 0%, #6b8d6a 50%, #4b6b4a 100%)',
      textLight: true,
      defaultRotate: 0,
      role: 'Secondary Accent',
      description: 'Soft botanical calm with depth.'
    },
    {
      id: 'champagne-gold',
      name: 'Champagne gold',
      hex: '#D29F51',
      bgGradient: 'linear-gradient(135deg, #F0CF97 0%, #D29F51 50%, #A47227 100%)',
      textLight: false,
      defaultRotate: 12,
      role: 'Main Background',
      text: 'Blush pink,Burgundy, Nude/Gold accent',
      description: 'Warm, polished, and understated.'
    }
  ];

const whiteColors = [
    {
      id: 'blush pink',
      name: 'Blush Pink',
      hex: '#FE828C',
      bgGradient: 'linear-gradient(135deg, #FE828C 0%, #FFB56B 100%)',
      textLight: true,
      defaultRotate: -12,
      role: 'Primary Accent',
      description: 'Rich, ceremonial, and elegant.'
    },
    {
      id: 'burgundy',
      name: 'Burgundy',
      hex: '#800020',
      bgGradient: 'linear-gradient(135deg, #800020, #4A0012)',
      textLight: true,
      defaultRotate: 0,
      role: 'Secondary Accent',
      description: 'Soft botanical calm with depth.'
    },
    {
      id: 'nude',
      name: 'Nude / Gold accent',
      hex: '#EFBF04',
      bgGradient: 'linear-gradient(90deg, #e3c4b1 50%, #d4af37 50%)',
      textLight: false,
      defaultRotate: 12,
      role: 'Main Background',
      text: 'B see finish leleyi o o ',
      description: 'Warm, polished, and understated.'
    }
  ];

  const handleTabChange = (tab) => {setActiveTab(tab);};

  const color = activeTab === 'traditionalColors' ? traditionalColors : whiteColors;

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

<div className="schedule-tabs" style={{
          display: 'inline-flex',
          maxWidth: '100%',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '4px',
          background: 'rgba(252, 242, 239, 0.58)',
          padding: '6px',
          borderRadius: '40px',
          border: '1.5px solid var(--nude-border)',
          marginBottom: '2.5rem',
          boxShadow: '0 2px 10px rgba(38, 54, 34, 0.06)'
        }}>
          <button
            onClick={() => handleTabChange('traditionalColors')}
            style={{
              padding: '10px 22px',
              borderRadius: '30px',
              border: activeTab === 'traditionalColors' ? '1.5px solid var(--blush-muted)' : '1px solid transparent',
              background: activeTab === 'traditionalColors' ? 'linear-gradient(135deg, var(--blush-soft), var(--cream))' : 'transparent',
              color: activeTab === 'traditionalColors' ? 'var(--burgundy-dark)' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'traditionalColors' ? '0 4px 14px rgba(216, 161, 162, 0.18)' : 'none'
            }}
          >
            Traditional Colour Code 
          </button>
          
          <button
            onClick={() => handleTabChange('whiteColors')}
            style={{
              padding: '10px 22px',
              borderRadius: '30px',
              border: activeTab === 'whiteColors' ? '1.5px solid var(--blush-muted)' : '1px solid transparent',
              background: activeTab === 'whiteColors' ? 'linear-gradient(135deg, var(--blush-soft), var(--cream))' : 'transparent',
              color: activeTab === 'whiteColors' ? 'var(--burgundy-dark)' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'white' ? '0 4px 14px rgba(216, 161, 162, 0.18)' : 'none'
            }}
          >
            White Wedding Colour Code 
          </button>
        </div>

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
          {color.map((color, idx) => {
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
          {activeTab === 'whiteColors' ? "🌸 Blush Pink + Burgundy + Nude / Gold Accent" : "🌿 Ivory + Sage Green + Champagne Gold"}

        </p>

      </div>
    </section>
    
  );
}
