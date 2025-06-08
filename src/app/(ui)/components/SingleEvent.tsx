import React from "react";
import { CalendarEvent } from "@/app/types/event";
import { IoClose, IoPencil } from "react-icons/io5";
import { redirect, useRouter } from "next/navigation";

interface Props {
    singleEvents: CalendarEvent | null;
    onClose: () => void;
}

const SingleEvent = ({ singleEvents, onClose }: Props) => {
    const router = useRouter();

    if (!singleEvents) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
                ❌ No event selected.
            </div>
        );
    }

    const handleEdit = () => {
        redirect(`/edit/${singleEvents.googleEventId}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 overflow-y-auto">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-2xl p-3 sm:p-5 text-xs sm:text-sm">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={onClose}
                >
                    <IoClose size={30} />
                </button>

                <h1 className="text-base sm:text-lg font-bold text-center text-indigo-700 mb-2">
                    Event Details
                </h1>
                <p className="text-center text-gray-600 mb-4 text-xs sm:text-sm">
                    Here's your event summary & info
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Summary */}
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg shadow-inner">
                        <h2 className="text-sm font-semibold text-indigo-600 mb-1">📌 Summary</h2>
                        <p className="text-gray-700 break-words">{singleEvents.summary || "N/A"}</p>
                    </div>

                    {/* Location */}
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg shadow-inner">
                        <h2 className="text-sm font-semibold text-indigo-600 mb-1">📍 Location</h2>
                        <p className="text-gray-700 break-words">{singleEvents.location || "N/A"}</p>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg shadow-inner sm:col-span-2">
                        <h2 className="text-sm font-semibold text-indigo-600 mb-1">📝 Description</h2>
                        <p className="text-gray-700 break-words">{singleEvents.description || "N/A"}</p>
                    </div>

                    {/* Date & Attendees */}
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg shadow-inner sm:col-span-2">
                        <h2 className="text-sm font-semibold text-indigo-600 mb-1">🕒 Date & Attendees</h2>
                        <p className="text-gray-700">
                            <span className="block">Start: {singleEvents.start?.dateTime || "N/A"}</span>
                            <span className="block">End: {singleEvents.end?.dateTime || "N/A"}</span>
                        </p>
                        <div className="mt-2">
                            <span className="block font-medium text-gray-600">Attendees:</span>
                            <ul className="list-disc list-inside text-gray-700 mt-1">
                                {singleEvents.attendees?.length > 0 ? (
                                    singleEvents.attendees.map((attendee, i) => (
                                        <li key={i}>{attendee.email}</li>
                                    ))
                                ) : (
                                    <li>No attendees</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Edit Button */}
                <div className="mt-6 text-right ">
                    <button
                        onClick={handleEdit}
                        className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm hover:bg-indigo-700 transition"
                    >
                        <IoPencil size={16} />
                        Edit Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleEvent;
