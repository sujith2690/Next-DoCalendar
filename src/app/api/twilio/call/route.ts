import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

type RequestData = {
    to: string;
    message?: string;
};

type ResponseData = {
    sid?: string;
    error?: string;
    message?: string;
};

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string;
const twilioBinUrl  = process.env.TWILIO_TWIML_BIN_URL as string;

if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error('Twilio credentials are not set in environment variables');
}

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
    try {
        // const { to, message } =await req.json();
console.log('---------------its calling ')
        const to = "+916238444374"
        const message = "Hello my twilio"

        // Validate phone number
        if (!to) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });

        }

        // For dynamic messages, you could gene rate TwiML here
        // For now, we'll use a static TwiML Bin URL
        const call = await client.calls.create({
            url: twilioBinUrl, // Replace with your TwiML Bin URL
            to,
            from: twilioPhoneNumber as string
        });

        return NextResponse.json({
            message: 'Call initiated', sid: call.sid
            // phoneNumber: updatedUser.phone,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error making call:----------------', error.message);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}