import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  Gift,
  Link,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Users,
  XCircle
} from 'lucide-react';
import {
  fetchCoupleDashboard,
  updateDashboardGiftStatus,
  updateDashboardPhotoStatus,
  updateDashboardRsvpStatus
} from '../lib/supabase';

const attendanceLabels = {
  both: 'Both events',
  traditional: 'Traditional only',
  white: 'White wedding only',
  decline: 'Declined'
};

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function CoupleDashboard({ dashboardPasscode, onTriggerToast, onExit }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('rsvps');
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [activePhoto, setActivePhoto] = useState(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const dashboard = await fetchCoupleDashboard(dashboardPasscode);
      setData(dashboard);
      setLastRefreshed(new Date().toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      }));
    } catch (err) {
      if (onTriggerToast) {
        onTriggerToast({
          type: 'error',
          message: 'Could not load the couple dashboard. Please check the dashboard password and database SQL.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [dashboardPasscode]);

  const stats = data?.stats || {};
  const rsvps = data?.rsvps || [];
  const gifts = data?.gift_reservations || [];
  const photos = data?.guest_photos || [];

  const groupedRsvps = useMemo(() => ({
    attending: rsvps.filter((item) => item.attendance !== 'decline'),
    declined: rsvps.filter((item) => item.attendance === 'decline')
  }), [rsvps]);

  const needsFollowUpCount = rsvps.filter((item) => item.status === 'needs_follow_up').length;

  const handleCopySummary = async () => {
    const summary = [
      'Deborah & Tom Wedding Dashboard Summary',
      `Total RSVPs: ${stats.total_rsvps || 0}`,
      `Expected Guests: ${stats.expected_guests || 0}`,
      `Attending RSVPs: ${stats.attending_rsvps || 0}`,
      `Declined RSVPs: ${stats.declined_rsvps || 0}`,
      `Gift Pledges: ${stats.reserved_gifts || 0}`,
      `Guest Photos: ${stats.uploaded_photos || 0}`,
      needsFollowUpCount ? `Needs Follow-up: ${needsFollowUpCount}` : null
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      if (onTriggerToast) onTriggerToast({ type: 'success', message: 'Dashboard summary copied.' });
    } catch (err) {
      if (onTriggerToast) onTriggerToast({ type: 'error', message: 'Could not copy dashboard summary.' });
    }
  };

  const handleRsvpStatus = async (rsvpId, nextStatus) => {
    setActionId(`rsvp-${rsvpId}`);
    try {
      await updateDashboardRsvpStatus({ passcode: dashboardPasscode, rsvpId, nextStatus });
      await loadDashboard();
      if (onTriggerToast) onTriggerToast({ type: 'success', message: 'RSVP status updated.' });
    } catch (err) {
      if (onTriggerToast) onTriggerToast({ type: 'error', message: 'Could not update RSVP status.' });
    } finally {
      setActionId('');
    }
  };

  const handleGiftStatus = async (reservationId, nextStatus) => {
    setActionId(`gift-${reservationId}`);
    try {
      await updateDashboardGiftStatus({ passcode: dashboardPasscode, reservationId, nextStatus });
      await loadDashboard();
      if (onTriggerToast) onTriggerToast({ type: 'success', message: 'Gift pledge status updated.' });
    } catch (err) {
      if (onTriggerToast) onTriggerToast({ type: 'error', message: 'Could not update gift pledge.' });
    } finally {
      setActionId('');
    }
  };

  const handlePhotoStatus = async (photoId, nextStatus) => {
    setActionId(`photo-${photoId}`);
    try {
      const updatedPhoto = await updateDashboardPhotoStatus({ passcode: dashboardPasscode, photoId, nextStatus });
      if (activePhoto?.id === photoId) {
        setActivePhoto((current) => current ? { ...current, ...updatedPhoto } : current);
      }
      await loadDashboard();
      if (onTriggerToast) {
        onTriggerToast({
          type: 'success',
          message: nextStatus === 'hidden'
            ? 'Photo hidden from the public gallery.'
            : 'Photo is now visible on the public gallery.'
        });
      }
    } catch (err) {
      if (onTriggerToast) onTriggerToast({ type: 'error', message: 'Could not update photo status.' });
    } finally {
      setActionId('');
    }
  };

  const handlePhotoDownload = async (photo) => {
    try {
      const response = await fetch(photo.public_url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `Deborah_Tom_${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      if (onTriggerToast) onTriggerToast({ type: 'success', message: 'Photo download started.' });
    } catch (err) {
      window.open(photo.public_url, '_blank', 'noopener,noreferrer');
      if (onTriggerToast) onTriggerToast({ type: 'info', message: 'Photo opened in a new tab for download.' });
    }
  };

  const getPhotoShareText = (photo) => {
    const caption = photo.caption || 'A beautiful moment from Deborah & Tom’s wedding';
    return `${caption}\n#TheBestOfDeb`;
  };

  const handleCopyPhotoLink = async (photo) => {
    try {
      await navigator.clipboard.writeText(photo.public_url);
      if (onTriggerToast) onTriggerToast({ type: 'success', message: 'Photo link copied.' });
    } catch (err) {
      if (onTriggerToast) onTriggerToast({ type: 'error', message: 'Could not copy photo link.' });
    }
  };

  const openSharePlatform = (platform, photo) => {
    const encodedUrl = encodeURIComponent(photo.public_url);
    const encodedText = encodeURIComponent(getPhotoShareText(photo));
    const links = {
      whatsapp: `https://wa.me/?text=${encodedText}%0A${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    };

    window.open(links[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="couple-dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="section-eyebrow">Private Couple Dashboard</span>
          <h1>Deborah &amp; Tom’s Wedding Console</h1>
          <p>
            A quiet place to see who is coming, who needs a reply, and the memories guests are sharing.
          </p>
          {lastRefreshed && (
            <small className="dashboard-last-updated">Last refreshed at {lastRefreshed}</small>
          )}
        </div>
        <div className="dashboard-hero-actions">
          <button type="button" className="btn btn-nude" onClick={handleCopySummary}>
            <ClipboardList size={16} />
            Copy Summary
          </button>
          <button type="button" className="btn btn-outline-burgundy" onClick={loadDashboard}>
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            Refresh
          </button>
          <button type="button" className="btn btn-burgundy" onClick={onExit}>
            <ArrowLeft size={16} />
            View Invitation
          </button>
        </div>
      </section>

      {isLoading && !data ? (
        <section className="dashboard-loading glass-card">
          <Loader2 className="spin" size={28} />
          <p>Loading dashboard…</p>
        </section>
      ) : (
        <>
          <section className="dashboard-overview-card">
            <div className="dashboard-overview-mark">
              <img src="/assets/dt-logo-mark-transparent.png" alt="Deborah and Tom logo" />
            </div>
            <div>
              <span>Today at a glance</span>
              <h2>Keep the celebration beautifully organized.</h2>
              <p>
                Check new replies, thank guests for their gifts, and keep the photo wall looking lovely as the day draws closer.
              </p>
            </div>
            <div className="dashboard-overview-mini">
              <strong>{needsFollowUpCount}</strong>
              <span>Need follow-up</span>
            </div>
          </section>

          <section className="dashboard-stats-grid">
            {[
              { label: 'RSVPs', value: stats.total_rsvps || 0, icon: Users, hint: 'All submitted responses' },
              { label: 'Expected Guests', value: stats.expected_guests || 0, icon: CheckCircle2, hint: 'Guest counts from attending RSVPs' },
              { label: 'Gift Pledges', value: stats.reserved_gifts || 0, icon: Gift, hint: 'Gift-card/voucher pledges' },
              { label: 'Guest Photos', value: stats.uploaded_photos || 0, icon: Camera, hint: 'Published photo uploads' }
            ].map((item) => (
              <article className="dashboard-stat-card" key={item.label}>
                <item.icon size={20} />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <small>{item.hint}</small>
              </article>
            ))}
          </section>

          <nav className="dashboard-tabs" aria-label="Dashboard sections">
            {[
              { id: 'rsvps', label: `RSVPs (${rsvps.length})` },
              { id: 'gifts', label: `Gift Pledges (${gifts.length})` },
              { id: 'photos', label: `Photos (${photos.length})` }
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === 'rsvps' && (
            <section className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>RSVP responses</h2>
                  <p>{groupedRsvps.attending.length} attending responses · {groupedRsvps.declined.length} declined</p>
                </div>
              </div>

              <div className="dashboard-list">
                {rsvps.length === 0 ? (
                  <div className="dashboard-empty">
                    <Users size={26} />
                    <h3>No RSVPs yet</h3>
                    <p>Guest responses will appear here immediately after they submit the RSVP form.</p>
                  </div>
                ) : rsvps.map((rsvp) => (
                  <article className="dashboard-record" key={rsvp.id}>
                    <div>
                      <div className="dashboard-record-title">
                        <h3>{rsvp.full_name}</h3>
                        <span>{attendanceLabels[rsvp.attendance] || rsvp.attendance}</span>
                      </div>
                      <p>
                        {rsvp.guest_count} guest{Number(rsvp.guest_count) === 1 ? '' : 's'} · {formatDate(rsvp.created_at)}
                      </p>
                      {rsvp.message && <p className="dashboard-note">“{rsvp.message}”</p>}
                      <div className="dashboard-contact-row">
                        {rsvp.phone && (
                          <>
                            <a href={`tel:${rsvp.phone}`}><Phone size={14} /> Call</a>
                            <a href={`https://wa.me/${rsvp.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                              <MessageCircle size={14} /> WhatsApp
                            </a>
                          </>
                        )}
                        {rsvp.email && <a href={`mailto:${rsvp.email}`}><Mail size={14} /> Email</a>}
                      </div>
                    </div>
                    <div className="dashboard-record-actions">
                      <span className={`dashboard-status status-${rsvp.status}`}>{rsvp.status}</span>
                      <button
                        type="button"
                        onClick={() => handleRsvpStatus(rsvp.id, 'confirmed')}
                        disabled={actionId === `rsvp-${rsvp.id}`}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRsvpStatus(rsvp.id, 'needs_follow_up')}
                        disabled={actionId === `rsvp-${rsvp.id}`}
                      >
                        Follow up
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'gifts' && (
            <section className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Gift pledges</h2>
                  <p>See who reserved each gift and contact them privately if needed.</p>
                </div>
              </div>

              <div className="dashboard-list">
                {gifts.length === 0 ? (
                  <div className="dashboard-empty">
                    <Gift size={26} />
                    <h3>No gift-card pledges yet</h3>
                    <p>When a guest pledges a gift card or voucher, their name and contact will appear here.</p>
                  </div>
                ) : gifts.map((gift) => (
                  <article className="dashboard-record" key={gift.id}>
                    <div>
                      <div className="dashboard-record-title">
                        <h3>{gift.gift_title}</h3>
                        <span>{gift.giver_name}</span>
                      </div>
                      <p>{formatDate(gift.created_at)}</p>
                      <div className="dashboard-contact-row">
                        {gift.contact_no && (
                          <>
                            <a href={`tel:${gift.contact_no}`}><Phone size={14} /> Call</a>
                            <a href={`https://wa.me/${gift.contact_no.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                              <MessageCircle size={14} /> WhatsApp
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="dashboard-record-actions">
                      <span className={`dashboard-status status-${gift.status}`}>{gift.status}</span>
                      <button
                        type="button"
                        onClick={() => handleGiftStatus(gift.id, 'contacted')}
                        disabled={actionId === `gift-${gift.id}`}
                      >
                        Contacted
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGiftStatus(gift.id, 'fulfilled')}
                        disabled={actionId === `gift-${gift.id}`}
                      >
                        Fulfilled
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'photos' && (
            <section className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Guest photo uploads</h2>
                  <p>View photos larger, download favourites, and choose what appears on the public gallery.</p>
                </div>
              </div>

              <div className="dashboard-photo-grid">
                {photos.length === 0 ? (
                  <div className="dashboard-empty">
                    <Camera size={26} />
                    <h3>No uploaded photos yet</h3>
                    <p>Guest uploads will appear here for review and moderation.</p>
                  </div>
                ) : photos.map((photo) => (
                  <article className="dashboard-photo-card" key={photo.id}>
                    <button
                      type="button"
                      className="dashboard-photo-preview"
                      onClick={() => setActivePhoto(photo)}
                      aria-label={`View photo uploaded by ${photo.uploader_name}`}
                    >
                      <img src={photo.public_url} alt={photo.caption || `Uploaded by ${photo.uploader_name}`} />
                      <span><Eye size={14} /> View</span>
                    </button>
                    <div>
                      <strong>{photo.uploader_name}</strong>
                      <p>{photo.caption || 'No caption'} · {photo.event_type}</p>
                      <span className={`dashboard-status status-${photo.status}`}>{photo.status}</span>
                      <div className="dashboard-photo-actions">
                        <button
                          type="button"
                          onClick={() => handlePhotoDownload(photo)}
                        >
                          <Download size={14} /> Download
                        </button>
                        {photo.status === 'published' ? (
                          <button
                            type="button"
                            onClick={() => handlePhotoStatus(photo.id, 'hidden')}
                            disabled={actionId === `photo-${photo.id}`}
                          >
                            <XCircle size={14} /> Hide from Gallery
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePhotoStatus(photo.id, 'published')}
                            disabled={actionId === `photo-${photo.id}`}
                          >
                            <CheckCircle2 size={14} /> Show on Gallery
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <footer className="dashboard-footer">
            <img src="/assets/dt-script-wax-seal.png" alt="Deborah and Tom wax seal" />
            <div>
              <strong>Deborah &amp; Tom</strong>
              <span>#TheBestOfDeb · Wedding planning dashboard</span>
            </div>
          </footer>

          {activePhoto && (
            <div className="dashboard-photo-lightbox" role="dialog" aria-label="Uploaded photo preview" onClick={() => setActivePhoto(null)}>
              <div className="dashboard-photo-lightbox-card" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className="dashboard-photo-lightbox-close"
                  onClick={() => setActivePhoto(null)}
                  aria-label="Close photo preview"
                >
                  <XCircle size={20} />
                </button>

                <img src={activePhoto.public_url} alt={activePhoto.caption || `Uploaded by ${activePhoto.uploader_name}`} />

                <div className="dashboard-photo-lightbox-info">
                  <div>
                    <span className={`dashboard-status status-${activePhoto.status}`}>{activePhoto.status}</span>
                    <h3>{activePhoto.caption || 'Guest photo'}</h3>
                    <p>
                      Uploaded by {activePhoto.uploader_name} · {activePhoto.event_type} · {formatDate(activePhoto.created_at)}
                    </p>
                  </div>

                  <div className="dashboard-photo-lightbox-actions">
                    <button type="button" className="btn btn-outline-burgundy" onClick={() => handlePhotoDownload(activePhoto)}>
                      <Download size={16} /> Download
                    </button>
                    {activePhoto.status === 'published' ? (
                      <button
                        type="button"
                        className="btn btn-nude"
                        onClick={() => handlePhotoStatus(activePhoto.id, 'hidden')}
                        disabled={actionId === `photo-${activePhoto.id}`}
                      >
                        <XCircle size={16} /> Hide from Gallery
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-burgundy"
                        onClick={() => handlePhotoStatus(activePhoto.id, 'published')}
                        disabled={actionId === `photo-${activePhoto.id}`}
                      >
                        <CheckCircle2 size={16} /> Show on Gallery
                      </button>
                    )}
                  </div>
                </div>

                <div className="dashboard-share-panel">
                  <div>
                    <strong>Share / publish online</strong>
                    <p>Post or send this photo outside the wedding website.</p>
                  </div>
                  <div className="dashboard-share-actions">
                    <button type="button" onClick={() => openSharePlatform('whatsapp', activePhoto)}>
                      WhatsApp
                    </button>
                    <button type="button" onClick={() => openSharePlatform('facebook', activePhoto)}>
                      Facebook
                    </button>
                    <button type="button" onClick={() => openSharePlatform('x', activePhoto)}>
                      X / Twitter
                    </button>
                    <button type="button" onClick={() => handleCopyPhotoLink(activePhoto)}>
                      <Link size={14} /> Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
