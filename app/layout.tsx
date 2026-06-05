import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Summer Planner",
  description: "Kids activity planner — June 22 to July 20",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
