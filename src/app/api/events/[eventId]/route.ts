import { auth } from "@/auth";
import eventModel from "@/models/eventModel";
import { updateEvent } from "@/services/calendar";
import { connectDB } from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: {
        eventId: string;
    };
}

export async function GET(req: NextRequest, { params }: Params) {
    const session = await auth();
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const googleEventId = params.eventId
    await connectDB();

    try {
        const event = await eventModel.findOne({
            userId: session.user._id,
            "events.googleEventId": googleEventId,
        }, {
            "events.$": 1 // only return the matched event in the array
        });
        if (!event || !event.events || event.events.length === 0) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }
        return NextResponse.json(event.events[0], { status: 200 });

    } catch (error: any) {
        console.error("Error fetching event by ID:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
