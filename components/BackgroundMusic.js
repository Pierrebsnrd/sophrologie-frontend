"use client";
import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import styles from "../styles/components/BackgroundMusic.module.css";

export default function BackgroundMusic({ autoPlay = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasAutoPlayed = useRef(false);

  // Lecture automatique uniquement au premier rendu si autoPlay est true
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed.current && audioRef.current) {
      hasAutoPlayed.current = true;

      // Délai pour éviter les conflits avec l'initialisation
      setTimeout(() => {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Erreur lecture audio :", err);
          });
      }, 100);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
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

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className={styles.container}>
      <audio ref={audioRef} loop preload="auto">
        <source src="/music/music.mp3" type="audio/mpeg" />
        Votre navigateur ne supporte pas l'audio HTML5.
      </audio>
      <button
        onClick={togglePlay}
        className={styles.button}
        aria-label={isPlaying ? "Pause musique" : "Jouer musique"}
      >
        <span className={styles.icon}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </span>
        <span className={styles.text}>
          {isPlaying ? "Couper la musique" : "Jouer la musique"}
        </span>
      </button>
    </div>
  );
}
