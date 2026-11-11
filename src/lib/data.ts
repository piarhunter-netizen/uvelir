// Демо-данные каталога. В рабочей версии всё это редактируется в админке.

export type MetalId = "585" | "750" | "pt950";
export type ColorId = "white" | "yellow" | "rose" | "platinum";
export type ProfileId = "flat" | "comfort" | "round";
export type CategoryId =
  | "obruchalnye"
  | "pomolvochnye"
  | "s-kamnyami"
  | "sergi"
  | "podveski"
  | "braslety";

export type Metal = {
  id: MetalId;
  name: string;
  short: string;
  density: number; // г/см³
  tariff: number; // ₽ за грамм, условный
  colors: ColorId[];
};

export const METALS: Record<MetalId, Metal> = {
  "585": { id: "585", name: "Золото 585", short: "585", density: 13.6, tariff: 7900, colors: ["white", "yellow", "rose"] },
  "750": { id: "750", name: "Золото 750", short: "750", density: 15.5, tariff: 10200, colors: ["white", "yellow", "rose"] },
  pt950: { id: "pt950", name: "Платина 950", short: "Pt 950", density: 20.7, tariff: 6900, colors: ["platinum"] },
};

export const COLORS: Record<ColorId, { id: ColorId; name: string; hex: string; deep: string }> = {
  white: { id: "white", name: "Белое", hex: "#E6E6E3", deep: "#9C9EA0" },
  yellow: { id: "yellow", name: "Жёлтое", hex: "#E9C47A", deep: "#A9802F" },
  rose: { id: "rose", name: "Красное", hex: "#E7AE93", deep: "#A86A52" },
  platinum: { id: "platinum", name: "Платина", hex: "#D3D7DA", deep: "#8D9297" },
};

export const PROFILES: Record<ProfileId, { id: ProfileId; name: string; k: number; hint: string }> = {
  flat: { id: "flat", name: "Плоский", k: 1, hint: "прямые грани" },
  comfort: { id: "comfort", name: "Комфорт", k: 0.9, hint: "скруглён изнутри" },
  round: { id: "round", name: "Полукруглый", k: 0.78, hint: "классическая дуга" },
};

export const CATEGORIES: { id: CategoryId; name: string; short: string }[] = [
  { id: "obruchalnye", name: "Обручальные кольца", short: "Обручальные" },
  { id: "pomolvochnye", name: "Помолвочные кольца", short: "Помолвочные" },
  { id: "s-kamnyami", name: "Кольца с камнями", short: "С камнями" },
  { id: "sergi", name: "Серьги", short: "Серьги" },
  { id: "podveski", name: "Подвески", short: "Подвески" },
  { id: "braslety", name: "Браслеты", short: "Браслеты" },
];

// Стилистические подборки названы по признакам дизайна, без чужих брендов
export const STYLES = ["Классика", "Минимализм", "Дорожка", "Геометрия", "Ажур", "Пасьянс", "Ореол", "Винтаж"] as const;
export type Style = (typeof STYLES)[number];

export type Range = { min: number; max: number; step: number; def: number };

export type Track = {
  mode: "top" | "half" | "eternity";
  count?: number; // для "top" и "half"; для "eternity" считается по размеру
  stoneMm: number; // диаметр камня, мм
  carat: number; // масса одного камня
  price: number; // ₽ за камень, условно
};

export type Model = {
  slug: string;
  article: string;
  name: string;
  category: CategoryId;
  style: Style;
  kind: "ring" | "earrings" | "pendant" | "bracelet";
  description: string;
  calc: boolean; // false — цену считает мастер
  profiles: ProfileId[];
  width: Range;
  thickness: Range;
  work: number; // работа мастера, ₽, условно
  track?: Track;
  center?: { defaultCarat: number; head: number }; // центральный камень и оправа (касты), ₽
  halo?: { count: number; stoneMm: number; carat: number; price: number };
  lead: string;
  pair?: boolean;
};

const W = (min: number, max: number, def: number, step = 0.5): Range => ({ min, max, def, step });
const T = (min: number, max: number, def: number, step = 0.1): Range => ({ min, max, def, step });

export const MODELS: Model[] = [
  {
    slug: "klassika-ploskaya", article: "LD-101", name: "Классика плоская", category: "obruchalnye", style: "Классика", kind: "ring",
    description: "Ровная лента с мягко скруглёнными кромками. Самая универсальная форма обручального кольца: подходит к любой помолвочной модели и хорошо принимает гравировку внутри.",
    calc: true, profiles: ["flat", "comfort"], width: W(2, 8, 4), thickness: T(1.4, 2.4, 1.8), work: 9000, lead: "10–14 рабочих дней", pair: true,
  },
  {
    slug: "klassika-komfort", article: "LD-102", name: "Классика комфорт", category: "obruchalnye", style: "Классика", kind: "ring",
    description: "Внутренняя сторона скруглена, поэтому кольцо легко надевается и не давит на палец при широкой шине. Наружная поверхность глянцевая или матовая на выбор.",
    calc: true, profiles: ["comfort", "round"], width: W(3, 7, 5), thickness: T(1.6, 2.4, 2), work: 9500, lead: "10–14 рабочих дней", pair: true,
  },
  {
    slug: "polukrugloe-tonkoe", article: "LD-103", name: "Полукруглое тонкое", category: "obruchalnye", style: "Минимализм", kind: "ring",
    description: "Тонкая полукруглая шина. Носится одна или в паре с помолвочным кольцом. Хороший вариант для небольшой руки.",
    calc: true, profiles: ["round"], width: W(1.5, 3.5, 2.5), thickness: T(1.4, 2.0, 1.6), work: 7500, lead: "7–10 рабочих дней", pair: true,
  },
  {
    slug: "dorozhka-15", article: "LD-104", name: "Дорожка 15 бриллиантов", category: "obruchalnye", style: "Дорожка", kind: "ring",
    description: "Пятнадцать круглых бриллиантов по 1,5 мм в верхней части кольца. Камни закреплены в канале, поэтому не цепляются за одежду.",
    calc: true, profiles: ["comfort", "flat"], width: W(2.5, 4, 3), thickness: T(1.8, 2.4, 2), work: 18000, lead: "14–18 рабочих дней",
    track: { mode: "top", count: 15, stoneMm: 1.5, carat: 0.013, price: 4800 },
  },
  {
    slug: "dorozhka-po-krugu", article: "LD-105", name: "Дорожка по кругу", category: "obruchalnye", style: "Дорожка", kind: "ring",
    description: "Бриллианты идут по всей окружности. Количество камней зависит от размера кольца, поэтому калькулятор пересчитывает их автоматически.",
    calc: true, profiles: ["comfort"], width: W(2, 3, 2.5), thickness: T(1.8, 2.2, 2), work: 26000, lead: "18–21 рабочий день",
    track: { mode: "eternity", stoneMm: 1.8, carat: 0.023, price: 6900 },
  },
  {
    slug: "grani", article: "LD-107", name: "Грани", category: "obruchalnye", style: "Геометрия", kind: "ring",
    description: "Плоская шина с чёткими гранями и сатинированной полосой по центру. Строгая мужская модель, хорошо смотрится в паре с более тонким женским кольцом.",
    calc: true, profiles: ["flat"], width: W(4, 8, 6), thickness: T(1.8, 2.6, 2.2), work: 12000, lead: "10–14 рабочих дней", pair: true,
  },
  {
    slug: "azhurnoe-pletenie", article: "LD-106", name: "Ажурное плетение", category: "obruchalnye", style: "Ажур", kind: "ring",
    description: "Сквозной узор из переплетённых нитей металла. Масса зависит от рисунка, поэтому стоимость рассчитывает мастер по 3D-модели.",
    calc: false, profiles: ["flat"], width: W(4, 8, 6), thickness: T(1.6, 2.2, 1.8), work: 0, lead: "18–25 рабочих дней",
  },
  {
    slug: "pasyans-klassicheskiy", article: "LD-201", name: "Пасьянс классический", category: "pomolvochnye", style: "Пасьянс", kind: "ring",
    description: "Один бриллиант в четырёх крапанах на тонкой шине. Камень подбирается отдельно в каталоге бриллиантов: натуральный или выращенный, с сертификатом.",
    calc: true, profiles: ["round", "comfort"], width: W(1.6, 2.6, 2, 0.1), thickness: T(1.5, 2.0, 1.7), work: 16000, lead: "12–16 рабочих дней",
    center: { defaultCarat: 0.7, head: 9000 },
  },
  {
    slug: "pasyans-s-dorozhkoy", article: "LD-202", name: "Пасьянс с дорожкой", category: "pomolvochnye", style: "Пасьянс", kind: "ring",
    description: "Центральный бриллиант и дорожка мелких камней на плечах кольца. Свет играет и в центре, и по бокам.",
    calc: true, profiles: ["round"], width: W(1.8, 2.4, 2, 0.1), thickness: T(1.6, 2.0, 1.8), work: 22000, lead: "14–18 рабочих дней",
    center: { defaultCarat: 0.7, head: 9000 },
    track: { mode: "half", count: 12, stoneMm: 1.2, carat: 0.007, price: 3200 },
  },
  {
    slug: "oreol", article: "LD-203", name: "Ореол", category: "pomolvochnye", style: "Ореол", kind: "ring",
    description: "Центральный камень окружён венцом из мелких бриллиантов. Визуально камень кажется крупнее на полразмера.",
    calc: true, profiles: ["round"], width: W(1.8, 2.4, 2, 0.1), thickness: T(1.6, 2.0, 1.8), work: 28000, lead: "16–21 рабочий день",
    center: { defaultCarat: 0.5, head: 14000 },
    halo: { count: 16, stoneMm: 1.1, carat: 0.006, price: 2900 },
  },
  {
    slug: "vintazh", article: "LD-204", name: "Винтаж", category: "pomolvochnye", style: "Винтаж", kind: "ring",
    description: "Миллегрифы, гравировка по бокам и высокий ажурный каст. Каждое кольцо рассчитывает мастер после согласования эскиза.",
    calc: false, profiles: ["round"], width: W(2, 3, 2.4, 0.1), thickness: T(1.6, 2.0, 1.8), work: 0, lead: "21–28 рабочих дней",
    center: { defaultCarat: 0.8, head: 0 },
  },
  {
    slug: "koltso-s-sapfirom", article: "LD-301", name: "Кольцо с сапфиром", category: "s-kamnyami", style: "Ореол", kind: "ring",
    description: "Овальный сапфир в окружении бриллиантов. Камень подбирается под заказ по цвету и размеру, поэтому цену называет мастер.",
    calc: false, profiles: ["round"], width: W(2, 3, 2.2, 0.1), thickness: T(1.6, 2.0, 1.8), work: 0, lead: "18–25 рабочих дней",
    center: { defaultCarat: 1, head: 0 },
  },
  {
    slug: "puset-brillianty", article: "LD-401", name: "Пусеты с бриллиантами", category: "sergi", style: "Пасьянс", kind: "earrings",
    description: "Серьги-гвоздики с круглыми бриллиантами в четырёх крапанах. Камни подбираются в пару по цвету и чистоте.",
    calc: false, profiles: ["round"], width: W(1, 2, 1, 1), thickness: T(1, 2, 1), work: 0, lead: "10–14 рабочих дней",
  },
  {
    slug: "podveska-kaplya", article: "LD-501", name: "Подвеска «Капля»", category: "podveski", style: "Минимализм", kind: "pendant",
    description: "Бриллиант огранки «груша» в тонком касте на цепочке. Длину цепи выбираете при заказе.",
    calc: false, profiles: ["round"], width: W(1, 2, 1, 1), thickness: T(1, 2, 1), work: 0, lead: "10–14 рабочих дней",
  },
  {
    slug: "tennisnyy-braslet", article: "LD-601", name: "Теннисный браслет", category: "braslety", style: "Дорожка", kind: "bracelet",
    description: "Гибкая линия одинаковых бриллиантов. Количество и размер камней подбираются под обхват запястья и бюджет.",
    calc: false, profiles: ["round"], width: W(1, 2, 1, 1), thickness: T(1, 2, 1), work: 0, lead: "21–28 рабочих дней",
  },
];

export function getModel(slug: string) {
  return MODELS.find((m) => m.slug === slug);
}

export function categoryName(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? "";
}

// Российский размер кольца = внутренний диаметр в мм
export const RING_SIZES: number[] = Array.from({ length: 21 }, (_, i) => 14 + i * 0.5);
