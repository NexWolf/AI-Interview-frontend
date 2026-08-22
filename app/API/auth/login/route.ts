// import { API_URL } from "@/constants/routes";
// import { cookies } from "next/headers";
// import {  NextResponse } from "next/server";

// export async function POST (request : Request) {
//   try {
//     const body = await request.json();

//     const responseBackend = await fetch(`${API_URL}/api/v1/login` , {
//       method : "POST",
//       headers : {"Content-Type" : "application/json"},
//       body : JSON.stringify(body)
//     });

//     const data = await responseBackend.json();


//     if(!responseBackend.ok) {
//       return NextResponse.json(data , {status : responseBackend.status})
//     }

//     const response = NextResponse.json(data , {status : responseBackend.status})
//     const cookieStore = await cookies();

//     const setCookiesHeaders = responseBackend.headers.getSetCookie();
//     console.log("HERE HEADER HAS A COOKIES AFTER SIGNIN USER :" , setCookiesHeaders )

//     if(setCookiesHeaders && setCookiesHeaders.length > 0) {
//       setCookiesHeaders.forEach((cookie) => {
//         const [mainPair] = cookie.split(";");
//         const separatorIndex = mainPair.indexOf("=");
//         const name = mainPair.slice(0 , separatorIndex).trim();
//         const value = mainPair.slice(separatorIndex + 1);

//         if(name === "accessToken") {
//         response.cookies.set("accessToken" , value , {
//           httpOnly : true,
//           secure : process.env.NODE_ENV === "production",
//           sameSite : "lax",
//           path : "/",
//           maxAge : 60 * 60,
//         })
//         }


//         if(name === "refreshToken") {
//           response.cookies.set("refreshToken" , value , {
//             httpOnly : true,
//             secure : process.env.NODE_ENV === "production",
//             sameSite : "lax",
//             path : "/",
//             maxAge : 60 * 60 * 24 * 7
//           })
//         }
//       })
//     }

//     return response;
//   }catch(e) {
//     console.log("THer is Problem when login" , e);
//     return NextResponse.json(
//       {success: false, message: "Something went wrong"},
//       {status : 500}
//     )
//   }


// }
































  import { API_URL } from "@/constants/routes";
  import { NextRequest, NextResponse } from "next/server";

  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();

      // 1. Send login request to backend
      const backendResponse = await fetch(
        `${API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
          const data = await backendResponse.json();
        const cookies = backendResponse.headers.getSetCookie();
        console.log("SET-COOKIES ARRAY", cookies , cookies.length);

      console.log("BACKEND STATUS:", backendResponse.status);
  console.log("BACKEND DATA:", data);


      // 2. If backend login failed
      if (!backendResponse.ok) {
        return NextResponse.json(data, {
          status: backendResponse.status,
        });
      }

      // 3. Create Next.js response
      const response = NextResponse.json(data);
      console.log("SHOW THE RESPONSE FROM BACKEND" , response)

      // 4. Get cookies from backend
      const setCookies = backendResponse.headers.getSetCookie();

      // 5. Put cookies on localhost
      for (const cookie of setCookies) {
        const [cookiePair] = cookie.split(";");

        const separatorIndex = cookiePair.indexOf("=");

        const name = cookiePair.slice(0, separatorIndex);
        const value = cookiePair.slice(separatorIndex + 1);

        if (name === "accessToken") {
          response.cookies.set({
            name: "accessToken",
            value,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
          });
        }

        if (name === "refreshToken") {
          response.cookies.set({
            name: "refreshToken",
            value,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        }
      }

      return response;
    } catch (error) {
      console.error("LOGIN PROXY ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong",
        },
        {
          status: 500,
        }
      );
    }
  }