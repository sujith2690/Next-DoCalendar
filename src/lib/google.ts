// File: /src/lib/google.ts
import { google } from 'googleapis';

export function getGoogleCalendarClient(accessToken: string) {
    const authClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    authClient.setCredentials({
        access_token: accessToken
    });

    return google.calendar({
        version: 'v3',
        auth: authClient
    });
}