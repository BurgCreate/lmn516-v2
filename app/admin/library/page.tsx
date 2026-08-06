import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/DeleteButton";


export default async function AdminLibraryPage(){

  const sites = await prisma.site.findMany({

    orderBy:{
      createdAt:"desc"
    }

  });


  return (

    <main className="admin-library">


      <header className="admin-header">


        <h1>
          网站收藏管理
        </h1>



        <a

          href="/admin/library/new"

          className="admin-add"

        >
          + 添加网站
        </a>


      </header>





      <div className="admin-list">



        {sites.map((site)=>(


          <div

            key={site.id}

            className="admin-item"

          >



            <div className="admin-info">


              {site.domain && (

                <img

                  src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}

                  alt={site.name}

                  className="admin-icon"

                />

              )}





              <div className="admin-text">


                <h2>
                  {site.name}
                </h2>



                <span className="admin-tag">

                  {site.category || "未分类"}

                </span>



              </div>



            </div>





            <div className="admin-actions">



              <a

                href={`/admin/library/edit/${site.id}`}

                className="admin-edit"

              >

                编辑

              </a>





              <form

                action={`/api/library/delete?id=${site.id}`}

                method="post"

              >

                <DeleteButton />


              </form>



            </div>




          </div>


        ))}



      </div>



    </main>

  );

}