import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    console.log('Cron Job Ran at:', new Date())
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    // return new NextResponse("cron job ", { status: 200 })
    return NextResponse.json({ message: "Cron Job Ran at " + new Date() })
}