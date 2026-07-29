"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type MediaImage = {
  id: number;
  sourceUrl: string;
  alt: string;
  caption: string;
  date: string;
};

type RandomPhotoWallProps = {
  images: MediaImage[];
};

function getRandomIndex(indices: number[]) {
  return indices[Math.floor(Math.random() * indices.length)];
}

export default function RandomPhotoWall({
  images,
}: RandomPhotoWallProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const recentIndicesRef = useRef<number[]>([]);

  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
      setHistory([]);
      recentIndicesRef.current = [];
      return;
    }

    const initialIndex = Math.floor(Math.random() * images.length);

    setCurrentIndex(initialIndex);
    setHistory([]);
    recentIndicesRef.current = [initialIndex];
  }, [images.length]);

  const showPreviousImage = useCallback(() => {
    setHistory((previousHistory) => {
      if (previousHistory.length === 0) {
        return previousHistory;
      }

      const nextHistory = [...previousHistory];
      const previousIndex = nextHistory.pop();

      if (previousIndex !== undefined) {
        setCurrentIndex(previousIndex);
      }

      return nextHistory;
    });
  }, []);

  const showNextImage = useCallback(() => {
    if (images.length <= 1) {
      return;
    }

    setCurrentIndex((previousIndex) => {
      const allIndices = images.map((_, index) => index);
      const recentLimit = Math.min(5, Math.max(1, images.length - 1));
      const recentIndices = recentIndicesRef.current.slice(-recentLimit);

      let candidates = allIndices.filter(
        (index) =>
          index !== previousIndex &&
          !recentIndices.includes(index)
      );

      if (candidates.length === 0) {
        candidates = allIndices.filter(
          (index) => index !== previousIndex
        );
      }

      const nextIndex = getRandomIndex(candidates);

      setHistory((previousHistory) => [
        ...previousHistory.slice(-19),
        previousIndex,
      ]);

      recentIndicesRef.current = [
        ...recentIndicesRef.current,
        nextIndex,
      ].slice(-recentLimit);

      return nextIndex;
    });
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="random-photo-empty">
        媒体库里暂时没有可展示的图片。
      </div>
    );
  }

  const currentImage = images[currentIndex] ?? images[0];
  const hasPreviousImage = history.length > 0;
  const canChangeImage = images.length > 1;

  return (
    <div
      className="random-photo-stage"
      aria-label="首页照片浏览器"
    >
      <img
        key={currentImage.id}
        src={currentImage.sourceUrl}
        alt={currentImage.alt}
        className="random-photo-image"
        decoding="async"
      />

      <span className="random-photo-overlay" />

      <span className="random-photo-info">
        <span>
          {currentImage.caption || currentImage.alt}
        </span>

        {currentImage.date && (
          <small>{currentImage.date}</small>
        )}
      </span>

      {canChangeImage && (
        <div className="random-photo-controls" aria-label="照片切换">
          <button
            type="button"
            className="random-photo-control random-photo-control-previous"
            onClick={showPreviousImage}
            disabled={!hasPreviousImage}
            aria-label="查看上一张照片"
            title="上一张"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.5 5-7 7 7 7" />
            </svg>
          </button>

          <button
            type="button"
            className="random-photo-control random-photo-control-next"
            onClick={showNextImage}
            aria-label="随机查看下一张照片"
            title="下一张"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9.5 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
