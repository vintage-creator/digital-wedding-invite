import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <img
        className="footer-botanical-frame"
        src="/assets/footer-botanical-sprays.png"
        alt=""
        aria-hidden="true"
      />
      <div className="site-footer-content">
        <div className="footer-seal-badge" role="img" aria-label="Opeyemi and Temilayojesu O and T wax seal">
          <img className="footer-seal-art" src="/assets/dt-script-wax-seal.png" alt="" aria-hidden="true" />
          <span className="footer-seal-monogram" aria-hidden="true">
            <span>O</span>
            <span className="footer-seal-ampersand">&amp;</span>
            <span>T</span>
          </span>
        </div>

        <p className="footer-kicker">With love,</p>
        <h2 className="footer-couple-names">Opeyemi <span>&amp;</span> Temilayojesu</h2>
        <p className="footer-hashtag">#ever_after_21</p>

        <div className="footer-event-details">
          <span><Calendar size={16} aria-hidden="true" /> Saturday, 21 November 2026 · 10:00 AM</span>
          <span><MapPin size={16} aria-hidden="true" /> Greenlife Event Center, Oregun, Lagos</span>
        </div>

        <p className="footer-credit">
          Crafted with love for Opeyemi &amp; Temilayojesu’s wedding celebration · © 2026
        </p>
      </div>
    </footer>
  );
}
