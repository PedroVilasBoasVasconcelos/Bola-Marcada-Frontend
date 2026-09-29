import { Inter, IBM_Plex_Mono, Bebas_Neue, Roboto } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

// Fontes principais
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Novas fontes específicas da Home
const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${plexMono.variable} ${bebas.variable} ${roboto.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
