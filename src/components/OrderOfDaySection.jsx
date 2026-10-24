import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function OrderOfDaySection() {
  const schedule = [
    {
      time: '10:00 AM',
      title: 'Guest Arrival & Access Card Verification',
      desc: 'Arrival of esteemed guests at Green Life Event Center, Oregun, Lagos. Kindly present your digital or physical Access Card (Admits One).'
    },
    {
      time: '10:45 AM',
      title: 'Processional & Couple’s Entrance',
      desc: 'Grand procession of families, bridal train, and the radiant entrance of Opeyemi & Temilayojesu in rich Plum & Mint Green regal elegance.'
    },
    {
      time: '11:15 AM',
      title: 'Solemnization of Holy Matrimony',
      desc: 'Exchange of vows, blessing of rings, and solemnization of marriage rites before God and witnesses.'
    },
    {
      time: '01:00 PM',
      title: 'Grand Reception & Couple’s First Dance',
      desc: 'Celebration entry of the newlyweds into the reception hall, first dance, and welcome address.'
    },
    {
      time: '02:30 PM',
      title: 'Banquet Feast, Toasts & Cake Cutting',
      desc: 'Gourmet banquet dinner, family toasts, cutting of the wedding cake, and photo sessions.'
    },
    {
      time: '04:30 PM',
      title: 'Open Dance Floor & After-Party',
      desc: 'Celebratory music, bouquet toss, dancing, and memorable moments with friends and family.'
    }
  ];

  return (
    <section id="order" className="section-padding" style={{ background: 'var(--section-bright)' }}>
      <div className="max-w-narrow text-center">
        
        <span className="section-eyebrow">
          <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Program Schedule
        </span>
        <h2 className="section-title-script">
          Order of the Day
        </h2>
        <p className="section-subtitle">
          Saturday, 21st November 2026 • Green Life Event Center, Oregun, Lagos
        </p>

        {/* Timeline list */}
        <div style={{
          marginTop: '3.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          textAlign: 'left'
        }}>
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                padding: '1.4rem 1.6rem',
                borderRadius: '18px',
                border: '1.5px solid var(--nude-border)',
                background: 'var(--nude-card)',
                boxShadow: '0 4px 15px rgba(50, 12, 48, 0.04)',
                position: 'relative'
              }}
            >
              {/* Badge Time Column */}
              <div style={{
                background: 'rgba(92, 32, 89, 0.08)',
                border: '1px solid rgba(114, 199, 142, 0.5)',
                borderRadius: '12px',
                padding: '0.45rem 0.85rem',
                color: 'var(--burgundy)',
                fontWeight: 700,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {item.time}
              </div>

              {/* Title & Description */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  color: 'var(--burgundy)',
                  margin: '0 0 0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
