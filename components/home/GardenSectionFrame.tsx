import type { ReactNode } from "react";

type GardenSectionFrameProps = {
  children: ReactNode;
  variant: "notes" | "archive" | "about";
  marker: string;
};

export default function GardenSectionFrame({
  children,
  variant,
  marker,
}: GardenSectionFrameProps) {
  return (
    <div className={`garden-section-frame garden-section-frame-${variant}`}>
      <span className="garden-section-marker">{marker}</span>

      <svg className="garden-corner garden-corner-left" viewBox="0 0 180 180" aria-hidden="true">
        <path d="M8 171C26 116 50 67 102 15" />
        <path d="M35 112c25-19 48-19 68 1-27 3-47 14-62 34" />
        <path d="M61 70c-12-24-8-46 12-61 2 24 13 42 32 55" />
        <path d="M94 27c24-10 44-4 57 16-24-4-44 2-60 19" />
      </svg>

      <svg className="garden-corner garden-corner-right" viewBox="0 0 180 180" aria-hidden="true">
        <path d="M172 171C154 116 130 67 78 15" />
        <path d="M145 112c-25-19-48-19-68 1 27 3 47 14 62 34" />
        <path d="M119 70c12-24 8-46-12-61-2 24-13 42-32 55" />
        <path d="M86 27c-24-10-44-4-57 16 24-4 44 2 60 19" />
      </svg>

      {children}
    </div>
  );
}
