"use client"

import { useState } from "react";
import SiteCard from "./SiteCard";


export default function LibraryView({
  sites
}:{
  sites:any[]
}){


  const [mode,setMode] = useState("grid");



  const groups =
    sites.reduce((acc,item)=>{

      const c = item.category || "其他";


      if(!acc[c]){
        acc[c] = [];
      }


      acc[c].push(item);


      return acc;


    },{} as Record<string,any[]>);




  return (

    <>


      <div className="library-switch">


        <button

          className={
            mode==="grid"
            ? "active"
            : ""
          }

          onClick={() => setMode("grid")}

        >
          平铺
        </button>



        <button

          className={
            mode==="category"
            ? "active"
            : ""
          }

          onClick={() => setMode("category")}

        >
          分类
        </button>


      </div>





      {
        mode==="grid"

        ?

        <div className="library-grid">

          {
            sites.map(site=>(

              <SiteCard

                key={site.id}

                site={site}

              />

            ))
          }

        </div>


        :


        Object.entries(groups).map(
          ([category,items])=>(

            <section

              className="library-section"

              key={category}

            >

              <h2 className="library-category-title">
                {category}
              </h2>



              <div className="library-grid">

                {
                  (items as any[]).map(site=>(

                    <SiteCard

                      key={site.id}

                      site={site}

                    />

                  ))
                }

              </div>


            </section>

          )
        )

      }


    </>

  )

}