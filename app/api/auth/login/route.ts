import { NextResponse } from "next/server";


export async function POST(req:Request){

  const formData =
    await req.formData();


  const password =
    formData.get("password") as string;



  if(
    password !== process.env.SITE_EDITOR_PASSWORD
  ){

    return NextResponse.redirect(
      new URL(
        "/login?error=1",
        req.url
      )
    );

  }



  const response =
    NextResponse.redirect(
      new URL(
        "/admin/library",
        req.url
      )
    );



  response.cookies.set(
    "site_editor_auth",
    "true",
    {
      httpOnly:true,

      secure:
        process.env.NODE_ENV === "production",

      sameSite:"lax",

      path:"/",

      maxAge:
        60 * 60 * 24 * 7,
    }
  );


  return response;

}