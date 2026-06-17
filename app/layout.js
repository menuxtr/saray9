import { Outfit, Cinzel } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });
const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: "--font-cinzel"
});

export const metadata = {
  title: "MenuX - Premium QR Menü Deneyimi",
  description: "İşletmeniz için modern, hızlı ve şık dijital QR menü kartı.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${outfit.className} ${cinzel.variable} bg-neutral-50 min-h-screen text-neutral-900`}>{children}</body>
    </html>
  );
}


