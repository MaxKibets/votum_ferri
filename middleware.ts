import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/shared/api/supabase";
import { ROUTES } from "@/shared/config/routes";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith(ROUTES.protected) && !user) {
    return NextResponse.redirect(new URL(ROUTES.auth.login, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
