import React, { useRef, useState, useEffect } from "react";

const playlist = [
  {
    title: "In My Feelings",
    artist: "Drake",
    album: "Scorpion",
    year: "2018",
    url: "/in-my-feelings.mp3",
    image: "/in-my-feelings.jpeg",
  },
  {
    title: "Let It All Work Out",
    artist: "Lil Wayne",
    album: "Tha Carter V",
    year: "2018",
    url: "/let-it-all-work-out.mp3",
    image: "/let-it-all-work-out.jpg",
  },
  {
    title: "Stories About My Brother",
    artist: "Drake",
    album: "For All the Dogs",
    year: "2023",
    url: "/stories-about-my-brother.mp3",
    image: "/stories-about-my-brother.jpg",
  },
];

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [volume, setVolume] = useState(0.01);
  const [repeat, setRepeat] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentAudio = playlist[currentIndex];

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setTotalTime(audio.duration);
    };

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      wasPlayingRef.current = true;
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeat, currentIndex]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.src = currentAudio.url;
    audioRef.current.load();
    setCurrentTime(0);

    const handleCanPlayThrough = () => {
      if (wasPlayingRef.current && audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
      audioRef.current?.removeEventListener(
        "canplaythrough",
        handleCanPlayThrough,
      );
    };

    audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      audioRef.current?.removeEventListener(
        "canplaythrough",
        handleCanPlayThrough,
      );
    };
  }, [currentIndex, currentAudio.url]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (
      isPlaying &&
      audioRef.current.paused &&
      audioRef.current.readyState >= 2
    ) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    wasPlayingRef.current = true;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrevious = () => {
    wasPlayingRef.current = true;
    setCurrentIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleBackwards = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0,
      );
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        totalTime,
      );
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    wasPlayingRef.current = true;
    setCurrentIndex(Number(e.target.value));
  };

  const handleRepeat = () => {
    setRepeat((prev) => !prev);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h3>{currentAudio.title}</h3>
      <p>{currentAudio.album}</p>
      <p>{currentAudio.artist}</p>
      <p>{currentAudio.year}</p>
      {currentAudio.image && (
        <img
          src={currentAudio.image}
          alt="Song image"
          style={{ width: 200, borderRadius: "8px" }}
        />
      )}

      <div style={{ margin: "10px 0" }}>
        <button
          onClick={handlePrevious}
          style={{ margin: "0 5px", padding: "8px 12px" }}
        >
          Previous
        </button>
        <button
          onClick={handleBackwards}
          style={{ margin: "0 5px", padding: "8px 12px" }}
        >
          ← 10s
        </button>
        <button
          onClick={handlePlayPause}
          style={{ margin: "0 5px", padding: "8px 12px" }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleForward}
          style={{ margin: "0 5px", padding: "8px 12px" }}
        >
          10s →
        </button>
        <button
          onClick={handleNext}
          style={{ margin: "0 5px", padding: "8px 12px" }}
        >
          Next
        </button>
        <button
          onClick={handleRepeat}
          style={{
            margin: "0 5px",
            padding: "8px 12px",
            backgroundColor: repeat ? "#007bff" : "transparent",
            color: repeat ? "white" : "black",
          }}
        >
          Repeat {repeat ? "ON" : "OFF"}
        </button>
      </div>

      <div style={{ margin: "10px 0" }}>
        <input
          type="range"
          min={0}
          max={totalTime}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ margin: "10px 0" }}>
        <label>
          Volume: {volume.toFixed(2)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </label>
      </div>

      <div style={{ margin: "10px 0" }}>
        <label>
          Choose a song:{" "}
          <select
            value={currentIndex}
            onChange={handleSelectChange}
            style={{ padding: "5px" }}
          >
            {playlist.map((track, index) => (
              <option key={index} value={index}>
                {track.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}>
        <span>Current: {currentTime.toFixed(2)}s</span> /{" "}
        <span>Total: {totalTime.toFixed(2)}s</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
