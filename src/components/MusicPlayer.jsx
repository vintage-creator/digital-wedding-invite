import React, { useState, useEffect, useRef } from 'react';
import { Music2, Pause, Volume2, VolumeX } from 'lucide-react';

const DEFAULT_VOLUME = 0.15;

export default function MusicPlayer({ isPlaying, setIsPlaying }) {
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const audioRef = useRef(null);

  const musicUrl = '/assets/the-vow-ruthanne-acoustic-or-instrumental.mp3';

  // Set volume immediately when audio is ready — prevents full-volume burst on first play
  const handleCanPlay = () => {
    setAudioUnavailable(false);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  };

  // Handle Play/Pause — always enforce correct volume before playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Audio playback prevented or failed:', err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // Sync volume/mute changes to audio element in real time
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioUnavailable) return;
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => setIsMuted((m) => !m);

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div
      className="music-player-shell"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900 }}
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        onCanPlay={handleCanPlay}
        onError={() => {
          setAudioUnavailable(true);
          setIsPlaying(false);
        }}
      />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(59, 8, 27, 0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(197, 160, 89, 0.35)',
        borderRadius: '30px',
        padding: '6px 12px 6px 8px',
        boxShadow: '0 8px 24px rgba(59, 8, 27, 0.25)',
      }}>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className={`music-icon-button ${isPlaying ? 'music-icon-button-playing' : ''}`}
          title={audioUnavailable
            ? "Add 'The Vow' by RuthAnne audio file to enable music"
            : isPlaying ? 'Pause The Vow by RuthAnne' : "Play 'The Vow' by RuthAnne"}
          aria-label={audioUnavailable ? 'Music file unavailable' : isPlaying ? 'Pause music' : 'Play music'}
          aria-pressed={isPlaying}
          disabled={audioUnavailable}
        >
          {isPlaying ? <Pause size={20} /> : <Music2 size={21} />}
        </button>

        {/* Volume controls — visible on hover */}
        {showSlider && (
          <>
            <button
              onClick={toggleMute}
              style={{
                background: 'none',
                border: 'none',
                color: '#E4C889',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0 2px',
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            >
              {effectiveVolume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={effectiveVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (isMuted && val > 0) setIsMuted(false);
              }}
              aria-label="Music volume"
              style={{
                width: '72px',
                accentColor: '#C5A059',
                cursor: 'pointer',
                verticalAlign: 'middle',
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
