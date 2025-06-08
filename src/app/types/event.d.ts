
export type CalendarEvent = {
    googleEventId: string;
    summary: string;
    description: string;
    location: string;
    start: { dateTime: string };
    end: { dateTime: string };
    attendees: { email: string }[];
};

export type EventFormData = {
    summary: string;
    description: string;
    start: string;
    end: string;
    location: string;
    attendees: string;
};
