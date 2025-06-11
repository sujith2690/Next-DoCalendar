import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/utils/dbConfig";
import { auth } from "@/auth";
import { createEvent, updateEvent, deleteEvent, getCalendarClient, listEvents } from '@/services/calendar';
import userModel from "@/models/userModel";
import eventModel from "@/models/eventModel";
import { time } from "console";
import { getSession } from "@/utils/session";
import { addISTOffset } from "@/lib/dateFormat";

export async function GET(req: NextRequest) {
    const session = await auth();
    console.log(session, '----------------- session in addEvent route');

    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    await connectDB();
    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(now.getDate() + 7);
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userEvents = await eventModel.findOne({ userId: session.user._id })
        console.log(userEvents.events, '-----------------all  event route db');
        return new Response(JSON.stringify(userEvents.events), { status: 200 });
    } catch (error: any) {
        console.log("error fetching events:-----------", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.googleAccessToken) {
        return new Response(
            JSON.stringify({ error: "Unauthorized - no access token" }),
            { status: 401 }
        );
    }
    await connectDB();
    const body = await req.json();

    try {

        const result = addISTOffset(body.start.dateTime)
        body.start.dateTime = result
        const result2 = addISTOffset(body.end.dateTime)
        body.end.dateTime = result2


        const userId = session.user._id;
        const userEmail = session.user.email;

        // Step 1: Create event in Google Calendar
        const googleEvent = await createEvent(session.googleAccessToken, body);
        console.log(googleEvent, '-----------saved event in google calendar');

        // Step 2: Prepare event data to save in MongoDB
        const newEvent = {
            googleEventId: googleEvent.id,
            summary: googleEvent.summary,
            description: googleEvent.description,
            location: googleEvent.location,
            start: googleEvent.start,
            end: googleEvent.end,
            attendees:
                body.attendees?.map((a: any) => ({
                    email: a.email,
                    responseStatus: a.responseStatus || "needsAction",
                })) || [],
            createdAt: new Date(),
        };
        console.log(newEvent, '-----------savING DAATA IN MONGODB');

        // Step 3: Check if user already has a document
        const existingDoc = await eventModel.findOne({ userId });

        if (!existingDoc) {
            // New user, create new document
            const savedUser = await eventModel.create({
                userId,
                userEmail,
                events: [newEvent],
            });
        } else {
            // Existing user, push new event to their events array
            const savedUser = await eventModel.updateOne(
                { userId },
                {
                    $push: { events: newEvent },
                    $set: { updatedAt: new Date() },
                }
            );
        }
        return new Response(JSON.stringify(googleEvent), { status: 200 });
    } catch (error: any) {
        console.error("Error saving event:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || !session.googleAccessToken) {
        return new Response(
            JSON.stringify({ error: "Unauthorized - no access token" }),
            { status: 401 }
        );
    }
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const googleEventId = searchParams.get("eventId");

        if (!googleEventId) {
            return new Response(JSON.stringify({ error: "Missing googleEventId" }), { status: 400 });
        }

        const deleted = await deleteEvent(session.googleAccessToken, googleEventId);
        const updatedDoc = await eventModel.findOneAndUpdate(
            { userId: session.user._id },
            { $pull: { events: { googleEventId: googleEventId } } },
            { new: true } // return the updated document
        );

        if (!updatedDoc) {
            return new Response(JSON.stringify({ error: "User or event not found" }), {
                status: 404,
            });
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        console.log(error.message, "--------------error in deletion");
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, attendees, ...updatedData } = body;
    console.log(updatedData, '------------updatedData')

    if (!eventId) {
        return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    await connectDB();

    try {
        const result = addISTOffset(updatedData.start.dateTime)
        updatedData.start.dateTime = result
        const result2 = addISTOffset(updatedData.end.dateTime)
        updatedData.end.dateTime = result2
        const updatedGoogleEvent = await updateEvent(session.googleAccessToken, eventId, updatedData);
        console.log(updatedGoogleEvent, '--------------updatedGoogleEvent')
        const newEvent = {
            googleEventId: updatedGoogleEvent.id,
            summary: updatedGoogleEvent.summary,
            description: updatedGoogleEvent.description,
            location: updatedGoogleEvent.location,
            start: updatedGoogleEvent.start,
            end: updatedGoogleEvent.end,
            attendees: attendees.map((a: any) => ({
                email: a.email,
                responseStatus: a.responseStatus || "needsAction",
            })),
            updatedAt: new Date(),
        };

        const userId = session.user._id;

        // Update the existing event inside the user's `events` array (if using array of events)
        const updatedDoc = await eventModel.findOneAndUpdate(
            { userId, "events.googleEventId": eventId },
            {
                $set: {
                    "events.$": newEvent,
                    updatedAt: new Date(),
                },
            },
            { new: true }
        );

        if (!updatedDoc) {
            await eventModel.findOneAndUpdate(
                { userId },
                {
                    $push: { events: newEvent },
                    $set: { updatedAt: new Date() },
                },
                { new: true }
            );
        }

        return NextResponse.json({ message: "Event updated successfully", data: updatedGoogleEvent }, { status: 200 });

    } catch (error: any) {
        console.error("Update failed:", error);
        return NextResponse.json({ error: error.message || "Failed to update event" }, { status: 500 });
    }
}

