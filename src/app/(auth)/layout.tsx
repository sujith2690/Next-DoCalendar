import { Poppins } from "next/font/google";
import "../globals.css";

// components

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-poppins",
});

export const metadata = {
  title: "DoCalendar",
  description: "A modern calendar application for managing your events and schedules.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
    </main>

  );
}
