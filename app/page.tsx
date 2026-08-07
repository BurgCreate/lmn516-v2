import HeroSection from "@/components/home/HeroSection";
import LatestPosts from "@/components/home/LatestPosts";
import LifeArchive from "@/components/home/LifeArchive";
import AboutSection from "@/components/home/AboutSection";
import GardenAtmosphere from "@/components/home/GardenAtmosphere";
import GardenSectionFrame from "@/components/home/GardenSectionFrame";

import {
  getPosts,
  getPostById,
  getMediaImages,
  getMoments,
} from "@/lib/wordpress";


export const revalidate = 60;


export default async function HomePage() {


  const [
    posts,
    mediaImages,
    moments,
  ] = await Promise.all([

    getPosts(20),

    getMediaImages(100),

    getMoments(1),

  ]);



  const latestMoment = moments[0];


  const featured = posts[0];


  const cards = posts.slice(1, 4);



  const pushupPost = await getPostById(347);



  const pushupMatch =
    pushupPost?.title.match(
      /已完成\s*([\d,]+)\s*个/
    );



  const pushups = pushupMatch

    ? Number(
        pushupMatch[1].replace(/,/g, "")
      )

    : 0;



  const target = 10000;



  const pushupProgress =

    target > 0

      ? ((pushups / target) * 100).toFixed(2)

      : "0.00";



  const remaining =

    Math.max(target - pushups, 0);



  return (

    <main id="top">


      <div
        className="paper-noise"
        aria-hidden="true"
      />



      <GardenAtmosphere />



      {/* 近期文章 */}

      <GardenSectionFrame

        variant="notes"

      >

        <LatestPosts

          featured={featured}

          cards={cards}

        />

      </GardenSectionFrame>



      {/* 今日档案 + 照片轮播 */}

      <HeroSection

        mediaImages={mediaImages}

        featured={featured}

        pushupPost={pushupPost}

        pushups={pushups}

        target={target}

        pushupProgress={pushupProgress}

        remaining={remaining}

      />



      {/* 收藏目录 */}

      <GardenSectionFrame

        variant="archive"

      >

        <LifeArchive />

      </GardenSectionFrame>



      {/* 关于本站 */}

      <GardenSectionFrame

        variant="about"

      >

        <AboutSection />

      </GardenSectionFrame>



    </main>

  );

}