
"use client"

import { getGoogleEvent, updateEventNow } from '@/app/axiosPath/events';
import { formatDateToGoogleCalendar, parseGoogleCalendarDate } from '@/lib/dateFormat';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

type EventFormData = {
    summary: string;
    description: string;
    start: string;
    end: string;
    location: string;
    attendees: string;
};

type FormErrors = {
    summary?: string;
    start?: string;
    end?: string;
    [key: string]: string | undefined;
};

function getCurrentDateTimeString(): string {
    const now = new Date();
    // Convert to local datetime string in format YYYY-MM-DDTHH:MM
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const EditEvent = ({ eventId }: { eventId: string }) => {
    const { data: session } = useSession();
    if (!session) { redirect('/login'); }

    const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTimeString());
    const [formData, setFormData] = useState<EventFormData>({
        summary: '',
        description: '',
        start: '',
        end: '',
        location: '',
        attendees: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    // Update current time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(getCurrentDateTimeString());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const getEventData = async (eventId: string) => {
            try {
                const { data } = await getGoogleEvent(eventId);
                console.log("Fetched event data:--------", data.start.dateTime);
                const formattedData: EventFormData = {
                    summary: data.summary || '',
                    description: data.description || '',
                    start: data?.start?.dateTime
                        ? parseGoogleCalendarDate(data.start.dateTime)
                        : '',
                    end: data?.end?.dateTime
                        ? parseGoogleCalendarDate(data.end.dateTime)
                        : '',
                    location: data.location || '',
                    attendees: (data.attendees || []).map((a: any) => a.email).join(', '),
                };
                console.log("formattedData:---f-----", formattedData.start);
                setFormData(formattedData);
            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error('Failed to fetch event details.');
            }
        };
        getEventData(eventId);
    }, [eventId]);


    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const now = new Date();
        const startDate = formData.start ? new Date(formData.start) : null;

        if (!formData.summary.trim()) newErrors.summary = 'Title is required';
        if (!formData.start) {
            newErrors.start = 'Start time is required';
        } else if (startDate && startDate < now) {
            newErrors.start = 'Start time cannot be in the past';
        }

        if (!formData.end) {
            newErrors.end = 'End time is required';
        } else if (formData.start && formData.end && new Date(formData.start) >= new Date(formData.end)) {
            newErrors.end = 'End time must be after start time';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const attendees = formData.attendees
                .split(',')
                .map(email => email.trim())
                .filter(email => email)
                .map(email => ({ email }));

            const updatedData = {
                summary: formData.summary,
                description: formData.description,
                location: formData.location,
                start: {
                    dateTime: formatDateToGoogleCalendar(formData.start),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: formatDateToGoogleCalendar(formData.end),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                attendees,
                eventId
            };
            await updateEventNow(updatedData);
            toast.success('Event updated successfully!');
            setFormData({
                summary: '',
                description: '',
                start: '',
                end: '',
                location: '',
                attendees: '',
            });
            redirect('/myEvents')
        } catch (error: any) {
            console.error('Error updating event:', error);
            toast.error(error?.response?.data?.error );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Update Event</h1>
                    <p className="mt-2 text-sm text-gray-600">Change form below to schedule your event</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                                Event Title *
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="summary"
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleChange}
                                    className={`block w-full px-4 py-3 rounded-md border ${errors.summary ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Team meeting, Conference, etc."
                                    required
                                />
                                {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="What's this event about?"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                                    Start Date & Time *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="datetime-local"
                                        id="start"
                                        name="start"
                                        value={formData.start}
                                        onChange={handleChange}
                                        min={currentDateTime}
                                        className={`block w-full px-4 py-3 rounded-md border ${errors.start ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                        required
                                    />
                                    {errors.start && <p className="mt-1 text-sm text-red-600">{errors.start}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                                    End Date & Time *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="datetime-local"
                                        id="end"
                                        name="end"
                                        value={formData.end}
                                        onChange={handleChange}
                                        min={formData.start || currentDateTime}
                                        className={`block w-full px-4 py-3 rounded-md border ${errors.end ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                        required
                                    />
                                    {errors.end && <p className="mt-1 text-sm text-red-600">{errors.end}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Online, Office, Conference Room A, etc."
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">
                                Attendees
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="attendees"
                                    name="attendees"
                                    value={formData.attendees}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="email1@example.com, email2@example.com"
                                />
                                <p className="mt-2 text-sm text-gray-500">Separate multiple emails with commas</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsSubmitting(false)}
                                className="px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : 'Update Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditEvent
