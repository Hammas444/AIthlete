// src/middleware.ts

import { auth } from "@/lib/auth";

export default auth((req) => {
  // Check if the request contains a valid Auth.js session object
  const isLoggedIn = !!req.auth;
  
  // Define which URL paths require the user to be signed in
  const isProtectedRoute = 
    req.nextUrl.pathname.startsWith("/dashboard") || 
    req.nextUrl.pathname.startsWith("/workout") || 
    req.nextUrl.pathname.startsWith("/ai-coach");

  // If they try to access a protected route without a session, redirect to the landing page ("/")
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

// The matcher array tells Next.js which routes this middleware should run on.
// We configure it to run on EVERYTHING except static assets, images, and standard Next.js system files 
// to save on Edge function execution costs.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};