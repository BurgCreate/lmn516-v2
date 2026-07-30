type GardenTrailProps = {
  variant?: "bird" | "bench" | "mailbox";
  label: string;
};

export default function GardenTrail({
  variant = "bird",
  label,
}: GardenTrailProps) {
  return (
    <div className={`garden-trail garden-trail-${variant}`} aria-hidden="true">
      <span className="garden-trail-label">{label}</span>

      <svg viewBox="0 0 1200 180" role="presentation">
        <path
          className="garden-trail-path"
          d="M-30 136C168 72 282 176 472 116C650 60 768 157 947 104C1046 75 1126 82 1230 42"
        />
        <path
          className="garden-trail-grass"
          d="M94 133l-8-18m8 18 10-21m55 5-4-17m4 17 11-15m777-3-8-22m8 22 13-17m76-14-4-18m4 18 13-15"
        />

        {variant === "bird" && (
          <g className="garden-trail-scene garden-trail-birds">
            <path d="M905 57q14-16 28 0q14-16 28 0" />
            <path d="M989 35q10-12 20 0q10-12 20 0" />
            <path d="M177 126c18-4 34-2 49 8" />
            <circle cx="181" cy="119" r="4" />
          </g>
        )}

        {variant === "bench" && (
          <g className="garden-trail-scene garden-trail-bench">
            <path d="M902 94h102v20H902zM916 114l-8 31m80-31 8 31M916 80h76v14h-76z" />
            <path d="M1035 109c16-16 32-14 43 2-19 1-31 10-38 25" />
            <circle cx="1072" cy="101" r="5" />
          </g>
        )}

        {variant === "mailbox" && (
          <g className="garden-trail-scene garden-trail-mailbox">
            <path d="M915 70h70c18 0 31 13 31 31v30H915z" />
            <path d="M966 70v75M932 96h25M1016 94h28v12h-28" />
            <path d="M1044 94V62m0 0 17 8-17 8" />
          </g>
        )}
      </svg>
    </div>
  );
}
