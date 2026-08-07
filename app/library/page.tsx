import { prisma } from "@/lib/prisma";
import SiteCard from "@/components/SiteCard";
import SiteEditorHover from "@/components/SiteEditorHover";


export default async function LibraryPage() {

  const sites =
    await prisma.site.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });



  return (

    <main className="library-page">


      <header className="library-header">

        <div>
          <h1>
            资源收藏
          </h1>

          <p>
            LMN516 收藏的网站、工具与资源
          </p>
        </div>


        <SiteEditorHover />


      </header>



      <div className="library-grid">

        {sites.map((site) => (

          <SiteCard
            key={site.id}
            site={site}
          />

        ))}

      </div>


    </main>

  );

}