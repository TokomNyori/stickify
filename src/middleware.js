import { NextResponse, NextRequest } from 'next/server'
import { pathToRegexp } from 'path-to-regexp';

export function middleware(request) {

    // Getting cookies that has been stored
    const cookie = request.cookies.get('userJwtCookie')?.value
    // Extracting the current path
    const { pathname } = request.nextUrl

    // welcomePath is only for the users who are not logged in and notesPath is redirected to home page
    const welcomePath = '/welcome';
    const notesPath = '/notes';

    // Define a pattern for handling non-users on note paths (e.g., '/api/notes/123/handle-nonusers')
    const notesPattern = '/notes/:path+';
    const isDynamicNotesPath = pathToRegexp(notesPattern).test(pathname);

    // Define a pattern for handling non-users on note paths (e.g., '/api/notes/123/handle-nonusers')
    const handleNonUsersPattern = '/api/notes/:noteid/handle-nonusers';
    const isHandleNonUsersPath = pathToRegexp(handleNonUsersPattern).test(pathname);

    console.log('Pathname---------');
    console.log(pathname);

    // Main logic for the middleware
    if (!cookie) {
        if (pathname === welcomePath) {
            console.log('welcome to stickify');
            return
        } else if (
            pathname === '/api/users/login' || pathname === '/api/users/signup' || isHandleNonUsersPath || isDynamicNotesPath
            || pathname === '/api/send-otp-newusers'
        ) {
            // NO restrictions for these APIs and path, the middleware will be closed.
            console.log('Unrestricted access');
            return
        } else if (pathname.startsWith('/api')) {
            // If the path starts with '/api' and is not one of the unrestricted paths, block access.
            console.log('API access denied');
            return new NextResponse(null, { status: 401 })
        } else {
            console.log('You are not logged in!')
            return NextResponse.redirect(new URL('/welcome', request.url))
        }
    } else {
        if (pathname === notesPath) {
            console.log('/notes path is same as /');
            return NextResponse.redirect(new URL('/', request.url))
        } else if (pathname === welcomePath) {
            /* If the users are logged in and trying to access public (signup/login) routes/pages,
           they will be redirected to home page */
            console.log('You are already logged in!')
            return NextResponse.redirect(new URL('/', request.url))
        } else {
            console.log('No restrictions, you are logged in!')
        }
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/feeds', '/manage-profile', '/research', '/welcome', '/api/:path*', '/notes', '/notes/:path*'],
}