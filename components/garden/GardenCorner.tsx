type GardenCornerProps = {
  side?: "left" | "right";
  variant?: "flowers" | "leaves";
};

const assets = {
  flowers: "/garden-assets/botanical/wildflower-corner.svg",
  leaves: "/garden-assets/botanical/leaf-sprig.svg",
} as const;

export default function GardenCorner({
  side = "right",
  variant = "flowers",
}: GardenCornerProps) {
  return (
    <img
      className={`garden-corner garden-corner-${side} garden-corner-${variant}`}
      src={assets[variant]}
      alt=""
      aria-hidden="true"
    />
  );
}
