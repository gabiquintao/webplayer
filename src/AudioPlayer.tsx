import React, { useRef, useState, useEffect } from "react";
import "./App.css";

const playlist = [
  {
    title: "Song One",
    url: "/in-my-feelings.mp3",
  },
  {
    title: "Song Two",
    url: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/thrust.mp3",
  },
];

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentAudio = playlist[currentIndex];

  useEffect(() => {
    const audio = new Audio(currentAudio.url);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setTotalTime(audio.duration);
    };

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", updateTime);

    if (isPlaying) {
      audio.play();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", updateTime);
      audio.pause();
    };
  }, [currentAudio, isPlaying]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleBackwards = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentIndex(Number(e.target.value));
  };

  return (
    <div className="audio-player">
      <h3>{currentAudio.title}</h3>

      <div>
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleBackwards}>Backwards</button>
        {isPlaying ? (
          <button onClick={handlePause}>Pause</button>
        ) : (
          <button onClick={handlePlay}>Play</button>
        )}
        <button onClick={handleForward}>Forward</button>
        <button onClick={handleNext}>Next</button>
      </div>

      <input
        type="range"
        min={0}
        max={totalTime}
        step={0.01}
        value={currentTime}
        onChange={handleSeek}
      />

      <div>
        <label>
          Choose a song:
          <select value={currentIndex} onChange={handleSelectChange}>
            {playlist.map((track, index) => (
              <option key={index} value={index}>
                {track.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span>Current: {currentTime.toFixed(2)}s</span> /{" "}
        <span>Total: {totalTime.toFixed(2)}s</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
