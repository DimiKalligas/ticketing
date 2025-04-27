import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./src/lib/session";

// export type UserEnumTypes = "user" | "manager" | "admin";

// export type Tokens = { // Actual Token Type
//   access: string;
//   refresh?: string;
// }

// export type UserType = { // Payload when decrypted from JWT
//   accountType: UserEnumTypes;
//   accountid: string;
//   exp: number;
//   email: string;
//   updatedAt: string;
// }

const protectedRoutes = ["/tickets", "/customers", "/actions/saveTicketAction"];  // ή και src\app\(ts)\tickets\form\TicketForm.tsx
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname; // get current page pathname
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // const session = cookies().get("session")?.value; // Retrieve the session cookie value from the request
  const cookie = (await cookies()).get("session")?.value;
  console.log("cookie", cookie);
  
  const session = await decrypt(cookie);

  // as per https://nextjs.org/docs/app/api-reference/functions/cookies ->
  // const cookieStore = await cookies()
  // const cookie = cookieStore.get("session")?.value;
  // const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Πότε χρειάζεται?
  // if (isPublicRoute && session?.userId) {
  //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  // }

  return NextResponse.next();
}

// OG middleware
// import { NextRequest } from "next/server";
// import { updateSession } from "./lib";

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }
