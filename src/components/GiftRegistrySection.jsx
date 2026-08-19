import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift, CreditCard, CheckCircle2, Copy, X, HeartHandshake, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { fetchGiftReservations, createGiftReservation } from '../lib/supabase';

export default function GiftRegistrySection({ onTriggerToast }) {
  // claimedGifts: { [giftId]: Array<{ giverName: string, date: string }> }
  const [claimedGifts, setClaimedGifts] = useState({});
  const [selectedGift, setSelectedGift] = useState(null);
  const [giverName, setGiverName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);

  const registryItems = [
    { id: 'gift-cards', title: 'Gift Cards', category: 'Vouchers & Experiences', categoryGroup: 'vouchers' },
    { id: 'dinnerware', title: 'High-Quality Dinnerware Set', category: 'Dining & Kitchen', categoryGroup: 'kitchen' },
    { id: 'cutlery', title: 'Premium Cutlery Set', category: 'Dining & Kitchen', categoryGroup: 'kitchen' },
    { id: 'wine-glasses', title: 'Wine & Champagne Glasses', category: 'Glassware', categoryGroup: 'kitchen' },
    { id: 'whiskey-glasses', title: 'Whiskey & Tumbler Glasses', category: 'Glassware', categoryGroup: 'kitchen' },
    { id: 'coffee-tea-set', title: 'Coffee & Tea Porcelain Set', category: 'Dining & Kitchen', categoryGroup: 'kitchen' },
    { id: 'air-fryer', title: 'Digital Air Fryer', category: 'Home Appliances', categoryGroup: 'appliances' },
    { id: 'blender', title: 'High-Speed Countertop Blender', category: 'Home Appliances', categoryGroup: 'appliances' },
    { id: 'food-processor', title: 'Multi-Function Food Processor', category: 'Home Appliances', categoryGroup: 'appliances' },
    { id: 'stand-mixer', title: 'Electric Stand Mixer', category: 'Baking & Kitchen', categoryGroup: 'appliances' },
    { id: 'toaster', title: '4-Slice Electric Toaster', category: 'Home Appliances', categoryGroup: 'appliances' },
    { id: 'electric-kettle', title: 'Cordless Electric Kettle', category: 'Home Appliances', categoryGroup: 'appliances' },
    { id: 'microwave', title: 'Digital Microwave Oven', category: 'Home Appliances', categoryGroup: 'appliances' },
    { id: 'robot-vacuum', title: 'Smart Robot Vacuum Cleaner', category: 'Home Tech', categoryGroup: 'electronics' },
    { id: 'large-tv', title: 'Large-Screen 4K Smart TV', category: 'Electronics', categoryGroup: 'electronics' },
    { id: 'fridge', title: 'Double Door Fridge / Freezer', category: 'Home Appliances', categoryGroup: 'appliances' },
    { id: 'air-purifier', title: 'HEPA Air Purifier', category: 'Home Care', categoryGroup: 'electronics' },
    { id: 'soundbar', title: 'Premium Soundbar Surround System', category: 'Electronics', categoryGroup: 'electronics' },
    { id: 'smart-speaker', title: 'Smart Home Voice Speaker', category: 'Electronics', categoryGroup: 'electronics' },
    { id: 'pots-pans', title: 'Non-Stick Pots & Pans Cookware Set', category: 'Cookware', categoryGroup: 'cookware' },
    { id: 'baking-set', title: 'Professional Baking Pan Set', category: 'Baking', categoryGroup: 'cookware' },
    { id: 'serving-platters', title: 'Crystal & Ceramic Serving Platters', category: 'Dining', categoryGroup: 'kitchen' }
  ];

  const categories = [
    { id: 'all', name: 'All Wishes' },
    { id: 'kitchen', name: 'Dining & Kitchen' },
    { id: 'appliances', name: 'Home Appliances' },
    { id: 'electronics', name: 'Electronics & Tech' },
    { id: 'cookware', name: 'Cookware & Baking' },
    { id: 'vouchers', name: 'Gift Vouchers' }
  ];

  // Fetch live gift reservations from Supabase database
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchGiftReservations()
      .then((data) => {
        if (!isMounted) return;
        const mapped = {};
        if (Array.isArray(data)) {
          data.forEach((row) => {
            if (!mapped[row.gift_id]) {
              mapped[row.gift_id] = [];
            }
            mapped[row.gift_id].push({
              giverName: row.giver_name,
              date: row.created_at ? new Date(row.created_at).toLocaleDateString() : ''
            });
          });
        }
        setClaimedGifts(mapped);
      })
      .catch((err) => {
        console.log('Database fetch fallback to localStorage:', err);
        try {
          const stored = localStorage.getItem('wedding_claimed_gifts');
          if (stored && isMounted) {
            const parsed = JSON.parse(stored);
            // Handle both array format and single object format gracefully
            const normalized = {};
            Object.keys(parsed).forEach((key) => {
              normalized[key] = Array.isArray(parsed[key]) ? parsed[key] : [parsed[key]];
            });
            setClaimedGifts(normalized);
          }
        } catch (e) {}
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = registryItems.filter(
    (item) => activeCategory === 'all' || item.categoryGroup === activeCategory
  );

  const displayedItems = filteredItems.slice(0, visibleCount);
  const remainingCount = filteredItems.length - visibleCount;

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setVisibleCount(8); // Reset to initial 8 items on category switch
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!giverName.trim() || !selectedGift || isSubmitting) return;

    setIsSubmitting(true);
    const giftId = selectedGift.id;
    const giftTitle = selectedGift.title;
    const nameStr = giverName.trim();

    const localEntry = {
      giverName: nameStr,
      date: new Date().toLocaleDateString()
    };

    const existingList = Array.isArray(claimedGifts[giftId]) ? claimedGifts[giftId] : [];
    const updatedList = [...existingList, localEntry];
    const updatedState = { ...claimedGifts, [giftId]: updatedList };
    setClaimedGifts(updatedState);

    try {
      await createGiftReservation({
        giftId,
        giftTitle,
        giverName: nameStr,
        contactNo: contactNo.trim() || null
      });
    } catch (err) {
      console.log('Saved locally due to database offline:', err);
      try {
        localStorage.setItem('wedding_claimed_gifts', JSON.stringify(updatedState));
      } catch (e) {}
    } finally {
      setIsSubmitting(false);
    }

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.75 },
        colors: ['#5C6E4E', '#8F8D5F', '#C5A059', '#E5D9C3']
      });
    } catch (e) {}

    if (onTriggerToast) {
      onTriggerToast({
        type: 'success',
        message: `Thank you ${nameStr}! Your gift pledge for "${giftTitle}" has been recorded.`
      });
    }

    setSelectedGift(null);
    setGiverName('');
    setContactNo('');
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('8670260812');
    setCopiedBank(true);

    try {
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 }, colors: ['#5C6E4E', '#C5A059', '#E4C889'] });
    } catch (e) {}

    setTimeout(() => setCopiedBank(false), 3000);
  };

  return (
    <section id="registry" className="section-padding" style={{ background: '#FAF6F0' }}>
      <div className="max-w-content text-center">
        
        <span className="section-eyebrow" style={{ color: 'var(--olive)' }}>
          <Gift size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Wedding Gift Registry
        </span>
        <h2 className="section-title-script" style={{ color: '#4A583F' }}>
          Gift Wishlist & Contributions
        </h2>
        <p className="section-subtitle">
          Your love, presence, and prayers are our greatest gift. If you would like to honor us with a gift or cash contribution, you may select any wishlist item or transfer to the account below.
        </p>

        {/* Bank Account Details Card */}
        <div
          className="glass-card"
          style={{
            maxWidth: '560px',
            margin: '0 auto 3.5rem',
            padding: '2rem 1.5rem',
            border: '1.5px solid var(--nude-border)',
            background: '#FFFFFF',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(74, 88, 63, 0.07)'
          }}
        >
          <CreditCard size={30} style={{ color: '#5C6E4E', margin: '0 auto 0.6rem' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#4A583F', margin: '0.2rem 0' }}>
            Cash & Honeymoon Transfer Details
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Direct bank transfer details for cash gifts and blessings for Deborah & Tom.
          </p>

          <div style={{
            background: '#FAF6F0',
            border: '1px solid var(--nude-border)',
            borderRadius: '14px',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Bank Name:</span>
              <strong style={{ color: 'var(--text-dark)' }}>First Bank</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account Name:</span>
              <strong style={{ color: '#4A583F' }}>TOM TOY TREATS</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', paddingTop: '0.4rem', borderTop: '1px dashed var(--nude-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account Number:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.15rem', color: '#5C6E4E' }}>
                8670260812
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyAccount}
            className="btn btn-outline-burgundy"
            style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {copiedBank ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copiedBank ? 'Account Number Copied!' : 'Copy Account Number (8670260812)'}
          </button>
        </div>

        {/* Physical Gift Registry Header */}
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#4A583F', marginBottom: '1rem' }}>
          Physical Gift Wishlist ({registryItems.length} Items)
        </h3>

        {/* Category Filter Pills Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          marginBottom: '2.5rem'
        }}>
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? registryItems.length
              : registryItems.filter((i) => i.categoryGroup === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '30px',
                  border: isActive ? '1.5px solid #6D825E' : '1px solid var(--nude-border)',
                  background: isActive ? 'linear-gradient(135deg, #5C6E4E, #45543A)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-dark)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isActive ? '0 4px 14px rgba(74, 88, 63, 0.22)' : 'none'
                }}
              >
                <span>{cat.name}</span>
                <span style={{
                  fontSize: '0.72rem',
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(74, 88, 63, 0.1)',
                  color: isActive ? '#FFFFFF' : '#4A583F',
                  padding: '2px 7px',
                  borderRadius: '10px'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 0.5rem', color: '#5C6E4E' }} />
            <p style={{ fontSize: '0.9rem' }}>Loading wishlist items…</p>
          </div>
        ) : (
          <>
            {/* Displayed Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.2rem',
              textAlign: 'left'
            }}>
              {displayedItems.map((item) => {
                const reservations = Array.isArray(claimedGifts[item.id]) ? claimedGifts[item.id] : [];
                const hasReservations = reservations.length > 0;

                return (
                  <div
                    key={item.id}
                    className="glass-card"
                    style={{
                      borderRadius: '16px',
                      padding: '1.4rem',
                      border: '1.5px solid var(--nude-border)',
                      background: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div>
                      {/* Top Badge Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#7A896B', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                          {item.category}
                        </span>

                        {hasReservations ? (
                          <span style={{
                            background: 'rgba(74, 88, 63, 0.12)',
                            color: '#4A583F',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Sparkles size={11} /> {reservations.length} {reservations.length === 1 ? 'Pledge' : 'Pledges'}
                          </span>
                        ) : (
                          <span style={{
                            background: 'rgba(230, 216, 195, 0.4)',
                            color: '#6B5B63',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: '10px'
                          }}>
                            Available
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.15rem',
                        color: 'var(--text-dark)',
                        margin: '0 0 0.5rem 0',
                        lineHeight: 1.3
                      }}>
                        {item.title}
                      </h4>

                      {hasReservations && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5C6E4E', fontSize: '0.82rem', marginTop: '0.6rem' }}>
                          <HeartHandshake size={14} />
                          <span>
                            Gifted with love by <strong>{reservations[reservations.length - 1].giverName}</strong>
                            {reservations.length > 1 && ` (+${reservations.length - 1} more)`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Open Action Button (Always Accessible to All Guests) */}
                    <div style={{ marginTop: '1.2rem' }}>
                      <button
                        onClick={() => setSelectedGift(item)}
                        className="btn btn-burgundy"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                      >
                        <Gift size={15} /> Reserve / Gift This Item
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More / Show Less CTA Button */}
            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              {remainingCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="btn btn-outline-burgundy"
                  style={{ padding: '12px 28px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <ChevronDown size={18} /> Show More Wishes ({remainingCount} Remaining)
                </button>
              ) : (
                filteredItems.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount(8)}
                    className="btn btn-outline-burgundy"
                    style={{ padding: '10px 24px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <ChevronUp size={16} /> Show Less
                  </button>
                )
              )}
            </div>
          </>
        )}

      </div>

      {/* Claim Item Modal */}
      {selectedGift && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(42, 29, 36, 0.45)',
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
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '2rem 1.5rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              textAlign: 'left'
            }}
          >
            <button
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
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Gift size={38} style={{ color: '#5C6E4E', margin: '0 auto 0.5rem' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#4A583F', margin: 0 }}>
                Reserve Gift for Couple
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#7A896B', fontWeight: 600, margin: '0.2rem 0' }}>
                "{selectedGift.title}"
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Please enter your name so Deborah & Tom know of your kind gift and blessing.
              </p>
            </div>

            <form onSubmit={handleClaimSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="giverName" style={{ color: '#4A583F' }}>
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
                <label className="form-label" htmlFor="contactNo" style={{ color: '#4A583F' }}>
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  id="contactNo"
                  type="text"
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
                  className="btn btn-outline-burgundy"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-burgundy"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Loader2 className="animate-spin" size={16} /> Saving…
                    </span>
                  ) : (
                    'Confirm Gift'
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
