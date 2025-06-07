import { auth } from '@/auth'; // adjust if custom path
import { getGoogleCalendarClient } from '@/lib/google';

export async function GET() {
    const session = await auth();

    if (!session?.googleAccessToken) {
        return new Response('Unauthorized', { status: 401 });
    }

    const calendar = getGoogleCalendarClient(session.googleAccessToken);

    const events = await calendar.events.list({
        calendarId: 'primary',
        maxResults: 5,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return Response.json(events.data.items);
}
