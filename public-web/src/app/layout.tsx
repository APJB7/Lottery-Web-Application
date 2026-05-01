import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LuckyFlow",
  description: "Lottery registration and verification platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-slate-950 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}