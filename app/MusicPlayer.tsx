"use client";

import { useEffect, useRef, useState } from "react";

type MusicPlayerProps = {
  musicUrl: string;
  musicTitle?: string | null;
  musicArtist?: string | null;
  musicLabel?: string | null;
  musicCoverUrl?: string | null;
};

export default function MusicPlayer({
  musicUrl,
  musicTitle,
  musicArtist,
  musicLabel,
  musicCoverUrl,
}: MusicPlayerProps) {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0
      );
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener(
      "timeupdate",
      updateTime
    );

    audio.addEventListener(
      "loadedmetadata",
      updateDuration
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        updateTime
      );

      audio.removeEventListener(
        "loadedmetadata",
        updateDuration
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [volume]);

  function togglePlay() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function handleProgress(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const audio = audioRef.current;

    if (!audio) return;

    const newTime =
      Number(event.target.value);

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function handleVolume(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const newVolume =
      Number(event.target.value);

    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume =
        newVolume;
    }
  }

  function formatTime(time: number) {
    if (!Number.isFinite(time)) {
      return "0:00";
    }

    const minutes =
      Math.floor(time / 60);

    const seconds =
      Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        preload="metadata"
      />

      <div className="custom-music-player">

        {/* MUSIC HEADER */}

        <div className="music-top">

          {/* COVER */}

          <div className="music-cover">
            {musicCoverUrl ? (
              <img
                src={musicCoverUrl}
                alt="Music cover"
              />
            ) : (
              <span>♪</span>
            )}
          </div>

          {/* INFORMATION */}

          <div className="music-details">

            <span className="music-label">
              {musicLabel ||
                "NOW PLAYING"}
            </span>

            <strong className="music-artist">
              {musicArtist ||
                "Reale Music"}
            </strong>

            <p className="music-title">
              {musicTitle || "Still"}
            </p>

          </div>

          {/* PLAY */}

          <button
            type="button"
            className="play-button"
            onClick={togglePlay}
            aria-label={
              isPlaying
                ? "Pause music"
                : "Play music"
            }
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

        </div>

        {/* PROGRESS */}

        <div className="music-progress">

          <span>
            {formatTime(
              currentTime
            )}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={
              Math.min(
                currentTime,
                duration || 0
              )
            }
            onChange={
              handleProgress
            }
            aria-label="Music progress"
          />

          <span>
            {formatTime(duration)}
          </span>

        </div>

        {/* VOLUME */}

        <div className="music-volume">

          <span aria-hidden="true">
            🔊
          </span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={
              handleVolume
            }
            aria-label="Volume"
          />

        </div>

      </div>
    </>
  );
}