import React, { useState, useEffect } from 'react';
import { Camera, Upload, X, Heart, Download, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchGuestPhotos, uploadGuestPhoto } from '../lib/supabase';

export default function PhotoGallerySection({ onTriggerToast }) {
  const [photos, setPhotos] = useState([]);

  const [uploadName, setUploadName] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadEvent, setUploadEvent] = useState('general');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const mapRecord = (record) => ({
    id: record.id,
    url: record.public_url,
    storagePath: record.storage_path,
    caption: record.caption || 'A celebration memory',
    uploader: record.uploader_name,
    eventType: record.event_type || 'general',
    date: new Date(record.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  });

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPhotos(true);
    setUploadError('');
    fetchGuestPhotos({ eventType: activeFilter })
      .then(({ records, hasMore: moreAvailable }) => {
        if (cancelled) return;
        setPhotos(records.map(mapRecord));
        setHasMore(moreAvailable);
      })
      .catch((error) => {
        console.error('Unable to load guest photos', error);
        setUploadError('The shared gallery could not be loaded. Please try again shortly.');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPhotos(false);
      });
    return () => { cancelled = true; };
  }, [activeFilter]);

  useEffect(() => () => {
    if (previewImage) URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setSelectedFile(null);
        setPreviewImage(null);
        setUploadError('Image size should be less than 10MB.');
        if (onTriggerToast) {
          onTriggerToast({
            type: 'error',
            message: 'Image size should be less than 10MB.'
          });
        }
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setUploadError('Please choose a JPG, PNG, or WEBP image.');
        if (onTriggerToast) onTriggerToast({ type: 'error', message: 'Please choose a JPG, PNG, or WEBP image.' });
        return;
      }
      const isReplacement = Boolean(selectedFile);
      setSelectedFile(file);
      setUploadError('');
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(URL.createObjectURL(file));
      if (isReplacement && onTriggerToast) {
        onTriggerToast({ type: 'info', message: 'Photo selection updated. Review it before publishing.' });
      }
    }
  };

  const clearSelectedPhoto = () => {
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    setSelectedFile(null);
    setUploadError('');
    const input = document.getElementById('guestPhotoInput');
    if (input) input.value = '';
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      if (onTriggerToast) {
        onTriggerToast({
          type: 'error',
          message: 'Please select a photo to upload.'
        });
      }
      return;
    }
    setIsUploading(true);
    setUploadError('');
    try {
      const record = await uploadGuestPhoto({
        file: selectedFile,
        uploaderName: uploadName.trim() || 'Guest Friend',
        caption: uploadCaption.trim() || 'Celebration moment with Deborah & Tom',
        eventType: uploadEvent
      });
      const newPhoto = {
        id: record.id,
        url: record.public_url,
        storagePath: record.storage_path,
        caption: record.caption,
        uploader: record.uploader_name,
        eventType: record.event_type || uploadEvent,
        date: new Date(record.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      setPhotos((current) => [newPhoto, ...current]);
      setSelectedFile(null);
      setPreviewImage(null);
      setUploadName('');
      setUploadCaption('');
      setUploadEvent('general');
      setShowUpload(false);

      if (onTriggerToast) {
        onTriggerToast({ type: 'success', message: 'Your photo is now live in the shared guest gallery!' });
      }
    } catch (error) {
      console.error('Unable to upload guest photo', error);
      setUploadError('We could not upload this photo. Please check your connection and try again.');
      if (onTriggerToast) {
        onTriggerToast({ type: 'error', message: 'Photo upload failed. Please try again.' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const result = await fetchGuestPhotos({ offset: photos.length, eventType: activeFilter });
      setPhotos((current) => [...current, ...result.records.map(mapRecord)]);
      setHasMore(result.hasMore);
    } catch (error) {
      setUploadError('More photos could not be loaded. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const activePhotoIndex = activeLightbox ? photos.findIndex((photo) => photo.id === activeLightbox.id) : -1;
  const showPreviousPhoto = () => {
    if (!photos.length) return;
    setActiveLightbox(photos[(activePhotoIndex - 1 + photos.length) % photos.length]);
  };
  const showNextPhoto = () => {
    if (!photos.length) return;
    setActiveLightbox(photos[(activePhotoIndex + 1) % photos.length]);
  };

  const handleDownload = (photoUrl, photoId) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `Deborah_and_Tom_${photoId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onTriggerToast) {
      onTriggerToast({
        type: 'success',
        message: 'Photo download started!'
      });
    }
  };

  return (
    <section id="gallery" className="section-padding" style={{ background: 'var(--section-bright)' }}>
      <div className="max-w-content text-center">
        
        <span className="section-eyebrow">
          <Camera size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Capture & Share Memories
        </span>
        <h2 className="section-title-script">
          Live Guest Photo Gallery
        </h2>
        <p className="section-subtitle">
          A small collection of favourite moments. Guests can add celebration photos here and use #TheBestOfDeb when sharing online.
        </p>

        <button
          type="button"
          className="btn btn-outline-burgundy"
          onClick={() => setShowUpload((current) => !current)}
          aria-expanded={showUpload}
          style={{ marginBottom: showUpload ? '1.5rem' : '2.5rem' }}
        >
          <Upload size={16} />
          {showUpload ? 'Close Photo Upload' : 'Share a Photo'}
        </button>

        <div className="gallery-filters" aria-label="Filter guest photos by celebration">
          {[
            ['all', 'All Moments'],
            ['traditional', 'Traditional Wedding'],
            ['white', 'White Wedding'],
            ['general', 'Other Moments']
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={activeFilter === value ? 'gallery-filter-active' : ''}
              onClick={() => setActiveFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Live Upload Box */}
        {showUpload && <div className="glass-card" style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          maxWidth: '650px',
          margin: '0 auto 3rem',
          border: '1.5px dashed var(--burgundy-medium)',
          background: 'rgba(252, 242, 239, 0.66)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--burgundy)', marginBottom: '1rem' }}>
            <Upload size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: '-3px' }} />
            Upload a Photo to the Live Wall
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '-0.35rem auto 1.25rem', maxWidth: '440px' }}>
            Add your favourite moment for the couple’s gallery. Official hashtag: <strong style={{ color: 'var(--burgundy)' }}>#TheBestOfDeb</strong>
          </p>

          <form onSubmit={handleUploadSubmit}>
            {/* File Drop Input */}
            <div style={{
              background: 'var(--nude-card)',
              border: '2px dashed var(--nude-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '1.2rem',
              position: 'relative'
            }}>
              <input
                id="guestPhotoInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  zIndex: previewImage ? 0 : 2
                }}
              />

              {previewImage ? (
                <div style={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
                  <img
                    src={previewImage}
                    alt="Upload preview"
                    style={{ maxHeight: '180px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div className="photo-preview-actions">
                    <button type="button" onClick={() => document.getElementById('guestPhotoInput')?.click()}>
                      Choose Another
                    </button>
                    <button type="button" onClick={clearSelectedPhoto}>
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <Image size={36} style={{ color: 'var(--gold)', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--burgundy)', fontWeight: 500 }}>
                    Click or drag & drop a photo here
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Supports JPG, PNG, WEBP up to 10MB
                  </span>
                </div>
              )}
            </div>

            {/* Guest Name & Caption */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem', marginBottom: '1rem', width: '100%', textAlign: 'left' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cousin Sarah"
                  className="form-input"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Photo Caption / Wish</label>
                <input
                  type="text"
                  placeholder="e.g. Can't wait for Dec 17th!"
                  className="form-input"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="photoEvent">Celebration</label>
                <select
                  id="photoEvent"
                  className="form-select"
                  value={uploadEvent}
                  onChange={(e) => setUploadEvent(e.target.value)}
                >
                  <option value="general">Other Moment</option>
                  <option value="traditional">Traditional Wedding</option>
                  <option value="white">White Wedding</option>
                </select>
              </div>
            </div>

            {uploadError && <p role="alert" style={{ color: '#8B1E3F', background: '#F9ECEF', borderRadius: '8px', padding: '0.7rem 0.9rem', fontSize: '0.85rem', marginBottom: '1rem' }}>{uploadError}</p>}

            <button type="submit" disabled={isUploading} className="btn btn-burgundy" style={{ width: '100%', opacity: isUploading ? 0.7 : 1 }}>
              <Upload size={16} />
              {isUploading ? 'Uploading Photo…' : 'Publish Live Photo'}
            </button>
          </form>
        </div>}

        {/* Live Photo Grid */}
        <div className="photo-grid gallery-mosaic" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
          gap: '1.5rem',
          width: '100%',
          marginTop: '2rem'
        }}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`glass-card gallery-photo-card gallery-photo-card-${index % 7}`}
              style={{
                padding: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                textAlign: 'left',
                border: '1.5px solid var(--nude-border)',
                background: 'var(--nude-card)',
                transition: 'transform 0.3s ease'
              }}
              onClick={() => setActiveLightbox(photo)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={photo.url}
                  alt={photo.caption}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="badge-gold" style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.68rem', background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', borderColor: 'transparent' }}>
                  {photo.date}
                </span>
                <span className="gallery-event-badge">
                  {photo.eventType === 'traditional' ? 'Traditional' : photo.eventType === 'white' ? 'White Wedding' : 'Guest Moment'}
                </span>
              </div>

              <div style={{ padding: '1rem' }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-dark)', marginBottom: '0.4rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {photo.caption}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gold-dark)' }}>
                  <span>Uploaded by: <strong>{photo.uploader}</strong></span>
                  <Heart size={14} style={{ color: 'var(--burgundy)', fill: 'var(--burgundy)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoadingPhotos && <p style={{ color: 'var(--text-muted)', margin: '2rem 0' }}>Loading the shared guest gallery…</p>}

        {!isLoadingPhotos && photos.length === 0 && (
          <div className="gallery-empty-state">
            <Camera size={28} />
            <h3>Be the first to share a memory</h3>
            <p>Guest photos will appear here after they are uploaded.</p>
          </div>
        )}

        {hasMore && (
          <button
            type="button"
            className="btn btn-outline-gold"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            style={{ marginTop: '2rem' }}
          >
            {isLoadingMore ? 'Loading More…' : 'Load More Memories'}
          </button>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9990,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setActiveLightbox(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '850px',
              width: '100%',
              background: 'var(--nude-card)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {photos.length > 1 && (
              <>
                <button type="button" className="lightbox-nav lightbox-nav-left" onClick={showPreviousPhoto} aria-label="Previous photo">
                  <ChevronLeft size={24} />
                </button>
                <button type="button" className="lightbox-nav lightbox-nav-right" onClick={showNextPhoto} aria-label="Next photo">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <button
              onClick={() => setActiveLightbox(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#FFFFFF',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close viewer"
            >
              <X size={20} />
            </button>

            <img
              src={activeLightbox.url}
              alt={activeLightbox.caption}
              decoding="async"
              style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', background: '#1A1A1A' }}
            />

            <div style={{ padding: '1.5rem', background: 'var(--nude-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--burgundy)', margin: 0 }}>
                  {activeLightbox.caption}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Shared by {activeLightbox.uploader} on {activeLightbox.date}
                </p>
              </div>

              <button
                onClick={() => handleDownload(activeLightbox.url, activeLightbox.id)}
                className="btn btn-burgundy"
              >
                <Download size={16} />
                Download Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
