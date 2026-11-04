import React from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="ot-hero-section">
      <img
        className="ot-hero-floral-frame"
        src="/assets/hero-floral-frame.png"
        alt=""
        aria-hidden="true"
      />

      <div className="ot-hero-content">
        <div className="ot-hero-card">
          <span className="ot-hero-pin" aria-hidden="true" />
          <p className="ot-hero-eyebrow">Together with their families</p>
          <h1 className="ot-hero-title">
            <span>Opeyemi</span>
            <em>&amp;</em>
            <span>Temilayojesu</span>
          </h1>
          <p className="ot-hero-hashtag">#ever_after_21</p>
          <p className="ot-hero-intro">joyfully invite you to celebrate their wedding</p>

          <div className="ot-hero-rule" aria-hidden="true"><span>With joy and gratitude</span></div>

          <div className="ot-hero-details">
            <div className="ot-hero-detail">
              <Calendar aria-hidden="true" />
              <div>
                <span className="ot-hero-detail-label">Wedding Day</span>
                <strong>Saturday, 21 November 2026</strong>
                <small>10:00 AM</small>
              </div>
            </div>
            <div className="ot-hero-detail">
              <MapPin aria-hidden="true" />
              <div>
                <span className="ot-hero-detail-label">Celebration Venue</span>
                <strong>Greenlife Event Center</strong>
                <small>Oregun, Lagos</small>
              </div>
            </div>
          </div>

          <div className="ot-hero-colors" aria-label="Wedding colors: mint green and plum">
            <span className="ot-hero-color-dots" aria-hidden="true">
              <i />
              <i />
            </span>
            <span>Color of the Day</span>
            <strong>Mint Green &amp; Plum</strong>
          </div>

          <div className="ot-hero-actions">
            <a href="#rsvp" className="ot-hero-button ot-hero-button-primary">RSVP Invitation</a>
            <a href="#events" className="ot-hero-button ot-hero-button-secondary">Explore Event Details</a>
          </div>
        </div>

        <a className="ot-hero-scroll" href="#colors" aria-label="Scroll to discover the celebration">
          <span>Scroll to Discover</span>
          <ChevronDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
