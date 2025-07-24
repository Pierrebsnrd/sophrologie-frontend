'use client';
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from '../styles/BackgroundMusic.module.css';

export default function BackgroundMusic({ play, onPlayStateChange }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Lecture automatique si `play` vient du parent
  useEffect(() => {
    if (play && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          onPlayStateChange?.(true);
        })
        .catch(err => {
          console.warn("Erreur lecture audio :", err);
        });
    }
  }, [play, isPlaying, onPlayStateChange]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          onPlayStateChange?.(true);
        })
        .catch((err) => console.warn("Erreur lecture audio :", err));
    }
  };
  
  // Nettoyage lors du démontage du composant
  useEffect(() => {
    const audio = audioRef.current;
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Écouter les événements audio pour synchroniser l'état
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [onPlayStateChange]);

  return (
    <div className={styles.container}>
      <audio ref={audioRef} loop preload="auto">
        <source src="/music/music.mp3" type="audio/mpeg" />
        Votre navigateur ne supporte pas l'audio HTML5.
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