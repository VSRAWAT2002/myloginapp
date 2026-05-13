import "./globals.css";
import Navbar from "./components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Family Tree",
  description: "Visualize your heritage",
  verification: {
    google: "bTVvQdmomuqc6SClIUvVDkRGv8l5qAZpXz2t9YEkwoU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}