import { useEffect, useState } from "react";
import { musicsData } from "../data/music-data";

// icons
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { MdForward10, MdReplay10 } from "react-icons/md";

import { motion } from "framer-motion";

interface SpotifyMusicPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  song: (typeof musicsData)[0];
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SpotifyMusicPlayer: React.FC<SpotifyMusicPlayerProps> = ({
  song,
  audioRef,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const percentage = audioRef?.current
    ? (currentTime / audioRef?.current!.duration || 0) * 100
    : 0;

  //   listing for events
  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    audioRef.current?.addEventListener("timeupdate", updateCurrentTime);
    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const seek = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = seek * audioRef.current.duration;
    }
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => {
      if (audioRef.current) {
        if (prev) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
      }
      return !prev;
    });
  };

  const handleSkip = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += time;
    }
  };

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (audioRef.current) {
        if (e.key === " ") {
          handlePlayPause();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          handleSkip(10);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          handleSkip(-10);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex-shrink-0 space-y-4">
      <div className="relative rounded-md shadow-xl overflow-hidden aspect-square">
        <img
          src={song.cover}
          alt={song.name}
          className="w-full h-full object-cover"
        />
      </div>
      <audio ref={audioRef} loop>
        <source src={song.audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div>
        <h2 className="font-semibold text-xl text-center">{song.name}</h2>
        <p className="text-center text-xs text-gray-300">{song.artist}</p>
      </div>
      {/* custom controls */}
      <div className="flex w-full items-center justify-between gap-6 text-xs">
        {/* current time */}
        <p>{formatTime(currentTime)}</p>
        {/*  timeline */}

        <div
          onClick={handleSeek}
          className="relative p-1 cursor-pointer w-full"
        >
          {/* progress bar */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 w-full bg-white/30 rounded-full pointer-events-none" />
          <motion.div
            style={{
              width: `${percentage}%`,
            }}
            className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-white rounded-full pointer-events-none"
          />
          <motion.div
            style={{
              left: `${percentage}%`,
            }}
            className="absolute top-1/2  -translate-y-1/2 -translate-x-1/2 p-1.5 bg-white rounded-full pointer-events-none"
          />
        </div>

        {/* duration time */}
        <p>{formatTime(audioRef?.current?.duration || 0)}</p>
      </div>
      <div className="flex w-full items-center justify-center gap-7">
        <button
          onClick={() => {
            handleSkip(-10);
          }}
          className="p-4 rounded-full border-2 border-white/30 hover:bg-white/10 transition-all flex items-center justify-center"
        >
          <MdReplay10 />
        </button>

        <button
          onClick={() => {
            handlePlayPause();
          }}
          className="p-4 rounded-full border-2 border-white/30 hover:bg-white/10 transition-all flex items-center justify-center"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button
          onClick={() => {
            handleSkip(10);
          }}
          className="p-4 rounded-full border-2 border-white/30 hover:bg-white/10 transition-all flex items-center justify-center"
        >
          <MdForward10 />
        </button>
      </div>
    </div>
  );
};

export default SpotifyMusicPlayer;
