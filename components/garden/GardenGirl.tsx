import Image from "next/image";

export type GardenGirlScene =
  | "welcome"
  | "about"
  | "reading"
  | "music"
  | "moments"
  | "lost";

type GardenGirlProps = {
  scene?: GardenGirlScene;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

const sceneAssets: Record<
  GardenGirlScene,
  { src: string; alt: string; ratio: "square" | "landscape" }
> = {
  welcome: {
    src: "/garden-assets/characters/garden-girl-welcome.jpeg",
    alt: "戴草帽的花园女孩正在照看一朵小雏菊",
    ratio: "square",
  },
  about: {
    src: "/garden-assets/characters/garden-girl-about.webp",
    alt: "花园女孩坐在山坡上眺望远方",
    ratio: "landscape",
  },
  reading: {
    src: "/garden-assets/characters/garden-girl-reading.webp",
    alt: "花园女孩坐在草地上阅读",
    ratio: "landscape",
  },
  music: {
    src: "/garden-assets/characters/garden-girl-music.webp",
    alt: "花园女孩戴着耳机听音乐",
    ratio: "landscape",
  },
  moments: {
    src: "/garden-assets/characters/garden-girl-moments.webp",
    alt: "花园女孩看着手中的蒲公英",
    ratio: "landscape",
  },
  lost: {
    src: "/garden-assets/characters/garden-girl-lost.webp",
    alt: "花园女孩拿着地图寻找方向",
    ratio: "landscape",
  },
};

export default function GardenGirl({
  scene = "welcome",
  className = "",
  priority = false,
  sizes = "(max-width: 760px) 88vw, 46vw",
}: GardenGirlProps) {
  const asset = sceneAssets[scene];

  return (
    <figure
      className={`garden-girl garden-girl-${scene} garden-girl-${asset.ratio} ${className}`.trim()}
      data-garden-scene={scene}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="garden-girl-media"
      />
    </figure>
  );
}
