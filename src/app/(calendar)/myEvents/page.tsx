"use client";
import React, { useEffect, useState } from "react";
import { deleteEvent, myEvents } from "@/app/axiosPath/events";
import { FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { CalendarEvent } from "@/app/types/event";
import ConfirmModal from "@/app/(ui)/components/ConfirmModal";
import SingleEvent from "@/app/(ui)/components/SingleEvent";
import { localDateTime, parseGoogleCalendarDate } from "@/lib/dateFormat";

export default function MyCalender() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [single, setSingle] = useState(false)
    const [singleEvents, setSingleEvents] = useState<CalendarEvent | null>(null);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await myEvents();

                // Format each event in the array
                const formattedData = Array.isArray(data)
                    ? data.map((event: any) => ({
                        ...event,
                        summary: event.summary || '',
                        description: event.description || '',
                        start: {
                            ...event.start,
                            dateTime: event?.start?.dateTime
                                ? localDateTime(event.start.dateTime)
                                : '',
                        },
                        end: {
                            ...event.end,
                            dateTime: event?.end?.dateTime
                                ? localDateTime(event.end.dateTime)
                                : '',
                        },
                        location: event.location || '',
                        attendees: event.attendees || [],
                    }))
                    : [];
                setEvents(formattedData);
                console.log(formattedData, "-------Fetched events successfully");
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const openConfirmModal = (eventId: string) => {
        setEventToDelete(eventId);
        setShowConfirm(true);
    };

    const closeConfirmModal = () => {
        setEventToDelete(null);
        setShowConfirm(false);
    };

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        closeConfirmModal();
        try {
            await deleteEvent(eventToDelete);
            toast.success("Event Deleted");
            setEvents((prev) => prev.filter((e) => e.googleEventId !== eventToDelete));
        } catch (error) {
            toast.error("Failed to delete event");
            console.error(error);
        } finally {
            closeConfirmModal();
        }
    };
    const openSingleModal = (event: CalendarEvent) => {
        setSingle((prev) => !prev)
        setSingleEvents(event)
    }
    const onClose = () => setSingle(!single)

    const skeletonCard = () => (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4"></div>
        </div>
    );

    return (
        <section className="flex min-h-screen flex-col items-center justify-start p-6 sm:p-12 bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
            <p className="mt-2 text-lg text-gray-600">Google calendar page.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full max-w-6xl">
                {loading ? (
                    <>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i}>{skeletonCard()}</div>
                        ))}
                    </>
                ) : events.length === 0 ? (
                    <div className="col-span-full text-center text-gray-600 text-xl font-medium">
                        🚫 No events added.
                    </div>
                ) : (
                    events.map((event, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-2xl"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                                        📌 {event.summary}
                                    </h2>
                                    <p className="text-gray-700">Desc: {event.description}</p>
                                    <p className="text-gray-500">📍 {event.location}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openSingleModal(event)}
                                        className="p-2  flex items-center justify-center rounded-full cursor-pointer  hover:text-gray-600"
                                    >
                                        <FaEye className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={() => openConfirmModal(event.googleEventId)}
                                        className="p-2  flex items-center justify-center rounded-full cursor-pointer text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-700">
                                    <span className="block">Start: {event.start.dateTime}</span>
                                    <span className="block">End: {event.end.dateTime}</span>
                                </p>
                                <span className="block mt-2 font-medium text-gray-600">Attendees:</span>
                                <ul className="list-disc list-inside">
                                    {event.attendees?.map((attendee, i) => (
                                        <li key={i}>{attendee.email}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {showConfirm && (
                <ConfirmModal closeConfirmModal={closeConfirmModal} handleDeleteEvent={handleDeleteEvent} />
            )}
            {
                single && (
                    <SingleEvent singleEvents={singleEvents} onClose={onClose} />
                )
            }
        </section>
    );
}
