import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/utils/dbConfig";
import { auth } from "@/auth";
import { createEvent, updateEvent, deleteEvent, getCalendarClient, listEvents } from '@/services/calendar';
import userModel from "@/models/userModel";
import eventModel from "@/models/eventModel";
import { time } from "console";

export async function GET(req: NextRequest) {
    const session = await auth();
    console.log(session, '----------------- session in addEvent route');

    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await connectDB();
    // const googleEvents = await listEvents(session.googleAccessToken);
    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(now.getDate() + 7);

    const googleEvents = await listEvents(
        session.googleAccessToken,
        now.toISOString(),
        weekLater.toISOString()
    );

    console.log('----------', googleEvents, '--------googleEvent in addEvent route');
    // if (googleEvents.length > 0) {
    //     console.log('First Event:', googleEvents[0]);
    // } else {
    //     console.log('No events found.');
    // }
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    try {
        const events = await eventModel.find({ userId: session.user._id })
        return new Response(JSON.stringify(events), { status: 200 });
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