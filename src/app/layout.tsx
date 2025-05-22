import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TSender",
  description: "Token AirDrop Sender",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
