import PhotoGallery from "@/components/PhotoGallery";
import { getMediaImages } from "@/lib/wordpress";

export const revalidate = 300;

export default async function PhotosPage() {
  const images = await getMediaImages(100);

  return (
    <main className="shell page photos-page">

      <PhotoGallery images={images} />


      <div className="photos-page-count">

        <strong>
          {images.length}
        </strong>

        <span>
          张照片
        </span>

      </div>


    </main>
  );
}