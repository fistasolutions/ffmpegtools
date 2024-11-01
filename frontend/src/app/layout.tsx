import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/src/components/sidebar/page";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-screen overflow-y-scroll flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex flex-col items-center justify-center w-full p-8 gap-8 bg-gradient-to-br from-purple-500 to-blue-500">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}