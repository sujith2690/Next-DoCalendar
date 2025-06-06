  
  
  import { Poppins } from "next/font/google";
  import "./globals.css";

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

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en" className={poppins.className} suppressHydrationWarning>
        <body className="antialiased h-screen">
          {children}
        </body>
      </html>
    );
  }
