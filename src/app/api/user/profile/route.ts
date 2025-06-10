import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/dbConfig";
import { auth } from "@/auth";
import { createEvent, updateEvent, deleteEvent, getCalendarClient, listEvents } from '@/services/calendar';
import userModel from "@/models/userModel";
import eventModel from "@/models/eventModel";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    try {
        const userProfile = await userModel.findById(session.user._id)
        // const phone = userProfile.phone.value
        const { googleAccessToken, googleRefreshToken, googleTokenExpiry, phone, ...safeProfile } = userProfile._doc
        safeProfile.phone = phone.value
        return new Response(JSON.stringify(safeProfile), { status: 200 });
    } catch (error: any) {
        console.log("error fetching events:-----------", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user || !session.user._id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = session.user._id;

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await connectDB();

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const phoneChanged = user.phone?.value !== body.phone;

        const updatedFields: any = {
            userName: body.userName,
            email: body.email,
            updatedAt: new Date(),
        };

        if (phoneChanged) {
            updatedFields.phone = {
                value: body.phone,
                isVerified: false, // reset verification if phone changed
            };
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true }
        );

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Update failed:", error);
        return NextResponse.json({
            error: error.message || "Failed to update profile"
        }, { status: 500 });
    }
}