import React, { useState, useEffect, useRef } from 'react';
import { Music2, Pause } from 'lucide-react';

export default function MusicPlayer({ isPlaying, setIsPlaying }) {
  const volume = 0.25;
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const audioRef = useRef(null);

  // Add the licensed acoustic or instrumental file at this path.
  const musicUrl = '/assets/the-vow-ruthanne-acoustic-or-instrumental.mp3';

  // Handle Play/Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.volume = volume;
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
  }, [isPlaying, volume, setIsPlaying]);

  // Handle volume updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioUnavailable) return;
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-player-shell" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 900,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <audio 
        ref={audioRef} 
        src={musicUrl} 
        loop 
        preload="auto"
        onCanPlay={() => setAudioUnavailable(false)}
        onError={() => {
          setAudioUnavailable(true);
          setIsPlaying(false);
        }}
      />

      <button
        onClick={togglePlay}
        className={`music-icon-button ${isPlaying ? 'music-icon-button-playing' : ''}`}
        title={audioUnavailable ? "Add 'The Vow' by RuthAnne audio file to enable music" : isPlaying ? 'Pause The Vow by RuthAnne' : "Play 'The Vow' by RuthAnne"}
        aria-label={audioUnavailable ? 'Music file unavailable' : isPlaying ? 'Pause music' : 'Play music'}
        aria-pressed={isPlaying}
        disabled={audioUnavailable}
      >
        {isPlaying ? <Pause size={20} /> : <Music2 size={21} />}
      </button>
    </div>
  );
}
