import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    console.log('Hi! I am Middleware')

    // Getting cookies that has been stored
    const cookie = request.cookies.get('userJwtCookie')?.value

    // welcomePath is only for the users who are not logged in
    const welcomePath = '/welcome'

    // loggedUserPaths are only for the users who are logged in
    const loggedUserPaths = ['/', '/global']

    // Extracting the current path
    const { pathname } = request.nextUrl

    // NO restrictions for these two APIs, the middleware will be closed.
    if (pathname === '/api/users/login' || pathname === '/api/users/signup' || pathname === '/api/admin/managetasks'
        || pathname === '/api/admin/manageusers') {
        return
    }

    if (pathname === welcomePath) {
        /* If the users are logged in and trying to access public (signup/login) routes/pages,
       they will be redirected to home page */
        if (cookie) {
            console.log('You are already logged in!')
            return NextResponse.redirect(new URL('/', request.url))
        }
    } else {
        /* If the users are not logged in and trying to access private routes/pages, 
        they will be redirected to welcome page */
        if (!cookie) {
            if (pathname.startsWith('/api')) {
                return NextResponse.json({
                    message: 'API access denied',
                    success: false,
                }, { status: 401 })
            }
            console.log('You are not logged in!')
            return NextResponse.redirect(new URL('/welcome', request.url))
        }
    }

    //return NextResponse.redirect(new URL('/', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/global', '/welcome', '/api/:path*'],
}