import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talk To Me!",
  description: "Converse em tempo real com pessoas de todo o mundo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${rubik.className} bg-black text-white`}>{children}</body>
    </html>
  );
}
