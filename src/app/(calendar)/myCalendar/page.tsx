

// import { auth } from "@/auth";

// export const metadata = {
//     title: "My calender DoCalendar",
// };

export default async function MyCalender() {
    // const session = await auth()
    // console.log(session,'-----------------session')
    // if (!session) return <div>not authorized</div>
    return (
        <section className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-4xl font-bold">My Calendar</h1>
            <p className="mt-4 text-lg">This is your personal calendar page.</p>
        </section>
    );
}