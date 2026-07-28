import Link from "next/link";
import PhotoGallery from "@/components/PhotoGallery";
import { getMediaImages } from "@/lib/wordpress";

export const revalidate = 300;

export default async function PhotosPage() {
  const images = await getMediaImages(100);

  return (
    <main className="shell page photos-page">
      <Link href="/" className="back">
        ← 返回首页
      </Link>

      <header className="photos-page-header">
        <div>
          <p className="eyebrow">Photo Archive</p>
          <h1>照片墙</h1>
          <p className="photos-page-intro">
            一些被保存下来的日常瞬间。没有宏大叙事，只有生活偶尔留下的证据。
          </p>
        </div>

        <p className="photos-page-count">
          <strong>{images.length}</strong>
          <span>张照片</span>
        </p>
      </header>

      <PhotoGallery images={images} />
    </main>
  );
}
