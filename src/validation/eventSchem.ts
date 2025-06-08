
import * as Yup from 'yup';

export const EventSchema = Yup.object().shape({
    summary: Yup.string().required('Title is required'),
    start: Yup.date()
        .min(new Date(), 'Start time cannot be in the past')
        .required('Start time is required'),
    end: Yup.date()
        .min(Yup.ref('start'), 'End time must be after start time')
        .required('End time is required'),
    // location and description are optional, so no validation needed unless you want
    attendees: Yup.string()
        .test(
            'emails-format',
            'One or more emails are invalid',
            value => {
                if (!value) return true; // attendees is optional
                const emails = value.split(',').map(e => e.trim());
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emails.every(email => emailRegex.test(email));
            }
        ),
});
