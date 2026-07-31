import SiteHeader from "@/components/SiteHeader";
import MomentBubble from "@/components/MomentBubble";
import HeroSection from "@/components/home/HeroSection";
import LatestPosts from "@/components/home/LatestPosts";
import LifeArchive from "@/components/home/LifeArchive";
import AboutSection from "@/components/home/AboutSection";
import HomeClock from "@/components/home/HomeClock";
import { getPosts, getPostById, getMediaImages, getMoments } from "@/lib/wordpress";

export const revalidate = 300;

export default async function HomePage() {
  const [posts, mediaImages, moments, pushupPost] = await Promise.all([
    getPosts(20),
    getMediaImages(100),
    getMoments(1),
    getPostById(347),
  ]);

  const pushupMatch = pushupPost?.title.match(/已完成\s*([\d,]+)\s*个/);
  const pushups = pushupMatch ? Number(pushupMatch[1].replace(/,/g, "")) : 0;
  const target = 10000;
  const pushupProgress = Math.min(100, (pushups / target) * 100);
  const latestMoment = moments[0];

  return (
    <main id="top" className="home-v3-page">
      <div className="home-v3-canvas">
        <SiteHeader className="home-v3-header" />

        <div className="home-v3-grid">
          <div className="home-v3-left">
            <HeroSection mediaImages={mediaImages} />
            <LatestPosts posts={posts.slice(0, 4)} />
          </div>

          <div className="home-v3-right">
            <section className="v3-panel v3-today" aria-labelledby="today-title">
              <div className="v3-panel-title">
                <span className="v3-title-icon" aria-hidden="true">▣</span>
                <h1 id="today-title">今日档案</h1>
                <img className="v3-title-plant" src="/garden-assets/icons/plant.svg" alt="" aria-hidden="true" />
              </div>

              <div className="v3-today-body">
                <div className="v3-pushup">
                  <div className="v3-pushup-figure" aria-hidden="true"><img src="/garden-assets/characters/pushup-child.png" alt="" /></div>
                  <div className="v3-pushup-copy">
                    <span>持续进行</span>
                    <strong>一万个俯卧撑</strong>
                    <p><b>{pushups.toLocaleString("zh-CN")}</b> / {target.toLocaleString("zh-CN")} 个</p>
                    <div className="v3-progress" role="progressbar" aria-valuemin={0} aria-valuemax={target} aria-valuenow={pushups}>
                      <span style={{ width: `${pushupProgress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="v3-clock-area">
                  <HomeClock />
                </div>
              </div>
            </section>

            <LifeArchive />
            <AboutSection />
          </div>
        </div>

        <footer className="home-v3-footer">
          <span aria-hidden="true">❀　❁　❀</span>
          <p>© 2026 LMN516. All rights reserved.</p>
          <span aria-hidden="true">𓅪</span>
        </footer>
      </div>

      {latestMoment && <MomentBubble content={latestMoment.content} date={latestMoment.date} />}
    </main>
  );
}
