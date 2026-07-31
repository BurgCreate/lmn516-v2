import RandomPhotoWall from "@/components/RandomPhotoWall";
import type { MediaImage } from "@/lib/wordpress";

export default function HeroSection({ mediaImages }: { mediaImages: MediaImage[] }) {
  return (
    <section className="v3-hero" aria-label="首页照片">
      <RandomPhotoWall images={mediaImages} />
      <div className="v3-hero-dots" aria-hidden="true"><i /><i /><i /><i /></div>
    </section>
  );
}
