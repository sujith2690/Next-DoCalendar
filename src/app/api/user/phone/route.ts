import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/utils/dbConfig";
import userModel from "@/models/userModel";
// import { Twilio } from "twilio";

// GET: Check if user has a phone number
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        console.log(session,'--------------session home page session checking')

        if (!session || !session.user || !session.user._id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const user = await userModel.findById(session.user._id).select("phone");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const phoneValue = user.phone?.value?.trim();

        if (!phoneValue) {
            return NextResponse.json({
                message: "No phone number registered.",
                phoneNumberExists: false,
            }, { status: 200 });
        }

        return NextResponse.json({
            message: "Phone number found.",
            phoneNumber: phoneValue,
            phoneNumberExists: true,
        }, { status: 200 });

    } catch (error: any) {
        console.log('Error in phone route GET method:', error.message);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// // POST: Update/Add phone number
// export async function POST(req: NextRequest) {
//     try {

//         console.log('its here in phone route POST method');
//         const session = await auth();
//         const { phone } = await req.json();

//         if (!session || !session.user || !session.user._id) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         if (!phone || typeof phone !== "string") {
//             return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
//         }

//         await connectDB();
//         console.log(phone, '----------------- phone in phone route POST method');

//         const updatedUser = await userModel.findByIdAndUpdate(
//             session.user._id,
//             { "phone.value": phone },
//             { new: true }
//         ).select("phone");

//         // Send SMS to user after updating phone number
//         sendSmsToUser(phone);





//         // if (!updatedUser) {
//         //     return NextResponse.json({ error: "User not found" }, { status: 404 });
//         // }

//         return NextResponse.json({
//             message: "Phone number updated successfully",
//             // phoneNumber: updatedUser.phone,
//         }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
// }
