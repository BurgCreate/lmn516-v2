import GardenGirl, { type GardenGirlScene } from "./GardenGirl";

type GardenPageHeroProps = {
  scene: GardenGirlScene;
  place: string;
  eyebrow: string;
  title: string;
  intro: string;
};

export default function GardenPageHero({
  scene,
  place,
  eyebrow,
  title,
  intro,
}: GardenPageHeroProps) {
  return (
    <header className="garden-page-hero">
      <div className="garden-page-hero-copy">
        <p className="garden-place-label">
          <span aria-hidden="true">⌖</span>
          {place}
        </p>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="garden-page-intro">{intro}</p>
      </div>

      <div className="garden-page-hero-scene" aria-hidden="true">
        <span className="garden-page-sunlight" />
        <img
          className="garden-page-butterfly"
          src="/garden-assets/nature/butterfly.webp"
          alt=""
        />
        <GardenGirl
          scene={scene}
          className="garden-page-girl"
          sizes="(max-width: 760px) 310px, 390px"
        />
        <img
          className="garden-page-flower"
          src="/garden-assets/botanical/wildflower-corner.svg"
          alt=""
        />
      </div>
    </header>
  );
}
