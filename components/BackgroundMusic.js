'use client';
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from '../styles/BackgroundMusic.module.css';

export default function BackgroundMusic({ play }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Lecture automatique si `play` vient du parent (ex: clic sur menu)
  useEffect(() => {
    if (play && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Erreur lecture audio :", err);
        });
    }
  }, [play, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn("Erreur lecture audio :", err));
    }
  };

  // Pour stopper le son lors du démontage du composant (quand on change de page)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    };
  }, []);

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
