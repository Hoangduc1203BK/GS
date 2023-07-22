import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
export async function middleware(request: NextRequest) {
//   // let hostname = request.headers.get("host")
  const url = request.nextUrl.clone()
  const role = request.cookies.get('role')
  
  if(!request.cookies.has('token')){
    url.pathname = "/login"
    const resp = NextResponse.redirect(url)
    // resp.headers.set("set-cookie", `${[`siteId=${63}; path=/; samesite=lax;`, `type=${0}; path=/; samesite=lax;`]}`)
    return resp
  }
  else {
    if(role.value === 'admin') {
      if(url.pathname.includes('/teacher') || url.pathname.includes('/student') || url.pathname == '/' || url.pathname == '/admin'){
        url.pathname = "/admin/departmentManage"
        const resp = NextResponse.redirect(url)
        // resp.headers.set("set-cookie", `${[`siteId=${63}; path=/; samesite=lax;`, `type=${0}; path=/; samesite=lax;`]}`)
        return resp
      } else {
        return NextResponse.next()
      }
    } else if(role.value === 'teacher'){
      if(url.pathname.includes('/admin') || url.pathname.includes('/student') || url.pathname == '/'|| url.pathname == '/admin'){
        url.pathname = "/teacher"
        const resp = NextResponse.redirect(url)
        // resp.headers.set("set-cookie", `${[`siteId=${63}; path=/; samesite=lax;`, `type=${0}; path=/; samesite=lax;`]}`)
        return resp
      }else {
        return NextResponse.next()
      }
    } else {
      if(url.pathname.includes('/admin') || url.pathname.includes('/teacher') || url.pathname == '/'|| url.pathname == '/admin'){
        url.pathname = "/student"
        const resp = NextResponse.redirect(url)
        // resp.headers.set("set-cookie", `${[`siteId=${63}; path=/; samesite=lax;`, `type=${0}; path=/; samesite=lax;`]}`)
        return resp
      }else {
        return NextResponse.next()
      }
    }
  }
  
}

// // Runs only on matched pages
export const config = {
  matcher: ["/", "/admin/:path*", "/home", "/teacher/:path*", "/student/:path*"],
}
