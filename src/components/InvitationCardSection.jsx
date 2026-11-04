import React from 'react';

export default function InvitationCardSection() {
  return (
    <section id="invitation-card" className="section-padding invitation-card-section" style={{ background: 'var(--section-bright)' }}>
      <div className="max-w-content text-center">
        <span className="section-eyebrow">Wedding Invitation</span>
        <h2 className="section-title-script">The Invitation</h2>
        <p className="section-subtitle">
          Your access card will be shared separately. Please remember to bring it, even after you RSVP.
        </p>

        <div className="invitation-card-shell" style={{ marginTop: '2rem' }}>
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
                <strong>Greenlife Event Center, Oregun</strong>
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

            <div className="invitation-card-hashtag" aria-label="#ever_after_21">
              <div className="invitation-card-hashtag-mark" aria-hidden="true">
                <span />
                <i>♥</i>
                <span />
              </div>
              <strong>#ever_after_21</strong>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
