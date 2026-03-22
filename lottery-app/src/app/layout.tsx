import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lottery App",
  description: "Lottery registration and payment proof system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}