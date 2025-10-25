import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const lato = localFont({
  src: [
    { path: "../public/fonts/Lato-Regular.ttf", weight: "400" },
    { path: "../public/fonts/Lato-Bold.ttf", weight: "700" },
  ],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "UBC Bionics Admin Portal",
  description: "Administrative tools for the UBC Bionics website",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}