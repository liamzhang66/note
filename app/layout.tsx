import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZhangYuLin",
  description: "nothing...",
  //   viewport: {
  //     width: 'device-width',
  //     initialScale: 1,
  //     maximumScale: 1, // 🔒 禁止用户放大
  //     userScalable: false, // 🔒 禁止缩放
  //     viewportFit: 'cover',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{minWidth: 375}}
      >
        {children}
      </body>
    </html>
  );
}
