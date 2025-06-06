import { Poppins } from "next/font/google";
import "../globals.css";

// components
import Header from "../(ui)/components/Header";
import Footer from "../(ui)/components/Footer";
import { SessionProvider } from "next-auth/react";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-poppins",
});

export const metadata = {
  title: "DoCalendar",
  description: "A modern calendar application for managing your events and schedules.",
};

export default function CalenderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <SessionProvider>
        <Header />
        {children}
        <Footer />
      </SessionProvider>
    </main>

  );
}
