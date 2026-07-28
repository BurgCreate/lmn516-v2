"use client";

import { useEffect, useState } from "react";
import type { MediaImage } from "@/lib/wordpress";

type PhotoGalleryProps = {
  images: MediaImage[];
};

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [activeImage, setActiveImage] = useState<MediaImage | null>(null);

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveImage(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage]);

  if (images.length === 0) {
    return (
      <div className="photo-gallery-empty">
        <p>照片还没有抵达这里。</p>
        <span>请先在 WordPress 媒体库上传图片。</span>
      </div>
    );
  }

  return (
    <>
      <div className="photo-gallery" aria-label="生活照片墙">
        {images.map((image) => (
          <figure className="photo-gallery-item" key={image.id}>
            <button
              type="button"
              className="photo-gallery-button"
              onClick={() => setActiveImage(image)}
              aria-label={`放大查看：${image.alt}`}
            >
              <img
                src={image.sourceUrl}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />

              <span className="photo-gallery-overlay" aria-hidden="true">
                查看
              </span>
            </button>

            {(image.caption || image.date) && (
              <figcaption>
                {image.caption && <span>{image.caption}</span>}
                {image.date && <time>{image.date}</time>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {activeImage && (
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="照片预览"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveImage(null);
            }
          }}
        >
          <button
            type="button"
            className="photo-lightbox-close"
            onClick={() => setActiveImage(null)}
            aria-label="关闭照片预览"
          >
            ×
          </button>

          <figure className="photo-lightbox-content">
            <img src={activeImage.sourceUrl} alt={activeImage.alt} />

            {(activeImage.caption || activeImage.date) && (
              <figcaption>
                {activeImage.caption && <span>{activeImage.caption}</span>}
                {activeImage.date && <time>{activeImage.date}</time>}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
