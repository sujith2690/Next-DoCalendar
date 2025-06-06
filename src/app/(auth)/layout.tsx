import { Poppins } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import AuthPageLayout from "../(ui)/components/LoginBg";

// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <SessionProvider>
        <AuthPageLayout>
          {children}
          <ToastContainer />
        </AuthPageLayout>
      </SessionProvider>
    </main>

  );
}
