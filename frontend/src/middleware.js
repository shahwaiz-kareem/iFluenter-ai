import { NextResponse } from "next/server";

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const isAdmin = req.cookies.get("isAdmin");
  // const isAuth = req.cookies.get("isAuth");
  const refreshToken = req.cookies.get("refreshToken");
  const isOnboarded = req.cookies.get("isOnboarded");

  if (pathname.startsWith("/admin")) {
    if (!isAdmin || !refreshToken)
      return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (pathname.startsWith("/dashboard")) {
    if (!refreshToken)
      return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  //Todo (Done): if the authentication issue doesn't happens in production uncomment this

  if (["/", ""].includes(pathname) && process.env.NODE_ENV === "production") {
    if (refreshToken)
      return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
  //   if (refreshToken)
  //     return NextResponse.redirect(new URL("/dashboard", req.url));
  // }
  if (pathname.startsWith("/onboarding")) {
    if (!refreshToken)
      return NextResponse.redirect(new URL("/sign-in", req.url));

    if (refreshToken && isOnboarded)
      return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  // console.log("I'm in ");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding",
    "/sign-in",
    "/sign-up",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
