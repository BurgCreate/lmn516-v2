import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(
  request: NextRequest
){

  const pathname =
    request.nextUrl.pathname;


  const auth =
    request.cookies.get(
      "site_editor_auth"
    );



  if(
    pathname.startsWith("/admin")
  ){

    if(!auth){

      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );

    }

  }


  return NextResponse.next();

}



export const config = {

  matcher:[
    "/admin/:path*"
  ],

};