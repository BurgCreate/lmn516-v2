"use client";

import {
  useCallback,
  useEffect,
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

export default function RandomPhotoWall({
  images,
}: RandomPhotoWallProps) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const showRandomImage = useCallback(() => {
    if (images.length <= 1) {
      return;
    }

    setCurrentIndex((previousIndex) => {
      let nextIndex = previousIndex;

      while (nextIndex === previousIndex) {
        nextIndex = Math.floor(
          Math.random() * images.length
        );
      }

      return nextIndex;
    });
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    setCurrentIndex(
      Math.floor(Math.random() * images.length)
    );

    const timer = window.setInterval(() => {
      showRandomImage();
    }, 8000);

    return () => {
      window.clearInterval(timer);
    };
  }, [images.length, showRandomImage]);

  if (images.length === 0) {
    return (
      <div className="random-photo-empty">
        媒体库里暂时没有可展示的图片。
      </div>
    );
  }

  const currentImage =
    images[currentIndex] ?? images[0];

  return (
    <button
      type="button"
      className="random-photo-stage"
      onClick={showRandomImage}
      aria-label="随机更换一张照片"
      title="点击随机更换照片"
    >
      <img
        key={currentImage.id}
        src={currentImage.sourceUrl}
        alt={currentImage.alt}
        className="random-photo-image"
      />

      <span className="random-photo-overlay" />

      <span className="random-photo-info">
        <span>
          {currentImage.caption ||
            currentImage.alt}
        </span>

        {currentImage.date && (
          <small>{currentImage.date}</small>
        )}
      </span>

      <span className="random-photo-hint">
        点击更换
      </span>
    </button>
  );
}