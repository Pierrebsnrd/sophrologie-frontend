'use client';
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from '../styles/BackgroundMusic.module.css';

export default function BackgroundMusic({ play }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Synchroniser l'état local avec l'état réel de l'audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Démarrage automatique si `play === true`
  useEffect(() => {
    if (play && audioRef.current && audioRef.current.paused) {
      audioRef.current
        .play()
        .catch((err) => console.warn("Erreur lecture auto :", err));
    }
  }, [play]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .catch((err) => console.warn("Erreur lecture manuelle :", err));
    } else {
      audio.pause();
    }
  };

  return (
    <div className={styles.container}>
      <audio ref={audioRef} loop preload="auto">
        <source src="/music/music.mp3" type="audio/mpeg" />
        Votre navigateur ne supporte pas l’audio HTML5.
      </audio>
      <button
        onClick={togglePlay}
        className={styles.button}
        aria-label={isPlaying ? 'Pause musique' : 'Jouer musique'}
      >
        <span className={styles.icon}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </span>
        <span className={styles.text}>
          {isPlaying ? 'Couper la musique' : 'Jouer la musique'}
        </span>
      </button>
    </div>
  );
}
