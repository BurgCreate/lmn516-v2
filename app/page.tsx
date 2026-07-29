import SiteHeader from "@/components/SiteHeader";
import MomentBubble from "@/components/MomentBubble";
import HeroSection from "@/components/home/HeroSection";
import LatestPosts from "@/components/home/LatestPosts";
import LifeArchive from "@/components/home/LifeArchive";
import AboutSection from "@/components/home/AboutSection";
import SiteFooter from "@/components/home/SiteFooter";
import {
  getPosts,
  getPostById,
  getMediaImages,
  getMoments,
} from "@/lib/wordpress";

export const revalidate = 300;

function getTodayInfo() {
  const now = new Date();

  return {
    date: `${String(now.getMonth() + 1).padStart(2, "0")}.${String(
      now.getDate()
    ).padStart(2, "0")}`,
    fullDate: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(now.getDate()).padStart(2, "0")}`,
    weekday: now.toLocaleDateString("zh-CN", {
      weekday: "long",
    }),
  };
}

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
  const pushupProgress =
    target > 0 ? ((pushups / target) * 100).toFixed(2) : "0.00";
  const remaining = Math.max(target - pushups, 0);
  const today = getTodayInfo();
  const yearProgress = getYearProgress();

  return (
    <main id="top">
      <div className="paper-noise" aria-hidden="true" />

      <SiteHeader />

      <HeroSection
        mediaImages={mediaImages}
        today={today}
        yearProgress={yearProgress}
        featured={featured}
        pushupPost={pushupPost}
        pushups={pushups}
        target={target}
        pushupProgress={pushupProgress}
        remaining={remaining}
      />

      <LatestPosts featured={featured} cards={cards} />
      <LifeArchive />
      <AboutSection />

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