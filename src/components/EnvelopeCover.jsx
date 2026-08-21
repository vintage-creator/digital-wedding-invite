import React, { useEffect, useState } from 'react';
import { verifyDashboardPasscode } from '../lib/supabase';

export default function EnvelopeCover({ onOpen, onDashboardOpen }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isCardPresented, setIsCardPresented] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const invitationCode = (import.meta.env.VITE_INVITATION_CODE || 'DT2026').trim().toLowerCase();

  useEffect(() => {
    if (isDismissed) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverscroll: body.style.overscrollBehavior
    };

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = '0';
    body.style.width = '100%';
    body.style.overscrollBehavior = 'none';
    body.classList.add('envelope-locked');

    return () => {
      html.style.overflow = previous.htmlOverflow;
      html.style.overscrollBehavior = previous.htmlOverscroll;
      body.style.overflow = previous.bodyOverflow;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      body.classList.remove('envelope-locked');
    };
  }, [isDismissed]);

  const handleSealClick = async () => {
    if (isOpening || isCheckingCode) return;

    const enteredCode = accessCode.trim();

    if (!enteredCode) {
      setAccessError('Please enter the invitation code to open this card.');
      return;
    }

    if (enteredCode.toLowerCase() !== invitationCode) {
      setIsCheckingCode(true);
      setAccessError('');

      try {
        const isDashboardPassword = await verifyDashboardPasscode(enteredCode);
        if (isDashboardPassword) {
          setIsLeaving(true);
          if (onDashboardOpen) onDashboardOpen(enteredCode);

          setTimeout(() => {
            setIsDismissed(true);
            window.requestAnimationFrame(() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            });
          }, 450);
          return;
        }
      } catch (err) {
        console.log('Access verification failed:', err);
      } finally {
        setIsCheckingCode(false);
      }

      setAccessError('We could not verify that access code. Please check it and try again.');
      return;
    }

    setIsOpening(true);

    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    // Guarantee window is scrolled to top when seal is tapped
    try {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } catch (e) {}

    setTimeout(() => {
      setIsCardPresented(true);
    }, 560);
  };

  const handleEnterInvitation = () => {
    setIsLeaving(true);
    if (onOpen) onOpen();

    setTimeout(() => {
      setIsDismissed(true);

      // Reset again after React removes the fixed cover and the page reflows.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const previousBehavior = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          document.documentElement.style.scrollBehavior = previousBehavior;
        });
      });
    }, 650);
  };

  if (isDismissed) return null;

  return (
    <div
      id="cover"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 10000,
        background: 'radial-gradient(circle at 50% 35%, #FAF6F0 0%, #E5D9C3 46%, #8EA682 100%)',
        transition: 'opacity 1s ease',
        opacity: isLeaving ? 0 : 1,
        pointerEvents: isLeaving ? 'none' : 'all',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overscrollBehavior: 'none',
        touchAction: 'none'
      }}
    >
      <div className={`invitation-arrival-copy ${isOpening ? 'invitation-arrival-copy-opening' : ''}`}>
        <span>Your invitation has arrived</span>
        <strong>Deborah &amp; Tom invite you</strong>
          <small>{isCheckingCode ? 'Checking access…' : 'Enter your access code, then tap the wax seal'}</small>
        <form
          className="invitation-code-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSealClick();
          }}
        >
          <label htmlFor="invitationCode">Invitation Code</label>
          <input
            id="invitationCode"
            type="text"
            value={accessCode}
            onChange={(event) => {
              setAccessCode(event.target.value);
              if (accessError) setAccessError('');
            }}
            placeholder="Enter code"
            autoComplete="off"
            disabled={isCheckingCode}
          />
          {accessError && <p role="alert">{accessError}</p>}
        </form>
      </div>

      {/* Full-Screen Real Stage Container matching exact reference ratio */}
      <div
        className={`env-art env-art-3d ${isOpening ? 'env-art-opening' : ''} ${isCardPresented ? 'env-art-card-presented' : ''}`}
        style={{
          position: 'relative',
          width: 'min(100vw, 1280px)',
          height: 'min(100vh, 720px)',
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 1.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Reference Sage Green Paper Envelope Image */}
        <img
          src="/assets/sage_envelope.jpg"
          alt="Deborah & Tom Wedding Envelope"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '16px',
            boxShadow: '0 35px 90px rgba(59, 8, 27, 0.34)',
            filter: 'saturate(0.78) brightness(1.06) contrast(0.96)',
            display: 'block'
          }}
        />

        {/* Ambient Glowing Light Disc behind Seal */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '72%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(150px, 24vw, 280px)',
            height: 'clamp(150px, 24vw, 280px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 242, 178, 0.75) 0%, rgba(197, 160, 89, 0.3) 50%, transparent 75%)',
            zIndex: 9,
            pointerEvents: 'none',
            animation: isOpening ? 'fadeOut 0.5s forwards' : 'glowingAuraPulse 2.8s ease-in-out infinite'
          }}
        />

        {/* 3D Rotating Burgundy Wax Seal Button with D & T Monogram */}
        <button
          id="sealBtn"
          onClick={handleSealClick}
          style={{
            position: 'absolute',
            left: '50%',
            top: '72%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(115px, 18.5vw, 220px)',
            aspectRatio: '1 / 1',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            zIndex: 10,
            filter: 'drop-shadow(0 0 25px rgba(255, 242, 178, 0.9)) drop-shadow(0 14px 28px rgba(35, 10, 20, 0.65))',
            animation: isOpening
              ? 'sealRotateOpen 1.1s cubic-bezier(0.5, -0.3, 0.4, 1) forwards'
              : 'glowingSealPulse 2.8s ease-in-out infinite',
            transition: 'opacity 0.55s ease, transform 0.3s ease'
          }}
          title="Tap Seal to Open Invitation"
          aria-label="Open Invitation"
        >
          <img
            src="/assets/dt-script-wax-seal.png"
            alt="D and T burgundy wax seal"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </button>
      </div>

      {isCardPresented && (
        <div className="cover-invitation-card" role="dialog" aria-label="Deborah and Tom wedding invitation card">
          <div className="cover-invitation-card-inner">
            <img
              src="/assets/dt-logo-mark-transparent.png"
              alt="Deborah and Tomilola wedding logo"
              className="cover-invitation-logo"
            />
            <span className="cover-invitation-eyebrow">You are invited</span>
            <h2>
              <span>Deborah</span>
              <em>and</em>
              <span>Tomilola</span>
            </h2>
            <p>Kindly join us for their wedding celebration.</p>
            <div className="cover-invitation-date">Saturday, 19th December 2026</div>
            <button type="button" onClick={handleEnterInvitation}>
              Accept Invitation
            </button>
          </div>
        </div>
      )}

      <style>{`
        .env-art-3d {
          transform-style: preserve-3d;
          transform: perspective(1400px) rotateX(2deg) rotateY(-1deg) translateY(8px) scale(1);
          animation: envelopeArrives 2.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both,
                     envelopeBreathe 7s ease-in-out 3.25s infinite;
          filter: drop-shadow(0 42px 45px rgba(38, 54, 34, 0.28));
        }

        .env-art-opening {
          animation: envelopeOpenSettle 1.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .invitation-arrival-copy {
          position: absolute;
          z-index: 100;
          top: clamp(24px, 7vh, 74px);
          left: 50%;
          width: min(88vw, 620px);
          transform: translate(-50%, -18px);
          text-align: center;
          color: #3b081b;
          pointer-events: none;
          opacity: 0;
          animation: arrivalCopyIn 0.9s ease 0.65s forwards;
          text-shadow: 0 1px 18px rgba(255, 248, 242, 0.9);
        }

        .invitation-arrival-copy span,
        .invitation-arrival-copy small {
          display: block;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.24em;
        }

        .invitation-arrival-copy span {
          font-size: clamp(0.66rem, 1.5vw, 0.82rem);
          font-weight: 600;
          color: #4a583f;
        }

        .invitation-arrival-copy strong {
          display: block;
          margin: 0.2rem 0 0.25rem;
          font: 400 clamp(2rem, 5vw, 3.3rem) var(--font-script);
          line-height: 1.1;
          color: #5b0e2d;
        }

        .invitation-arrival-copy small {
          font-size: clamp(0.56rem, 1.2vw, 0.68rem);
          color: #4a583f;
        }

        .invitation-code-form {
          width: min(100%, 320px);
          margin: 0.85rem auto 0;
          pointer-events: auto;
        }

        .invitation-code-form label {
          display: block;
          margin-bottom: 0.35rem;
          font: 600 0.68rem var(--font-sans);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3b081b;
        }

        .invitation-code-form input {
          width: 100%;
          min-height: 46px;
          border: 1.5px solid rgba(197, 160, 89, 0.7);
          border-radius: 999px;
          padding: 0.7rem 1.05rem;
          text-align: center;
          font: 600 1rem var(--font-sans);
          color: #263622;
          background: rgba(255, 253, 252, 0.88);
          box-shadow: 0 10px 30px rgba(59, 8, 27, 0.12);
          outline: none;
        }

        .invitation-code-form input:focus {
          border-color: #5b0e2d;
          box-shadow: 0 0 0 4px rgba(139, 158, 123, 0.32), 0 10px 30px rgba(59, 8, 27, 0.12);
        }

        .invitation-code-form p {
          margin-top: 0.45rem;
          font: 600 0.75rem var(--font-sans);
          letter-spacing: 0;
          text-transform: none;
          color: #5b0e2d;
        }

        .invitation-arrival-copy-opening {
          animation: arrivalCopyOut 0.45s ease forwards;
        }

        .cover-invitation-card {
          position: absolute;
          z-index: 120;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(1rem, 3vw, 2rem);
          pointer-events: auto;
          animation: coverCardBackdropIn 0.65s ease forwards;
          perspective: 1400px;
        }

        .cover-invitation-card-inner {
          width: min(88vw, 500px);
          min-height: min(78dvh, 680px);
          max-height: min(88dvh, 760px);
          overflow: auto;
          scrollbar-width: none;
          padding: clamp(2rem, 5.2vw, 4.6rem) clamp(1.25rem, 4.5vw, 3.3rem);
          border: 1px solid rgba(197, 160, 89, 0.28);
          border-radius: 6px;
          background:
            radial-gradient(circle at 50% 44%, rgba(255, 255, 255, 0.88), transparent 49%),
            repeating-linear-gradient(90deg, rgba(38, 54, 34, 0.026) 0 1px, transparent 1px 6px),
            repeating-linear-gradient(0deg, rgba(91, 14, 45, 0.018) 0 1px, transparent 1px 7px),
            linear-gradient(180deg, rgba(255, 254, 250, 0.98), rgba(250, 246, 238, 0.98));
          box-shadow:
            0 34px 90px rgba(38, 54, 34, 0.34),
            inset 0 0 0 10px rgba(255, 255, 255, 0.42),
            inset 0 0 54px rgba(197, 160, 89, 0.10);
          text-align: center;
          transform-origin: 50% 100%;
          animation: invitationCardRise 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cover-invitation-card-inner::-webkit-scrollbar {
          display: none;
        }

        .cover-invitation-card-inner::before {
          content: '';
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(197, 160, 89, 0.25);
          pointer-events: none;
          z-index: 3;
        }

        .cover-invitation-card-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/assets/invitation-floral-relief.png') center / 100% 100% no-repeat;
          opacity: 0.72;
          filter: drop-shadow(7px 10px 12px rgba(38, 54, 34, 0.12));
          pointer-events: none;
          z-index: 1;
        }

        .cover-invitation-card-inner > * {
          position: relative;
          z-index: 2;
        }

        .cover-invitation-logo {
          width: min(36vw, 132px);
          aspect-ratio: 1 / 1;
          object-fit: contain;
          margin: 0 auto 1rem;
          display: block;
          opacity: 0.76;
          mix-blend-mode: multiply;
          filter: drop-shadow(0 8px 14px rgba(38, 54, 34, 0.08));
        }

        .cover-invitation-eyebrow {
          display: block;
          font: 700 0.68rem var(--font-sans);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #4a583f;
        }

        .cover-invitation-card h2 {
          margin: 1.15rem 0 1.05rem;
          color: #151913;
          font-family: var(--font-serif);
          line-height: 1.08;
          text-transform: uppercase;
          letter-spacing: clamp(0.16em, 2vw, 0.3em);
        }

        .cover-invitation-card h2 span {
          display: block;
          font-size: clamp(2rem, 8.2vw, 3.35rem);
          font-weight: 400;
        }

        .cover-invitation-card h2 em {
          display: block;
          margin: 0.12rem 0;
          color: #5b0e2d;
          font: 400 clamp(1.35rem, 5vw, 2rem) var(--font-script);
          letter-spacing: 0;
          text-transform: none;
        }

        .cover-invitation-card p {
          color: #4a583f;
          font: 500 0.92rem var(--font-serif);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          max-width: 380px;
          margin: 0 auto;
        }

        .cover-invitation-date {
          margin: 1rem auto 1.15rem;
          color: #9a7734;
          font: 700 0.8rem var(--font-sans);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .cover-invitation-card button {
          border: 1px solid rgba(228, 200, 137, 0.55);
          border-radius: 999px;
          padding: 0.78rem 1.35rem;
          background: linear-gradient(135deg, #4a583f, #263622);
          color: #fff;
          font: 700 0.75rem var(--font-sans);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(38, 54, 34, 0.24);
        }

        @keyframes envelopeArrives {
          0% {
            opacity: 0;
            transform: perspective(1400px) translateY(48vh) rotateX(18deg) rotateZ(-2deg) scale(0.72);
          }
          72% {
            opacity: 1;
            transform: perspective(1400px) translateY(-7px) rotateX(-1.5deg) rotateZ(0.35deg) scale(1.025);
          }
          100% {
            opacity: 1;
            transform: perspective(1400px) translateY(8px) rotateX(2deg) rotateY(-1deg) scale(1);
          }
        }

        @keyframes envelopeBreathe {
          0%, 100% { transform: perspective(1400px) translateY(8px) rotateX(2deg) rotateY(-1deg) scale(1); }
          50% { transform: perspective(1400px) translateY(2px) rotateX(1deg) rotateY(1deg) scale(1.005); }
        }

        @keyframes envelopeOpenSettle {
          0% { transform: perspective(1400px) translateY(8px) rotateX(2deg) rotateY(-1deg) scale(1); }
          34% { transform: perspective(1400px) translate(-5vw, 9vh) rotateX(5deg) rotateY(1deg) rotateZ(-2.5deg) scale(0.96); }
          100% { transform: perspective(1400px) translate(-18vw, 31vh) rotateX(3deg) rotateY(2deg) rotateZ(-7deg) scale(0.72); opacity: 0.68; }
        }

        @keyframes arrivalCopyIn {
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @keyframes arrivalCopyOut {
          to { opacity: 0; transform: translate(-50%, -14px); }
        }

        @keyframes glowingAuraPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.14);
            opacity: 0.95;
          }
        }
        @keyframes glowingSealPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 22px rgba(255, 242, 178, 0.85)) drop-shadow(0 14px 28px rgba(35, 10, 20, 0.65));
          }
          50% {
            transform: translate(-50%, -50%) scale(1.045);
            filter: drop-shadow(0 0 35px rgba(255, 255, 255, 0.95)) drop-shadow(0 18px 34px rgba(35, 10, 20, 0.75));
          }
        }
        @keyframes sealRotateOpen {
          0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translate(-50%, -50%) scale(0.9) rotate(-15deg);
          }
          65% {
            transform: translate(-50%, -50%) scale(1.35) rotate(240deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(-50%, -55%) scale(1.75) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fadeOut {
          to { opacity: 0; }
        }

        @keyframes coverCardBackdropIn {
          from { background: rgba(38, 54, 34, 0); }
          to { background: rgba(38, 54, 34, 0.18); }
        }

        @keyframes invitationCardRise {
          from {
            opacity: 0;
            transform: translateY(40vh) scale(0.56) rotateX(22deg);
            clip-path: inset(64% 10% 0 10% round 8px);
          }
          42% {
            opacity: 1;
            transform: translateY(16vh) scale(0.78) rotateX(9deg);
            clip-path: inset(32% 5% 0 5% round 8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
            clip-path: inset(0 0 0 0 round 8px);
          }
        }

        @media (max-width: 700px) {
          .invitation-arrival-copy {
            top: max(18px, 3.5svh);
            width: 92vw;
          }
          .invitation-arrival-copy strong { font-size: clamp(1.8rem, 10vw, 2.75rem); }
          .env-art-3d {
            width: 122vw !important;
            height: min(68svh, 580px) !important;
            max-height: 580px;
          }
          #sealBtn {
            width: clamp(104px, 31vw, 150px) !important;
          }
          .cover-invitation-card {
            align-items: center;
            padding: 0.8rem max(0.8rem, env(safe-area-inset-right)) max(0.8rem, env(safe-area-inset-bottom)) max(0.8rem, env(safe-area-inset-left));
          }
          .cover-invitation-card-inner {
            width: min(94vw, 430px);
            min-height: min(78dvh, 640px);
            max-height: 84dvh;
            padding: 1.5rem 1.05rem;
          }
          .cover-invitation-logo {
            width: min(38vw, 132px);
          }
          .cover-invitation-card h2 span {
            font-size: clamp(1.7rem, 9vw, 2.65rem);
          }
          .cover-invitation-card p,
          .cover-invitation-date {
            font-size: 0.72rem;
          }
          .env-art-opening {
            animation-name: envelopeOpenSettleMobile;
          }
        }

        @media (min-width: 701px) and (max-width: 1024px) {
          .env-art-3d {
            width: 108vw !important;
            height: min(72svh, 700px) !important;
          }
          .invitation-arrival-copy { top: 5svh; }
        }

        @media (max-height: 520px) and (orientation: landscape) {
          .invitation-arrival-copy {
            top: 10px;
            transform: translate(-50%, 0);
          }
          .invitation-arrival-copy span,
          .invitation-arrival-copy small { display: none; }
          .invitation-arrival-copy strong { font-size: 1.8rem; }
          .env-art-3d {
            width: min(88vw, 920px) !important;
            height: 90svh !important;
          }
          .cover-invitation-logo { display: none; }
          .cover-invitation-card-inner {
            min-height: auto;
            max-height: 86svh;
            padding: 1rem;
          }
          .cover-invitation-eyebrow { font-size: 0.58rem; }
          .cover-invitation-card h2 { margin: 0.45rem 0; }
          .cover-invitation-card h2 span { font-size: clamp(1.4rem, 7vw, 2.1rem); }
          .cover-invitation-card p,
          .cover-invitation-date { font-size: 0.66rem; }
          #sealBtn { width: clamp(82px, 15vw, 126px) !important; }
        }

        @keyframes envelopeOpenSettleMobile {
          0% { transform: perspective(1400px) translateY(8px) rotateX(2deg) rotateY(-1deg) scale(1); }
          34% { transform: perspective(1400px) translate(-3vw, 8vh) rotateX(4deg) rotateY(1deg) rotateZ(-2deg) scale(0.98); }
          100% { transform: perspective(1400px) translate(-11vw, 32vh) rotateX(2deg) rotateY(1deg) rotateZ(-6deg) scale(0.78); opacity: 0.6; }
        }

        @media (prefers-reduced-motion: reduce) {
          .env-art-3d,
          .invitation-arrival-copy {
            animation: none;
            opacity: 1;
            transform: translate(-50%, 0);
          }

          .env-art-3d {
            transform: perspective(1400px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
