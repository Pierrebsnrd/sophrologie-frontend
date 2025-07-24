// components/BackgroundMusic.js
import { useEffect, useRef } from "react";

export default function BackgroundMusic({ play }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (play) {
      audio.play().catch((err) => {
        console.error("Erreur lecture audio :", err);
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [play]);

  return (
    <audio ref={audioRef} loop>
      <source src="/audio/music.mp3" type="audio/mpeg" />
    </audio>
  );
}
