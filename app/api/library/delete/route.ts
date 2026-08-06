import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req:Request){

  console.log("DELETE API RUN");


  const {searchParams}=new URL(req.url);

  const id = Number(
    searchParams.get("id")
  );


  console.log("DELETE ID:", id);


  await prisma.site.delete({
    where:{
      id
    }
  });


  return NextResponse.redirect(
    new URL("/admin/library",req.url)
  );

}