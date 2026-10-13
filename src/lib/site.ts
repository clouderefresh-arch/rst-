export const PHONE_DISPLAY = "+7 (495) 792-23-70";
export const PHONE_HREF = "tel:+74957922370";

export const TELEGRAM_MANAGER_URL = "https://t.me/mb4adn";
export const TELEGRAM_MANAGER_HANDLE = "@mb4adn";

export const SERVICE_ADDRESS =
  "Московская область, городской округ Подольск, посёлок Сосновый Бор, улица Леспромхоза, 10а";

export const WORK_HOURS = "Ежедневно, 09:00–20:00";

const MAP_LON = "37.5607";
const MAP_LAT = "55.3909";

export const MAP_LINK = `https://yandex.ru/maps/?ll=${MAP_LON}%2C${MAP_LAT}&z=17&l=map&pt=${MAP_LON},${MAP_LAT},pm2rdm`;

export const MAP_EMBED = `https://yandex.ru/map-widget/v1/?ll=${MAP_LON}%2C${MAP_LAT}&z=17&l=map&pt=${MAP_LON},${MAP_LAT},pm2rdm`;

export const NAV = [
  { href: "#services", label: "Услуги" },
  { href: "#parts", label: "Запчасти" },
  { href: "#fleet", label: "Автопаркам" },
  { href: "#about", label: "О компании" },
  { href: "#contacts", label: "Контакты" },
] as const;
