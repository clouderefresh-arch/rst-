import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PHONE_DISPLAY } from "@/lib/site";
import "./globals.css";

// ST-Stengazeta Regular, Alexander Shimanov. Free license (desktop + webfont):
// https://shimanov.pro/st-stengazeta
const stengazeta = localFont({
  src: "../fonts/ST-Stengazeta.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: "ООО «РТК» — сервисные решения для автотранспорта",
  description:
    "Комплексный ремонт легковых и грузовых автомобилей, спецтехники. Поставки запчастей оптом и в розницу. Подольск, Климовск, доставка по всей РФ.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ООО «РТК» — сервисные решения для автотранспорта",
    description:
      "Ремонт, обслуживание и поставка запчастей. г. Подольск, г. Климовск, доставка по всей России.",
    locale: "ru_RU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "ООО «РТК»",
  telephone: PHONE_DISPLAY,
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Леспромхоза, 10",
    addressLocality: "посёлок Сосновый Бор",
    addressRegion: "Московская область",
    addressCountry: "RU",
  },
  areaServed: ["Подольск", "Климовск", "Россия"],
  openingHours: "Mo-Su 08:00-21:00",
  description:
    "Сервисное обслуживание и ремонт легкового, грузового транспорта и спецтехники. Оптово-розничные поставки запчастей.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${stengazeta.className} min-h-screen overflow-x-clip antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
