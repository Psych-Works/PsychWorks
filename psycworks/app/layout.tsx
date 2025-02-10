import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Psycworks",
  description: "Psycworks | Psychology Assessment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
