// import { auth } from "@/auth";
// import { connectDB } from "@/utils/dbConfig";
// import { NextRequest, NextResponse } from "next/server";
// import { verifyUserOtp } from "../verification";
// import userModel from "@/models/userModel";

// export async function POST(req: NextRequest) {
//     try {
//         const session = await auth();
//         const { searchParams } = new URL(req.url);
//         // const otp = searchParams.get("otp") as string;
//         const { otp, email } = await req.json();
//         console.log(otp, '----------------- otp in verifyOtp route POST method', email);

//         if (!session || !session.user || !session.user._id) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         if (!otp) {
//             console.log('no OTP provided');
//             return NextResponse.json({ error: "OTP is required" }, { status: 400 });
//         }

//         await connectDB();
//         console.log(session.user._id, '----------------- id user');
//         const userId = '6843501a4969e9f4a79e6db0'
//         // const user = await userModel.findById(userId).select("phone");
//         // const user = await userModel.findById(userId).select("phone.value phone.isVerified");
//         const user = await userModel.findOne({ email }).select("phone");

//         console.log(user, '-------email-------- user');
//         console.log(user.phone, '----------------- user in');
//         if (!user || !user.phone?.value) {
//             console.log(user.phone, 'User or phone not found');
//             return NextResponse.json({ error: "User or phone not found" }, { status: 404 });
//         }
//         console.log('👉 Entered phone route POST method');
//         const isVerified = await verifyUserOtp(otp, user.phone.value);
//         console.log(isVerified, '----------------- isVerified');
//         if (!isVerified) {
//             return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
//         }

//         const updatedUser = await userModel.findByIdAndUpdate(
//             session.user._id,
//             { "phone.isVerified": true },
//             { new: true }
//         ).select("phone");

//         return NextResponse.json(
//             { message: "Phone number verified successfully", phone: updatedUser?.phone },
//             { status: 200 }
//         );
//     } catch (error: any) {
//         console.error("❌ Error in verify OTP:-----------", error.message || error);
//         return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
// }


import { auth } from "@/auth";
import { connectDB } from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { verifyUserOtp } from "../verification";
import userModel from "@/models/userModel";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const { otp, email, phone } = await req.json();

        console.log(otp, '🔐 OTP Received');
        console.log(email, '📧 Email Received');
        console.log(phone, '----------phone Received');
        console.log(session, '----------------- session in');
        if (!session || !session.user || !session.user._id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userData = await userModel.findOne({ email: session.user.email })
        console.log(userData, '-----user Data')

        if (!otp || !email || !phone) {
            console.log('🚫 Missing OTP or Email or Phone');
            return NextResponse.json({ error: "OTP and Email are required" }, { status: 400 });
        }
        await connectDB();

        const isVerified = await verifyUserOtp(otp, phone);
        console.log(isVerified, '----------🔍 OTP Verification Result');
        if (!isVerified) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            session.user._id,
            { "phone.isVerified": true },
            { new: true }
        ).select("phone");

        return NextResponse.json(
            {
                message: "Phone number verified successfully",
                phone: updatedUser?.phone
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("❌ Server Error:", error.message || error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
