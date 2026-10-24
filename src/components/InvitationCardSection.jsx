import React, { useState } from 'react';
import { Eye, Sparkles, CheckCircle2 } from 'lucide-react';

export default function InvitationCardSection() {
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'

  return (
    <section id="invitation-card" className="section-padding invitation-card-section" style={{ background: 'var(--section-bright)' }}>
      <div className="max-w-content text-center">
        
        {/* Section Header */}
        <span className="section-eyebrow">
          <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Official Access Card &amp; Invitation
        </span>
        <h2 className="section-title-script">
          Your Digital Access Card
        </h2>
        <p className="section-subtitle">
          Kindly present your digital access card upon arrival at the venue. <em>Admits One.</em>
        </p>

        {/* Card Side Toggle Buttons */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(92, 32, 89, 0.08)',
          padding: '5px',
          borderRadius: '40px',
          border: '1px solid var(--nude-border)',
          marginBottom: '2rem',
          gap: '6px'
        }}>
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            style={{
              padding: '8px 22px',
              borderRadius: '30px',
              border: 'none',
              background: activeSide === 'front' ? 'var(--burgundy)' : 'transparent',
              color: activeSide === 'front' ? '#FFFFFF' : 'var(--burgundy-dark)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Access Card (Front)
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('back')}
            style={{
              padding: '8px 22px',
              borderRadius: '30px',
              border: 'none',
              background: activeSide === 'back' ? 'var(--burgundy)' : 'transparent',
              color: activeSide === 'back' ? '#FFFFFF' : 'var(--burgundy-dark)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Invitation Details (Back)
          </button>
        </div>

        {/* Access Card Visual Display */}
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(50, 12, 48, 0.22), 0 0 0 2px rgba(114, 199, 142, 0.4)',
            aspectRatio: '16 / 10',
            background: 'var(--burgundy)'
          }}>
            <img
              src={activeSide === 'front' ? '/assets/ot_access_card_page_1.png' : '/assets/ot_access_card_page_2.png'}
              alt={activeSide === 'front' ? 'Opeyemi & Temilayojesu Access Card' : 'Opeyemi & Temilayojesu Wedding Details Card'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'opacity 0.4s ease'
              }}
            />
          </div>

          {/* Quick Notice Badge */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'var(--olive-soft)',
              color: 'var(--olive-dark)',
              fontWeight: 600,
              fontSize: '0.82rem',
              border: '1px solid var(--olive-light)'
            }}>
              <CheckCircle2 size={15} style={{ color: 'var(--olive)' }} />
              Access Card Admits One
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'var(--burgundy-soft)',
              color: 'var(--burgundy)',
              fontWeight: 600,
              fontSize: '0.82rem',
              border: '1px solid var(--nude-border)'
            }}>
              #EVERAFTER21'
            </span>

            <a
              href={activeSide === 'front' ? '/assets/ot_access_card_page_1.png' : '/assets/ot_access_card_page_2.png'}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--burgundy)',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              <Eye size={15} /> View High-Res
            </a>
          </div>
        </div>

        {/* Written Details Card below */}
        <div className="invitation-card-shell" style={{ marginTop: '3rem' }}>
          <div className="invitation-card-copy">
            <p className="invitation-card-kicker">Kindly join us for the wedding of</p>
            <h2>
              <span>Opeyemi</span>
              <em>and</em>
              <span>Temilayojesu</span>
            </h2>

            <div className="invitation-card-details">
              <div>
                <span>Solemnization of Holy Matrimony &amp; Reception</span>
                <strong>Saturday, 21st November 2026</strong>
                <small>10:00 AM WAT</small>
              </div>
              <div>
                <span>Venue</span>
                <strong>Green Life Event Center, Oregun</strong>
                <small>Plot 2 Kudirat Abiola Way, Oregun, Ikeja, Lagos</small>
              </div>
              <div>
                <span>Color of the Day</span>
                <strong style={{ color: 'var(--burgundy)' }}>Mint Green and Plum</strong>
                <small>Access Card Admits One</small>
              </div>
            </div>

            <p className="invitation-card-note">
              Two hearts united in God's love. A lifetime of forever.
            </p>

            <div className="invitation-card-hashtag" aria-label="#EVERAFTER21'">
              <div className="invitation-card-hashtag-mark" aria-hidden="true">
                <span />
                <i>♥</i>
                <span />
              </div>
              <strong>#EVERAFTER21'</strong>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
