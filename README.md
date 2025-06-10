# DoCalendar 📅

DoCalendar is a powerful Google Calendar scheduling and reminder application built with [Next.js](https://nextjs.org). It allows users to authenticate via Google, manage calendar events (Create, Read, Update, Delete), and get phone call reminders before upcoming events. This application also includes OTP verification using Twilio and stores data securely in MongoDB.

---

## Features

- 🔐 Google Authentication with NextAuth.js
- 📆 Full Google Calendar CRUD integration
- 📤 Twilio OTP phone number verification
- 📞 Voice call reminders before calendar events
- 💾 MongoDB for data persistence (users & events)
- ⚙️ Cron job automation for event-based reminders

---

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install

Then, run the development server:
npm run dev
# or
yarn dev
Open http://localhost:3000 with your browser to see the result.
```
Environment Variables
Create a .env.local file and add the following:


GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

File Structure
app/: Contains your Next.js routes and pages

models/: MongoDB models for user and events

utils/: Utility functions including Twilio & Google API handlers

cron/: Scheduled job logic for sending reminders


Hosting
You can deploy the app using Vercel, which offers seamless integration with Next.js. Note that the cron job automation may require a custom server or external services like cron-job.org.
