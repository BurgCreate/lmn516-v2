"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Track } from "@/lib/music";

type AppleLookupItem = {
  trackId?: number;
  previewUrl?: string;
};

type AppleLookupResponse = {
  results?: AppleLookupItem[];
};

type MusicCoverGridProps = {
  tracks: Track[];
};

export default function MusicCoverGrid({
  tracks,
}: MusicCoverGridProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playingId, setPlayingId] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadPreviewUrls() {
      const ids = tracks.map((track) => track.songId).join(",");

      try {
        const response = await fetch(
          `https://itunes.apple.com/lookup?id=${ids}&country=cn&entity=song`
        );

        if (!response.ok) {
          throw new Error("Apple preview request failed");
        }

        const data = (await response.json()) as AppleLookupResponse;
        const nextPreviewUrls: Record<string, string> = {};

        for (const item of data.results ?? []) {
          if (item.trackId && item.previewUrl) {
            nextPreviewUrls[String(item.trackId)] = item.previewUrl;
          }
        }

        if (!cancelled) {
          setPreviewUrls(nextPreviewUrls);
        }
      } catch (error) {
        console.error("Failed to load music previews:", error);
      }
    }

    loadPreviewUrls();

    return () => {
      cancelled = true;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [tracks]);

  async function playTrackAtIndex(startIndex: number) {
    if (tracks.length === 0) {
      return;
    }

    let nextIndex = startIndex;
    let previewUrl: string | undefined;

    // Apple 偶尔不会返回某首歌的试听地址。自动跳过它，
    // 免得连续播放被一首“失踪人口”卡住。
    for (let checked = 0; checked < tracks.length; checked += 1) {
      const candidateIndex = (startIndex + checked) % tracks.length;
      const candidateTrack = tracks[candidateIndex];
      const candidateUrl = previewUrls[candidateTrack.songId];

      if (candidateUrl) {
        nextIndex = candidateIndex;
        previewUrl = candidateUrl;
        break;
      }
    }

    if (!previewUrl) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const track = tracks[nextIndex];
    const audio = new Audio(previewUrl);
    audioRef.current = audio;

    audio.addEventListener(
      "ended",
      () => {
        if (audioRef.current !== audio) {
          return;
        }

        audioRef.current = null;
        setPlayingId(null);
        void playTrackAtIndex((nextIndex + 1) % tracks.length);
      },
      { once: true }
    );

    try {
      await audio.play();
      setPlayingId(track.id);
    } catch (error) {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setPlayingId(null);
      }

      console.error("Failed to play music preview:", error);
    }
  }

  function handlePlay(track: Track, index: number) {
    if (!previewUrls[track.songId]) {
      return;
    }

    if (playingId === track.id && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingId(null);
      return;
    }

    void playTrackAtIndex(index);
  }

  return (
    <div className="music-cover-grid">
      {tracks.map((track, index) => {
        const hasPreview = Boolean(previewUrls[track.songId]);
        const isPlaying = playingId === track.id;

        return (
          <article
            className={`music-cover-card${isPlaying ? " is-playing" : ""}`}
            key={track.id}
          >
            <button
              type="button"
              className="music-cover-button"
              onClick={() => handlePlay(track, index)}
              disabled={!hasPreview}
              aria-pressed={isPlaying}
              aria-label={
                isPlaying
                  ? `暂停《${track.song}》`
                  : `试听《${track.song}》`
              }
            >
              <span className="music-cover-frame">
                <Image
                  src={track.cover}
                  alt={`${track.song} - ${track.artist}`}
                  fill
                  sizes="(max-width: 620px) 50vw, (max-width: 820px) 33vw, 25vw"
                />

                <span className="music-cover-shade" aria-hidden="true" />

                <span className="music-cover-control" aria-hidden="true">
                  {isPlaying ? (
                    <span className="music-pause-icon">
                      <i />
                      <i />
                    </span>
                  ) : (
                    <span className="music-play-icon" />
                  )}
                </span>
              </span>
            </button>

            <span className="music-cover-title">{track.song}</span>

            <span className="music-cover-artist">{track.artist}</span>
          </article>
        );
      })}
    </div>
  );
}
