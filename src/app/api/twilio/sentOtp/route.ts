import { auth } from "@/auth";
import { connectDB } from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { sendSmsToUser } from "../verification";
import userModel from "@/models/userModel";

export async function POST(req: NextRequest) {
    try {

        console.log('its here in phone route POST method');
        const session = await auth();
        const phone = await req.json();
        console.log(phone, '----------------- phone in phone route POST method');
        if (!session || !session.user || !session.user._id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        await connectDB();
        console.log(phone, '----------------- phone in phone route POST method');

        const updatedUser = await userModel.findByIdAndUpdate(
            session.user._id,
            { "phone.value": phone, "phone.isVerified": false },
            { new: true }
        ).select("phone");

        // Send SMS to user after updating phone number
        sendSmsToUser(phone);

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({
            message: "Phone number updated successfully",
            // phoneNumber: updatedUser.phone,
        }, { status: 200 });
    } catch (error: any) {
        console.error("❌ Error in phone route POST method:", error.message || error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}