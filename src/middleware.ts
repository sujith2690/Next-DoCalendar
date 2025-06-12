import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const publicPath = path === '/login' || path === '/signUp'
    const token = request.cookies.get('authjs.session-token')?.value;
    console.log(token, '------ token in middleware');

    if (publicPath && token) {
        console.log('-------------redirecting to home')
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!publicPath && token) {
        console.log('-------------redirecting to next')
        return NextResponse.rewrite(request.nextUrl)
    }
    if (!publicPath && !token) {
        console.log('-------------redirecting to login')
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signUp',
        '/profile',
        '/myEvents',
        '/addEvent',
        // '/edit/:path*',
        '/profile/:path*'
    ],
}