// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(
      "Error getting Supabase session in middleware:",
      sessionError.message
    );
  }

  if (req.nextUrl.pathname.startsWith("/mudir")) {
    if (req.nextUrl.pathname === "/mudir/login") {
      return res;
    }

    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/mudir/login";
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const userRole = session.user.app_metadata.role;

    const allowedRoles = ["owner", "admin"];

    if (!allowedRoles.includes(userRole as string)) {
      console.warn(
        `Unauthorized access attempt for role: ${userRole} to ${req.nextUrl.pathname}`
      );
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/mudir/login";
      redirectUrl.searchParams.set(
        "message",
        "Akses ditolak. Peran tidak valid."
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/mudir/:path*"],
};
