import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";


async function createSite(formData: FormData) {

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



  await prisma.site.create({

    data: {

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



export default function NewLibraryPage(){

  return (

    <main className="admin-form">


      <h1>
        添加网站
      </h1>


      <form action={createSite}>


        <input
          name="name"
          placeholder="网站名称"
          required
        />


        <input
          name="url"
          placeholder="网站地址"
          required
        />


        <input
          name="domain"
          placeholder="域名，例如 github.com"
          required
        />


        <textarea
          name="description"
          placeholder="网站简介"
        />


        <input
          name="category"
          placeholder="分类，例如 AI工具"
        />


        <input
          name="tags"
          placeholder="标签，例如 AI,效率"
        />


        <button>
          保存
        </button>


      </form>


    </main>

  );

}