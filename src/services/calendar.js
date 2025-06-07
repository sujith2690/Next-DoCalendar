import { google } from 'googleapis';

export const getCalendarClient = (accessToken) => {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    return google.calendar({
        version: 'v3',
        auth: oauth2Client, // ✅ CORRECT
    });
};

export const createEvent = async (accessToken, eventData) => {
    const calendarClient = getCalendarClient(accessToken); //  renamed to avoid conflict
    const event = await calendarClient.events.insert({
        calendarId: 'primary',
        requestBody: eventData,
    });
    return event.data;  
};

export const updateEvent = async (accessToken, eventId, eventData) => {
    const calendar = getCalendarClient(accessToken);
    const event = await calendar.events.update({
        calendarId: 'primary',
        eventId,
        requestBody: eventData,
    });
    return event.data;
};

export const deleteEvent = async (accessToken, eventId) => {
    const calendar = getCalendarClient(accessToken);
    await calendar.events.delete({
        calendarId: 'primary',
        eventId,
    });
};

export const listEvents = async (accessToken, timeMin, timeMax) => {
    const calendar = getCalendarClient(accessToken);
    const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return events.data.items;
};