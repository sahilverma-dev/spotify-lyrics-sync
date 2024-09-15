import { useEffect, useRef, useState } from "react";
import { musicsData } from "../data/music-data";
import SpotifyMusicPlayer from "./SpotifyMusicPlayer";
import { motion } from "framer-motion";

const SpotifyLyricsSync = () => {
  const song = musicsData[0];
  const audioRef = useRef<HTMLAudioElement>(null);

  const [activeRange, setActiveRange] = useState(0);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const activeLyricRef = useRef<HTMLParagraphElement | null>(null);

  const getActiveLyric = (timestamp: number) => {
    const filteredLyrics = song.lyrics.filter((lyric) => {
      return lyric.timestamp <= timestamp;
    });

    return filteredLyrics[filteredLyrics.length - 1];
  };

  useEffect(() => {
    if (audioRef?.current && lyricsContainerRef?.current) {
      audioRef.current.ontimeupdate = () => {
        const activeLyric = getActiveLyric(audioRef.current!.currentTime);
        const activeLyricEle = lyricsContainerRef.current!.querySelector(
          `[data-timestamp="${activeLyric.timestamp}"]`
        );

        if (activeLyricEle) {
          activeLyricRef.current = activeLyricEle as HTMLParagraphElement;
        }
        setActiveRange(activeLyric.timestamp);
      };
    }
  }, []);

  useEffect(() => {
    if (activeLyricRef?.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeRange]);

  return (
    <div className="relative h-dvh w-full bg-black/50 text-white">
      <div
        className="absolute inset-0 h-full w-full  bg-no-repeat bg-cover bg-center blur-3xl z-[-1] bg-black"
        style={{
          backgroundImage: `url(${song.cover})`,
        }}
      />
      <div className="relative flex items-center justify-between h-full w-full max-w-[1500px] mx-auto p-8">
        <SpotifyMusicPlayer audioRef={audioRef} song={song} />
        <motion.div
          ref={lyricsContainerRef}
          className="h-full p-6 w-full max-w-4xl overflow-y-scroll flex flex-col gap-4"
        >
          {song.lyrics.map((lyric) => {
            return (
              <motion.p
                ref={lyric.timestamp === activeRange ? activeLyricRef : null}
                key={lyric.timestamp}
                // key={index}
                data-active={lyric.timestamp === activeRange}
                data-timestamp={lyric.timestamp}
                className="text-6xl font-bold text-white/50 [&[data-active='true']]:text-white cursor-pointer"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = lyric.timestamp;
                  }
                }}
              >
                {lyric.lyric}
              </motion.p>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default SpotifyLyricsSync;
