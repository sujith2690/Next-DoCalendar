import twilio from 'twilio';
import { NextRequest, NextResponse } from "next/server";

export async function sendSmsToUser(PhoneNumber: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceId = process.env.TWILIO_SERVICE_SID!;

    try {
        const client = twilio(accountSid!, authToken!);
        // Send OTP
        const twilioResponse = await client.verify.v2
            .services(serviceId)
            .verifications.create({
                to: '+91' + PhoneNumber,
                channel: "sms",
            });
        if (twilioResponse.status === "approved") {
            console.log("SMS sent successfully to:", PhoneNumber);
            return
        } else {
            return NextResponse.json({ sent: false }, { status: 500 });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error sending SMS:------", error.message);
        } else {
            console.error("Unknown error:", error);
        }
        throw new Error("Failed to send SMS");

    }

}

export async function verifyUserOtp(otp: string,phone: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceId = process.env.TWILIO_SERVICE_SID!;

    try {
        const client = twilio(accountSid!, authToken!);
        // Verify OTP
        const verificationCheck = await client.verify.v2
            .services(serviceId)
            .verificationChecks.create({
                to: '+91' + phone,
                code: otp,
            });
        if (verificationCheck.status === "approved") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw new Error("Failed to verify OTP");
    }
}