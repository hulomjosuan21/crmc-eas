import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import Provider from "@/providers";

export const metadata: Metadata = {
  title: "School Event & Attendance System",
  description: "Developer: Josuan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
