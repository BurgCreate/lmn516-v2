import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";


async function updateSite(
  id:number,
  formData:FormData
){

  "use server";


  const name =
    formData.get("name") as string;


  const url =
    formData.get("url") as string;


  const domain =
    formData.get("domain") as string;


  const description =
    formData.get("description") as string;


  const category =
    formData.get("category") as string;


  const tags =
    formData.get("tags") as string;



  await prisma.site.update({

    where:{
      id,
    },


    data:{

      name,

      url,

      domain,

      description,

      category,

      tags,

    },

  });


  redirect("/admin/library");

}



export default async function EditLibraryPage({
  params,
}:{
  params:{
    id:string
  }
}){


  const id =
    Number(params.id);



  const site =
    await prisma.site.findUnique({

      where:{
        id,
      },

    });



  if(!site){

    return (
      <main className="admin-form">

        <h1>
          网站不存在
        </h1>

      </main>
    );

  }



  return (

    <main className="admin-form">


      <h1>
        编辑网站
      </h1>



      <form
        action={updateSite.bind(null,id)}
      >


        <input
          name="name"
          defaultValue={site.name}
          placeholder="网站名称"
          required
        />



        <input
          name="url"
          defaultValue={site.url}
          placeholder="网站地址"
          required
        />



        <input
          name="domain"
          defaultValue={site.domain}
          placeholder="域名"
          required
        />



        <textarea
          name="description"
          defaultValue={site.description ?? ""}
          placeholder="网站简介"
        />



        <input
          name="category"
          defaultValue={site.category ?? ""}
          placeholder="分类"
        />



        <input
          name="tags"
          defaultValue={site.tags ?? ""}
          placeholder="标签"
        />



        <button>
          保存修改
        </button>


      </form>


    </main>

  );

}