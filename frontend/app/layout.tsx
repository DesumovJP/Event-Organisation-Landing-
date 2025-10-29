import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from './ThemeRegistry';
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
  title: "Стас Соловей - Професійний ведучий сучасного формату",
  description: "Професійний ведучий Стас Соловей. Організація подій в Україні. Весілля, корпоративи, дні народження. Досвід та якість.",
  icons: {
    icon: [
      { url: 'http://localhost:1337/uploads/ptashka_459e72d6e9.png', type: 'image/png', sizes: '32x32' },
      { url: 'http://localhost:1337/uploads/ptashka_459e72d6e9.png', type: 'image/png', sizes: '192x192' },
      { url: 'http://localhost:1337/uploads/ptashka_459e72d6e9.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: [
      { url: 'http://localhost:1337/uploads/ptashka_459e72d6e9.png', type: 'image/png' },
    ],
    apple: [
      { url: 'http://localhost:1337/uploads/ptashka_459e72d6e9.png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="http://localhost:1337/uploads/ptashka_459e72d6e9.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="http://localhost:1337/uploads/ptashka_459e72d6e9.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="http://localhost:1337/uploads/ptashka_459e72d6e9.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
