import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import twilio from "twilio";
import userModel from "@/models/userModel";
import { connectDB } from "@/utils/dbConfig";

connectDB();

const twilioClient = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

const googleAuth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

googleAuth.setCredentials({
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const calendar = google.calendar({ version: "v3", auth: googleAuth });

        const now = new Date();
        const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);

        const events = await calendar.events.list({
            calendarId: "primary",
            timeMin: now.toISOString(),
            timeMax: inFiveMinutes.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });

        const user = await userModel.findOne().select("phone");

        if (!user || !user.phone?.value) {
            return NextResponse.json({ message: "No user or phone found" });
        }

        const phone = user.phone.value.trim();

        if (events.data.items && events.data.items.length > 0) {
            await twilioClient.calls.create({
                url: process.env.TWILIO_TWIML_BIN_URL!,
                to: phone,
                from: process.env.TWILIO_PHONE_NUMBER!,
            });

            console.log("📞 Call triggered for event:", events.data.items[0].summary);
        }

        return NextResponse.json({ message: "Cron executed" });
    } catch (err: any) {
        console.error("❌ Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
