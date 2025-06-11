// import { NextRequest, NextResponse } from "next/server";
// import { google } from "googleapis";
// import twilio from "twilio";
// import userModel from "@/models/userModel";
// import { connectDB } from "@/utils/dbConfig";
// import { auth } from "@/auth";
// import { getGoogleCalendarClient } from "@/lib/google";

// connectDB();

// const twilio_sid = process.env.TWILIO_ACCOUNT_SID
// const twilio_auth_token = process.env.TWILIO_AUTH_TOKEN
// const Twilio_phone_number = process.env.TWILIO_PHONE_NUMBER
// const phone_number = process.env.PHONE_NUMBER
// const cron_secret = process.env.CRON_SECRET


// const twilioClient = twilio(twilio_sid!, twilio_auth_token!);

// const googleAuth = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URI
// );

// googleAuth.setCredentials({
//     access_token: process.env.GOOGLE_ACCESS_TOKEN,
//     refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
// });

// export async function GET(req: NextRequest) {

//     console.log('Its here........... calling')
//     // const authHeader = req.headers.get("authorization");
//     // console.log(authHeader, '-------------authHeader')
//     // if (authHeader !== `Bearer ${cron_secret}`) {
//     //     console.log("Unauthorized for event:------------");
//     //     return new Response("Unauthorized", { status: 401 });
//     // }
//     try {
//         console.log('1,-----------')

//         const session = await auth();

//         if (!session?.googleAccessToken) {
//             return new Response('Unauthorized', { status: 401 });
//         }

//         const calendar = getGoogleCalendarClient(session.googleAccessToken);
//         const now = new Date();
//         const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);
//         const events = await calendar.events.list({
//             calendarId: "primary",
//             timeMin: now.toISOString(),
//             timeMax: inFiveMinutes.toISOString(),
//             singleEvents: true,
//             orderBy: "startTime",
//         });

//         console.log(events.data.items, '--------------events.data')
//         console.log('UTC now:', now.toISOString());
//         console.log('IST now:', now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));


//         if (events.data.items && events.data.items.length > 0) {
//             const call = await twilioClient.calls.create({
//                 twiml: `
//                 <Response>
//                 <Say voice="man">Hai, this is a call From DoCalender You have upcoming event stay alert</Say>
//                 </Response>
//                 `,
//                 method: 'get',
//                 from: Twilio_phone_number as string,
//                 to: phone_number as string,
//             })

//             // console.log("📞 Call triggered for event:", events.data.items[0].summary);
//             console.log("📞 Call triggered for event:------------", call);
//         }

//         return NextResponse.json({ message: "Cron executed" });
//     } catch (err: any) {
//         console.error("❌ Error:-----------", err.message);
//         return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
// }



import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { connectDB } from "@/utils/dbConfig";
import eventModel from "@/models/eventModel";
import userModel from "@/models/userModel";

const twilio_sid = process.env.TWILIO_ACCOUNT_SID!;
const twilio_auth_token = process.env.TWILIO_AUTH_TOKEN!;
const Twilio_phone_number = process.env.TWILIO_PHONE_NUMBER!;
const cron_secret = process.env.CRON_SECRET!;

const twilioClient = twilio(twilio_sid, twilio_auth_token);

connectDB();

export async function GET(req: NextRequest) {
    // Optional security header check
    // const authHeader = req.headers.get("authorization");
    // if (authHeader !== `Bearer ${cron_secret}`) {
    //     return new Response("Unauthorized", { status: 401 });
    // }

    try {
        const now = new Date();
        const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);

        console.log(`🕒 Now: ${now.toISOString()} | +5 min: ${inFiveMinutes.toISOString()}`);

        const allEventDocs = await eventModel.find();

        for (const eventDoc of allEventDocs) {
            const { userId, events } = eventDoc;

            for (const event of events) {
                const startTime = new Date(event.start.dateTime);

                // Compare event start time with now + 5 min (within 1 min threshold for safe match)
                const timeDiff = Math.abs(startTime.getTime() - inFiveMinutes.getTime());
                if (timeDiff < 60 * 1000) {
                    // Fetch user phone
                    const user = await userModel.findById(userId);
                    console.log(user, '-found user***********')
                    console.log(user.phone, ' user****  phone*******')
                    console.log('+91' + user.phone.value, ' user****  phone*******')
                    if (user?.phone?.value) {
                        console.log(`📞 Triggering call for event: ${event.summary} for user: ${user.email}`);

                        const call = await twilioClient.calls.create({
                            twiml: `
                                <Response>
                                    <Say voice="man">
                                        Hello ${user.userName || "there"}, you have an event "${event.summary}" starting in 5 minutes. Please be ready.
                                    </Say>
                                </Response>
                            `,
                            method: 'GET',
                            from: Twilio_phone_number,
                            to: '+91' + user.phone.value,
                        });
                        console.log(`✅ Call sent to ${user.phone.value} | SID: ${call.sid}`);
                    } else {
                        console.warn(`⚠️ User ${user.email} has no verified phone number.`);
                    }
                }
            }
        }

        return NextResponse.json({ message: "✅ Cron job executed for upcoming events." });
    } catch (err: any) {
        console.error("❌ Cron error:", err.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

