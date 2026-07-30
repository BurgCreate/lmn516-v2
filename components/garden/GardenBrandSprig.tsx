type GardenBrandSprigProps = {
  className?: string;
  mirrored?: boolean;
};

export default function GardenBrandSprig({
  className = "",
  mirrored = false,
}: GardenBrandSprigProps) {
  return (
    <svg
      className={`garden-brand-sprig${mirrored ? " is-mirrored" : ""}${className ? ` ${className}` : ""}`}
      viewBox="0 0 74 44"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 37C24 31 35 20 45 7" />
      <path d="M24 29C17 28 12 24 9 18C17 16 23 19 27 25" />
      <path d="M34 20C28 16 26 10 27 4C35 6 39 11 39 17" />
      <path d="M43 10C50 8 56 10 61 15C55 20 49 20 44 16" />
      <path d="M18 34C15 29 15 24 18 20" />
      <circle cx="8" cy="38" r="2.6" />
    </svg>
  );
}
