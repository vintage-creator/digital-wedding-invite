import React from 'react';

export default function InvitationCardSection() {
  return (
    <section id="invitation-card" className="section-padding invitation-card-section">
      <div className="max-w-content">
        <div className="invitation-card-shell">
          <div className="invitation-card-logo-wrap">
            <img
              src="/assets/dt-logo-mark-transparent.png"
              alt="Deborah and Tomilola wedding logo"
              className="invitation-card-logo"
            />
          </div>

          <div className="invitation-card-copy">
            <p className="invitation-card-kicker">Kindly join us for the wedding of</p>
            <h2>
              <span>Deborah</span>
              <em>and</em>
              <span>Tomilola</span>
            </h2>

            <div className="invitation-card-details">
              <div>
                <span>Traditional Marriage</span>
                <strong>Thursday, 17th December 2026</strong>
                <small>The Nest Gardens, Guzape, Abuja</small>
              </div>
              <div>
                <span>White Wedding &amp; Reception</span>
                <strong>Saturday, 19th December 2026</strong>
                <small>Bolton White Event Centre, Wuse Zone 7</small>
              </div>
              <div>
                <span>Reception to follow</span>
                <strong>31 Kigoma Street, Wuse Zone 7, Abuja</strong>
              </div>
            </div>

            <p className="invitation-card-note">
              Two hearts. One promise. A lifetime together.
            </p>

            <div className="invitation-card-hashtag" aria-label="#TheBestOfDeb #dtlovestory">
              <div className="invitation-card-hashtag-mark" aria-hidden="true">
                <span />
                <i>♥</i>
                <span />
              </div>
              <strong>#DTLovetale26</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
