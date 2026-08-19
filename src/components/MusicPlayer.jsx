import React, { useState, useEffect, useRef } from 'react';
import { Music2, Pause } from 'lucide-react';

export default function MusicPlayer({ isPlaying, setIsPlaying }) {
  // Soft, subtle initial ambient volume (25%)
  const [volume, setVolume] = useState(0.25);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const synthAudioContextRef = useRef(null);
  const synthIntervalRef = useRef(null);

  // Gentle acoustic romantic wedding music stream
  const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-acoustic-guitar-113589.mp3';

  // Handle Play/Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.volume = isMuted ? 0 : volume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Audio autoplay prevented or failed, fallback to WebAudio synth:', err);
          startSynthMelody();
        });
      }
    } else {
      audio.pause();
      stopSynthMelody();
    }
  }, [isPlaying]);

  // Handle volume updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Web Audio API Synthesizer fallback for gentle acoustic chords
  const startSynthMelody = () => {
    if (synthAudioContextRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      synthAudioContextRef.current = ctx;

      const chords = [
        [196.00, 246.94, 293.66, 392.00], // G major
        [146.83, 220.00, 293.66, 369.99], // D major
        [164.81, 196.00, 246.94, 329.63], // E minor
        [130.81, 164.81, 196.00, 261.63]  // C major
      ];

      let chordIdx = 0;
      const playNextChord = () => {
        if (!ctx || ctx.state === 'closed') return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle gain ramp
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 4.0);
        });
      };

      playNextChord();
      synthIntervalRef.current = setInterval(playNextChord, 4000);
    } catch (e) {
      console.log('WebAudio synth not supported:', e);
    }
  };

  const stopSynthMelody = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (synthAudioContextRef.current) {
      synthAudioContextRef.current.close().catch(() => {});
      synthAudioContextRef.current = null;
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
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
      />

      <button
        onClick={togglePlay}
        className={`music-icon-button ${isPlaying ? 'music-icon-button-playing' : ''}`}
        title={isPlaying ? 'Pause ambient music' : "Play 'The Vow' by RuthAnne"}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Pause size={20} /> : <Music2 size={21} />}
      </button>
    </div>
  );
}
