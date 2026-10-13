import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { PHONE_DISPLAY } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ООО «РТК» — сервисные решения и поставка запчастей",
  description:
    "Комплексный ремонт и сервис грузовых, коммерческих легковых автомобилей и спецтехники. Запчасти европейских и азиатских марок со склада. Подольск.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ООО «РТК» — сервисные решения и поставка запчастей",
    description:
      "Сервис коммерческого транспорта и спецтехники, поставка запчастей. Подольск, доставка по России.",
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
    streetAddress: "ул. Леспромхоза, 10а",
    addressLocality: "посёлок Сосновый Бор",
    addressRegion: "Московская область",
    addressCountry: "RU",
  },
  areaServed: ["Подольск", "Россия"],
  openingHours: "Mo-Su 09:00-20:00",
  description:
    "Сервисное обслуживание грузового и коммерческого транспорта, спецтехники. Подбор и поставка запчастей европейских и азиатских марок.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${manrope.className} min-h-screen overflow-x-clip antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
