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
  areaServed: ["Подольск", "Климовск", "Россия"],
  openingHours: "Mo-Su",
  description:
    "Сервисное обслуживание и ремонт легкового, грузового транспорта и спецтехники. Оптово-розничные поставки запчастей.",
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
