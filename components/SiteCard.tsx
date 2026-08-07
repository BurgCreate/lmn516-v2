"use client";

import { useState } from "react";

export default function SiteCard({ site }: any) {

  const favicon =
    site.domain
      ? `https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`
      : null;

  const [showTip, setShowTip] = useState(false);

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);

  const shortcut = isMac ? "⌘ + D" : "Ctrl + D";

  const handleFavoriteClick = () => {
    setShowTip(true);
    window.setTimeout(() => setShowTip(false), 2500);
  };

  return (
    <div className="library-card">

      <div className="library-info">

        {favicon && (
          <img
            src={favicon}
            alt={site.name}
            className="library-icon"
          />
        )}

        <div className="library-text">

          <h2>
            {site.name}
          </h2>

          <span>
            {site.category}
          </span>

        </div>

      </div>


      <div className="library-actions">

        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="library-visit"
        >
          访问
        </a>

        <div className="library-favorite-wrap">

          <button
            type="button"
            className="library-favorite"
            onClick={handleFavoriteClick}
          >
            收藏
          </button>

          {showTip && (
            <div className="library-favorite-tip">
              按 {shortcut} 收藏本页
            </div>
          )}

        </div>

      </div>


    </div>
  );
}
