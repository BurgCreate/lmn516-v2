import { prisma } from "@/lib/prisma";
import SiteCard from "@/components/SiteCard";


export default async function LibraryPreview(){

  const sites = await prisma.site.findMany({

    take:8,

    orderBy:{
      createdAt:"desc"
    }

  });


  return (

    <section className="library-preview">


      <div className="library-preview-header">

        <h3>
          资源收藏
        </h3>


        <a href="/library">
          查看全部 →
        </a>


      </div>



      <div className="library-preview-grid">


        {sites.map((site)=>(

          <SiteCard

            key={site.id}

            site={site}

          />

        ))}


      </div>


    </section>

  );

}