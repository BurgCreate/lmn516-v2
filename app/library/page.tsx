import { prisma } from "@/lib/prisma";
import SiteEditorHover from "@/components/SiteEditorHover";
import LibraryView from "@/components/LibraryView";


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



      <LibraryView
        sites={sites}
      />


    </main>

  );

}