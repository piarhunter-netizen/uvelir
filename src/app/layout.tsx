import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Лучший день — ювелирная мастерская: кольца и бриллианты на заказ",
    template: "%s — Лучший день",
  },
  description:
    "Обручальные и помолвочные кольца на заказ с расчётом цены онлайн. Подбор натуральных и выращенных бриллиантов с сертификатами. Изготовление по эскизу.",
  robots: { index: false, follow: false }, // демо не индексируется
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="demo-bar">Демо-версия для согласования. Цены, камни и тексты условные.</div>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
