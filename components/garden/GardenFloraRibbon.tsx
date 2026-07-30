type GardenFloraRibbonProps = {
  className?: string;
  density?: "light" | "full";
};

export default function GardenFloraRibbon({
  className = "",
  density = "full",
}: GardenFloraRibbonProps) {
  return (
    <svg
      className={`garden-flora-ribbon garden-flora-ribbon-${density} ${className}`.trim()}
      viewBox="0 0 960 180"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="flora-line flora-line-main" d="M-20 153C94 129 163 137 245 149C347 164 428 151 516 127C627 96 732 93 980 145" />
      <path className="flora-line flora-line-soft" d="M-10 166C129 146 221 161 302 170C417 182 518 157 614 139C724 117 817 121 970 161" />

      <g className="flora-sprig flora-sprig-left" transform="translate(82 22)">
        <path className="flora-stem" d="M18 137C21 94 36 56 72 17" />
        <path className="flora-leaf" d="M30 98C6 88 0 67 9 49C29 58 39 74 30 98Z" />
        <path className="flora-leaf flora-leaf-alt" d="M45 70C66 64 79 50 84 31C65 31 49 43 45 70Z" />
        <g className="flora-bloom flora-bloom-pink" transform="translate(76 13)">
          <circle cy="-8" r="7" /><circle cx="8" r="7" /><circle cy="8" r="7" /><circle cx="-8" r="7" /><circle className="flora-center" r="4" />
        </g>
      </g>

      <g className="flora-sprig flora-sprig-mid" transform="translate(430 18)">
        <path className="flora-stem" d="M48 142C49 94 49 57 47 16" />
        <path className="flora-stem flora-stem-soft" d="M48 104C28 85 16 66 8 43" />
        <path className="flora-stem flora-stem-soft" d="M48 88C69 69 80 47 86 24" />
        <path className="flora-leaf" d="M43 112C19 104 8 87 10 69C31 73 43 89 43 112Z" />
        <path className="flora-leaf flora-leaf-alt" d="M53 87C72 82 85 68 91 51C72 50 58 62 53 87Z" />
        <path className="flora-bell flora-bell-blue" d="M0 42C13 38 24 45 27 59C17 69 5 68-4 58C-8 52-6 46 0 42Z" />
        <path className="flora-bell flora-bell-gold" d="M80 22C94 20 103 29 102 43C91 52 79 49 72 38C69 32 72 25 80 22Z" />
        <g className="flora-bloom flora-bloom-white" transform="translate(47 12)">
          <circle cy="-9" r="8" /><circle cx="9" r="8" /><circle cy="9" r="8" /><circle cx="-9" r="8" /><circle className="flora-center" r="4.5" />
        </g>
      </g>

      <g className="flora-sprig flora-sprig-right" transform="translate(780 27)">
        <path className="flora-stem" d="M45 131C41 91 51 56 87 18" />
        <path className="flora-stem flora-stem-soft" d="M44 92C25 77 12 60 4 39" />
        <path className="flora-leaf" d="M42 105C20 101 6 87 2 69C23 69 39 82 42 105Z" />
        <path className="flora-leaf flora-leaf-alt" d="M64 58C83 52 95 38 99 22C81 22 67 33 64 58Z" />
        <g className="flora-bloom flora-bloom-gold" transform="translate(91 14)">
          <circle cy="-8" r="7" /><circle cx="8" r="7" /><circle cy="8" r="7" /><circle cx="-8" r="7" /><circle className="flora-center" r="4" />
        </g>
        <circle className="flora-berry flora-berry-blue" cx="2" cy="37" r="5" />
      </g>

      {density === "full" && (
        <>
          <g className="flora-mini" transform="translate(248 91)">
            <path className="flora-stem" d="M0 54C2 31 11 15 29 2" />
            <path className="flora-leaf" d="M6 37C-4 34-9 25-7 16C4 18 11 26 6 37Z" />
            <circle className="flora-berry flora-berry-pink" cx="31" cy="1" r="5" />
          </g>
          <g className="flora-mini" transform="translate(663 84)">
            <path className="flora-stem" d="M0 59C3 34 13 16 33 3" />
            <path className="flora-leaf flora-leaf-alt" d="M10 41C25 38 34 28 37 16C22 16 12 25 10 41Z" />
            <circle className="flora-berry flora-berry-gold" cx="35" cy="1" r="5" />
          </g>
        </>
      )}
    </svg>
  );
}
