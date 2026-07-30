import SiteHeader from "@/components/SiteHeader";
import MomentBubble from "@/components/MomentBubble";
import HomeWorldHero from "@/components/home/HomeWorldHero";
import LatestPosts from "@/components/home/LatestPosts";
import LifeArchive from "@/components/home/LifeArchive";
import AboutSection from "@/components/home/AboutSection";
import SiteFooter from "@/components/home/SiteFooter";
import GardenTrail from "@/components/home/GardenTrail";
import GardenAtmosphere from "@/components/home/GardenAtmosphere";
import GardenSectionFrame from "@/components/home/GardenSectionFrame";
import {
  getPosts,
  getPostById,
  getMediaImages,
  getMoments,
} from "@/lib/wordpress";

export const revalidate = 300;

function getYearProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);

  const progress =
    ((now.getTime() - start.getTime()) /
      (end.getTime() - start.getTime())) *
    100;

  return progress.toFixed(1);
}

export default async function HomePage() {
  const [posts, mediaImages, moments] = await Promise.all([
    getPosts(20),
    getMediaImages(100),
    getMoments(1),
  ]);

  const latestMoment = moments[0];
  const featured = posts[0];
  const cards = posts.slice(1, 4);
  const pushupPost = await getPostById(347);

  const pushupMatch = pushupPost?.title.match(/已完成\s*([\d,]+)\s*个/);
  const pushups = pushupMatch
    ? Number(pushupMatch[1].replace(/,/g, ""))
    : 0;

  const target = 10000;
  const yearProgress = getYearProgress();

  return (
    <main id="top">
      <div className="paper-noise" aria-hidden="true" />
      <GardenAtmosphere />

      <SiteHeader />

      <HomeWorldHero
        mediaImages={mediaImages}
        featured={featured}
        pushups={pushups}
        target={target}
        yearProgress={yearProgress}
      />

      <GardenTrail variant="bird" label="沿着小路，看看最近长出了什么" />
      <GardenSectionFrame variant="notes" marker="01 · 新芽">
        <LatestPosts featured={featured} cards={cards} />
      </GardenSectionFrame>
      <GardenTrail variant="bench" label="在长椅旁，翻一翻生活收藏" />
      <GardenSectionFrame variant="archive" marker="02 · 收藏">
        <LifeArchive />
      </GardenSectionFrame>
      <GardenTrail variant="mailbox" label="花园尽头，也欢迎留下你的痕迹" />
      <GardenSectionFrame variant="about" marker="03 · 树下">
        <AboutSection />
      </GardenSectionFrame>

      {latestMoment && (
        <MomentBubble
          content={latestMoment.content}
          date={latestMoment.date}
        />
      )}

      <SiteFooter />
    </main>
  );
}