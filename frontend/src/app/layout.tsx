import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusGuard — Smart Security for a Safer Campus",
  description: "Unifying shift management, hardware-free parking validation, and real-time incident escalation into a single institutional command system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
