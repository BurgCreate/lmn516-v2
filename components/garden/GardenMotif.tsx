import Image from "next/image";

type GardenMotifName = "leaf" | "daisy" | "butterfly" | "grass";

type GardenMotifProps = {
  name: GardenMotifName;
  className?: string;
  decorative?: boolean;
};

const motifAssets: Record<GardenMotifName, { src: string; alt: string }> = {
  leaf: { src: "/garden-assets/nature/leaf.webp", alt: "手绘叶片" },
  daisy: { src: "/garden-assets/nature/daisy.webp", alt: "手绘小雏菊" },
  butterfly: { src: "/garden-assets/nature/butterfly.webp", alt: "手绘蝴蝶" },
  grass: { src: "/garden-assets/nature/grass.webp", alt: "手绘草地" },
};

export default function GardenMotif({
  name,
  className = "",
  decorative = true,
}: GardenMotifProps) {
  const asset = motifAssets[name];

  return (
    <span className={`garden-motif garden-motif-${name} ${className}`.trim()}>
      <Image
        src={asset.src}
        alt={decorative ? "" : asset.alt}
        fill
        sizes="240px"
        aria-hidden={decorative}
        className="garden-motif-media"
      />
    </span>
  );
}
