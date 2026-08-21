import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, CreditCard, Gift, HeartHandshake, Loader2, X } from 'lucide-react';
import { createGiftReservation, fetchGiftReservations } from '../lib/supabase';

const giftCardOption = {
  id: 'gift-card-voucher',
  title: 'Gift Card / Voucher',
  category: 'Gift Cards & Vouchers'
};

export default function GiftRegistrySection({ onTriggerToast }) {
  const [giftCardPledges, setGiftCardPledges] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [giverName, setGiverName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchGiftReservations()
      .then((data) => {
        if (!isMounted) return;
        const pledges = Array.isArray(data)
          ? data.filter((row) => row.gift_id === giftCardOption.id)
          : [];
        setGiftCardPledges(pledges);
      })
      .catch((err) => {
        console.log('Gift-card pledge fetch fallback:', err);
        try {
          const stored = localStorage.getItem('wedding_gift_card_pledges');
          if (stored && isMounted) setGiftCardPledges(JSON.parse(stored));
        } catch (e) {}
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('8670260812');
    setCopiedBank(true);

    try {
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 }, colors: ['#C5A059', '#E4C889'] });
    } catch (e) {}

    setTimeout(() => setCopiedBank(false), 3000);
  };

  const handleGiftCardSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!giverName.trim() || !contactNo.trim()) {
      if (onTriggerToast) {
        onTriggerToast({
          type: 'error',
          message: 'Please enter your name and phone/WhatsApp number for the gift-card pledge.'
        });
      }
      return;
    }

    setIsSubmitting(true);
    const nameStr = giverName.trim();
    const contactStr = contactNo.trim();
    const nextPledge = {
      gift_id: giftCardOption.id,
      gift_title: giftCardOption.title,
      giver_name: nameStr,
      contact_no: contactStr,
      created_at: new Date().toISOString()
    };

    try {
      await createGiftReservation({
        giftId: giftCardOption.id,
        giftTitle: giftCardOption.title,
        giverName: nameStr,
        contactNo: contactStr
      });
      setGiftCardPledges((current) => [nextPledge, ...current]);
    } catch (err) {
      console.log('Saved gift-card pledge locally due to database issue:', err);
      const updated = [nextPledge, ...giftCardPledges];
      setGiftCardPledges(updated);
      try {
        localStorage.setItem('wedding_gift_card_pledges', JSON.stringify(updated));
      } catch (e) {}
    } finally {
      setIsSubmitting(false);
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#5B0E2D', '#4A583F', '#8EA682', '#E5D9C3']
      });
    } catch (e) {}

    if (onTriggerToast) {
      onTriggerToast({
        type: 'success',
        message: `Thank you ${nameStr}! Your gift-card pledge has been saved.`
      });
    }

    setSelectedGift(null);
    setGiverName('');
    setContactNo('');
  };

  return (
    <section id="registry" className="section-padding" style={{ background: 'var(--section-sage)' }}>
      <div className="max-w-content text-center">
        <span className="section-eyebrow">
          <Gift size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Wedding Gifts
        </span>
        <h2 className="section-title-script">
          Gifts & Contributions
        </h2>
        <p className="section-subtitle">
          Your presence, prayers, and love are the greatest gifts. For guests who would still love to bless Deborah &amp; Tom, the couple has shared a transfer option and a simple gift-card option.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.2rem',
            alignItems: 'stretch',
            maxWidth: '980px',
            margin: '0 auto',
            textAlign: 'left'
          }}
        >
          <article
            className="glass-card"
            style={{
              padding: '2rem 1.5rem',
              border: '2px solid var(--gold)',
              background: 'rgba(255, 253, 249, 0.92)',
              borderRadius: '22px'
            }}
          >
            <CreditCard size={32} style={{ color: 'var(--burgundy)', marginBottom: '0.8rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--burgundy)', margin: '0.2rem 0' }}>
              Cash & Honeymoon Transfer
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Direct bank transfer details for cash gifts and blessings for the couple.
            </p>

            <div style={{
              background: 'var(--nude-card)',
              border: '1.5px solid var(--nude-border)',
              borderRadius: '14px',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bank Name:</span>
                <strong style={{ color: 'var(--text-dark)', textAlign: 'right' }}>First Bank</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Account Name:</span>
                <strong style={{ color: 'var(--burgundy-dark)', textAlign: 'right' }}>TOM TOY TREATS</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', fontSize: '0.92rem', paddingTop: '0.4rem', borderTop: '1px dashed var(--nude-border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Account Number:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.15rem', color: 'var(--gold-dark)' }}>
                  8670260812
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyAccount}
              className="btn btn-outline-sage"
              style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {copiedBank ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copiedBank ? 'Account Number Copied!' : 'Copy Account Number'}
            </button>
          </article>

          <article
            className="glass-card"
            style={{
              padding: '2rem 1.5rem',
              border: '1.5px solid var(--nude-border)',
              background: 'linear-gradient(135deg, rgba(255, 253, 249, 0.94), rgba(248, 232, 228, 0.74))',
              borderRadius: '22px'
            }}
          >
            <HeartHandshake size={32} style={{ color: 'var(--burgundy)', marginBottom: '0.8rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--burgundy)', margin: '0.2rem 0' }}>
              Gift Card Option
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Prefer to give a shopping voucher, digital card, experience card, or store gift card? You can leave your name here so the couple can track it privately.
            </p>

            <div style={{
              border: '1px solid var(--nude-border)',
              borderRadius: '14px',
              padding: '1rem',
              background: 'rgba(255, 253, 249, 0.72)',
              marginBottom: '1rem'
            }}>
              {isLoading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                  <Loader2 className="spin" size={15} /> Checking gift-card pledges…
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--olive-dark)', fontWeight: 700, fontSize: '0.9rem' }}>
                  <HeartHandshake size={15} />
                  {giftCardPledges.length} {giftCardPledges.length === 1 ? 'gift-card pledge' : 'gift-card pledges'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedGift(giftCardOption)}
              className="btn btn-sage"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Gift size={16} /> Pledge a Gift Card
            </button>
          </article>
        </div>
      </div>

      {selectedGift && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div
            className="glass-card"
            style={{
              width: 'min(92vw, 440px)',
              background: 'var(--nude-card)',
              borderRadius: '24px',
              padding: '2rem 1.5rem',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              textAlign: 'left'
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedGift(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
              aria-label="Close gift-card pledge form"
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Gift size={40} style={{ color: 'var(--burgundy)', margin: '0 auto 0.5rem' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--burgundy)', margin: 0 }}>
                Gift Card Pledge
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Please enter your name so Deborah &amp; Tom can track your gift-card pledge privately.
              </p>
            </div>

            <form onSubmit={handleGiftCardSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="giverName">
                  Your Full Name *
                </label>
                <input
                  id="giverName"
                  type="text"
                  required
                  placeholder="e.g. Uncle & Aunty Okon"
                  className="form-input"
                  value={giverName}
                  onChange={(e) => setGiverName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label" htmlFor="contactNo">
                  Phone / WhatsApp *
                </label>
                <input
                  id="contactNo"
                  type="text"
                  required
                  placeholder="e.g. 08012345678"
                  className="form-input"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedGift(null)}
                  className="btn btn-nude"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sage"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Loader2 className="spin" size={16} /> Saving…
                    </span>
                  ) : (
                    'Confirm Pledge'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
