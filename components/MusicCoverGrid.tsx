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
  const [previewUrls, setPreviewUrls] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let cancelled = false;

    async function loadPreviewUrls() {
      const ids = tracks
        .map((track) => track.songId)
        .join(",");

      try {
        const response = await fetch(
          `https://itunes.apple.com/lookup?id=${ids}&country=cn&entity=song`
        );

        if (!response.ok) {
          throw new Error("Apple preview request failed");
        }

        const data =
          (await response.json()) as AppleLookupResponse;

        const nextPreviewUrls: Record<string, string> = {};

        for (const item of data.results ?? []) {
          if (item.trackId && item.previewUrl) {
            nextPreviewUrls[String(item.trackId)] =
              item.previewUrl;
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

  async function handlePlay(track: Track) {
    const previewUrl = previewUrls[track.songId];

    if (!previewUrl) {
      return;
    }

    if (
      playingId === track.id &&
      audioRef.current
    ) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(previewUrl);

    audioRef.current = audio;

    audio.addEventListener(
      "ended",
      () => {
        audioRef.current = null;
        setPlayingId(null);
      },
      { once: true }
    );

    try {
      await audio.play();
      setPlayingId(track.id);
    } catch (error) {
      audioRef.current = null;
      setPlayingId(null);
      console.error("Failed to play music preview:", error);
    }
  }

  return (
    <div className="music-cover-grid">
      {tracks.map((track) => {
        const hasPreview =
          Boolean(previewUrls[track.songId]);

        const isPlaying =
          playingId === track.id;

        return (
          <article
            className="music-cover-card"
            key={track.id}
          >
            <button
              type="button"
              className="music-cover-button"
              onClick={() => handlePlay(track)}
              disabled={!hasPreview}
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
              </span>
            </button>

            <span className="music-cover-title">
              {track.song}
            </span>

            <span className="music-cover-artist">
              {track.artist}
            </span>
          </article>
        );
      })}
    </div>
  );
}