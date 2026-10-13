export const PHONE_DISPLAY = "+7 (495) 792-23-70";
export const PHONE_HREF = "tel:+74957922370";

export const TELEGRAM_MANAGER_URL = "https://t.me/mb4adn";
export const TELEGRAM_MANAGER_HANDLE = "@mb4adn";

export const SERVICE_ADDRESS =
  "Московская область, городской округ Подольск, посёлок Сосновый Бор, улица Леспромхоза, 10а";

export const WORK_HOURS = "Ежедневно, 09:00–20:00";

const MAP_LON = "37.556016";
const MAP_LAT = "55.389472";

export const MAP_LINK =
  "https://yandex.ru/maps/1/moscow-and-moscow-oblast/house/ulitsa_lespromkhoza_10a/Z04YcwJlSEUDQFtvfX95eHpnYw==/?ll=37.556016%2C55.389472&z=17";

export const MAP_EMBED = `https://yandex.ru/map-widget/v1/?ll=${MAP_LON}%2C${MAP_LAT}&z=17&l=map&pt=${MAP_LON},${MAP_LAT},pm2rdm`;

export const NAV = [
  { href: "#services", label: "Услуги" },
  { href: "#parts", label: "Запчасти" },
  { href: "#fleet", label: "Автопаркам" },
  { href: "#about", label: "О компании" },
  { href: "#contacts", label: "Контакты" },
] as const;
