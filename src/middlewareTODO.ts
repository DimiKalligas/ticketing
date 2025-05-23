import { NextRequest } from "next/server";

export default withAuth(
    async function middleware(request: NextRequest) {
        // console.log(request) 
    }, {
    // Logged out -> attempting to access a protected route ->
    // I'm sent to login -> it redirects me to that page
    isReturnToCurrentPage: true,
}
)

export const config = {
    matcher: [
        /*
         *   Excluding the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - auth
         * - favicon.ico (favicon file)
         * - robots.txt
         * - images
         * - login
         * - homepage (represented with $ after beginning /)
         */
        '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|login|$).*)',
    ]
}