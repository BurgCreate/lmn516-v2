type GardenAtmosphereProps = {
  density?: "soft" | "full";
};

export default function GardenAtmosphere({
  density = "full",
}: GardenAtmosphereProps) {
  return (
    <div
      className={`garden-atmosphere garden-atmosphere-${density}`}
      aria-hidden="true"
    >
      <svg className="garden-atmosphere-left" viewBox="0 0 240 900" role="presentation">
        <path d="M38 930C26 741 66 611 40 438C20 307 48 176 116-18" />
        <path d="M43 761c49-32 83-34 122-4-44 7-78 30-105 67" />
        <path d="M45 617c-28-43-29-79-3-111 11 44 32 74 69 97" />
        <path d="M42 473c43-28 80-28 113-1-43 9-73 32-95 67" />
        <path d="M60 310c-25-35-25-66-2-94 10 37 30 63 60 82" />
        <path d="M91 141c39-24 73-21 102 7-39 5-68 23-91 54" />
        <circle cx="64" cy="542" r="5" />
        <circle cx="91" cy="239" r="4" />
      </svg>

      <svg className="garden-atmosphere-right" viewBox="0 0 240 900" role="presentation">
        <path d="M203 930C216 760 172 613 202 454C226 329 199 168 126-20" />
        <path d="M197 782c-49-32-83-34-122-4 44 7 78 30 105 67" />
        <path d="M198 642c29-42 30-78 4-111-11 44-33 75-69 98" />
        <path d="M201 493c-43-28-80-28-113-1 43 9 73 32 95 67" />
        <path d="M183 329c25-35 25-66 2-94-10 37-30 63-60 82" />
        <path d="M149 153c-39-24-73-21-102 7 39 5 68 23 91 54" />
        <circle cx="176" cy="566" r="5" />
        <circle cx="148" cy="256" r="4" />
      </svg>

      <span className="garden-floating-seed seed-one" />
      <span className="garden-floating-seed seed-two" />
      <span className="garden-floating-seed seed-three" />
    </div>
  );
}
