"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PhotoPost = {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  date: string;
};

type RandomPhotoWallProps = {
  posts: PhotoPost[];
};

function pickRandomPosts(posts: PhotoPost[], count: number) {
  return [...posts]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export default function RandomPhotoWall({
  posts,
}: RandomPhotoWallProps) {
  const photoPosts = useMemo(
    () => posts.filter((post) => post.image),
    [posts]
  );

  const [visiblePosts, setVisiblePosts] = useState<PhotoPost[]>(
    photoPosts.slice(0, 3)
  );

  useEffect(() => {
    setVisiblePosts(pickRandomPosts(photoPosts, 3));
  }, [photoPosts]);

  useEffect(() => {
    if (photoPosts.length <= 3) {
      return;
    }

    const timer = window.setInterval(() => {
      setVisiblePosts((currentPosts) => {
        const currentIds = new Set(
          currentPosts.map((post) => post.id)
        );

        const availablePosts = photoPosts.filter(
          (post) => !currentIds.has(post.id)
        );

        if (availablePosts.length === 0) {
          return pickRandomPosts(photoPosts, 3);
        }

        const replacement =
          availablePosts[
            Math.floor(Math.random() * availablePosts.length)
          ];

        const replaceIndex = Math.floor(
          Math.random() * currentPosts.length
        );

        return currentPosts.map((post, index) =>
          index === replaceIndex ? replacement : post
        );
      });
    }, 8000);

    return () => {
      window.clearInterval(timer);
    };
  }, [photoPosts]);

  if (visiblePosts.length === 0) {
    return (
      <div className="photo-wall-empty">
        暂时还没有可展示的文章图片。
      </div>
    );
  }

  return (
    <div
      className="random-photo-wall"
      aria-label="随机文章照片"
    >
      {visiblePosts.map((post, index) => (
        <Link
          href={`/posts/${post.slug}`}
          className={`photo-wall-item photo-wall-item-${index + 1}`}
          key={`${post.id}-${index}`}
        >
          <img
            src={post.image ?? ""}
            alt={post.title}
          />

          <span className="photo-wall-shade" />

          <span className="photo-wall-caption">
            <small>生活片段</small>
            <strong>{post.title}</strong>
          </span>
        </Link>
      ))}
    </div>
  );
}