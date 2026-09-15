import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-interface",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "easy / Shapes Studio",
  description: "Professional motion design workspace for motion creators.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
