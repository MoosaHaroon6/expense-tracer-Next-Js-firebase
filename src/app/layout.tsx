import type { Metadata } from "next";
import { Poppins } from 'next/font/google'

import "./globals.css";
import { AuthContextProvider } from "@/context/authContext";

const googlePoppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "300"]
})

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
        className={`${googlePoppins.variable} antialiased `
        }
      >
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}