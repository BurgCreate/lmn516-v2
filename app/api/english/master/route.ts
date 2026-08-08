import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(
  req: Request
){

  const { searchParams } =
    new URL(req.url);


  const id =
    Number(
      searchParams.get("id")
    );


  if(!id){

    return NextResponse.json(
      {
        error:"missing id"
      },
      {
        status:400
      }
    );

  }



  await prisma.englishWord.update({

    where:{
      id
    },

    data:{
      mastered:true
    }

  });



  return NextResponse.json({

    success:true

  });


}