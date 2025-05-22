import type { Metadata } from "next";
import { Providers } from "./providers";
import Header from "./components/Header";
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
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
