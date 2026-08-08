import { prisma } from "@/lib/prisma";
import EnglishView from "@/components/EnglishView";


export default async function EnglishPage() {


  const words =
    await prisma.englishWord.findMany({

      where:{
        mastered:false
      },

      orderBy:{
        createdAt:"desc"
      }

    });



  return (

    <main className="library-page">


      <header className="library-header">


        <div>

          <h1>
            English Garden
          </h1>


          <p>
            LMN516 英语学习
          </p>

        </div>


      </header>



      <EnglishView

        words={words}

      />


    </main>

  );

}