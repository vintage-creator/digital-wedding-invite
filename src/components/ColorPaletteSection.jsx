import React from 'react';
import { Palette } from 'lucide-react';

export default function ColorPaletteSection() {
  const colors = [
    {
      id: 'mint-green',
      name: 'Mint Green',
      hex: '#72C78E',
      role: 'Fresh botanical accent',
      description: 'A soft, lively green for elegant details and celebratory attire.'
    },
    {
      id: 'plum',
      name: 'Plum',
      hex: '#5C2059',
      role: 'Rich signature tone',
      description: 'A deep, romantic plum that brings warmth and regal depth to the palette.'
    }
  ];

  return (
    <section id="colors" className="section-padding color-palette-section">
      <div className="max-w-content text-center">
        <span className="section-eyebrow">
          <Palette size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Color of the Day
        </span>
        <h2 className="section-title-script">Mint Green &amp; Plum</h2>
        <p className="section-subtitle">
          Our wedding colors are mint green and plum. Guests are warmly encouraged to celebrate with us in these festive tones.
        </p>

        <div className="color-palette-grid">
          {colors.map((color) => (
            <article className={`color-card color-card-${color.id}`} key={color.id}>
              <div className="color-card-swatch">
                <span className="color-card-role">{color.role}</span>
                <code>{color.hex}</code>
              </div>
              <div className="color-card-copy">
                <h3>{color.name}</h3>
                <p>{color.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="color-attire-note">
          <Palette size={22} aria-hidden="true" />
          <div>
            <strong>Celebrate in Mint Green &amp; Plum <span>#ever_after_21</span></strong>
            <p>Wear either shade or add a thoughtful accent. We look forward to celebrating with you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
