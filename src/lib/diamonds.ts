// Демо-сток бриллиантов. В рабочей версии загружается из файла или API поставщика.

export type Origin = "natural" | "lab";
export type ShapeId = "round" | "oval" | "princess" | "emerald" | "pear" | "cushion" | "marquise";

export const SHAPES: { id: ShapeId; name: string; ratio: number }[] = [
  { id: "round", name: "Круг", ratio: 1 },
  { id: "oval", name: "Овал", ratio: 1.38 },
  { id: "princess", name: "Принцесса", ratio: 1 },
  { id: "cushion", name: "Кушон", ratio: 1.06 },
  { id: "emerald", name: "Изумруд", ratio: 1.42 },
  { id: "pear", name: "Груша", ratio: 1.55 },
  { id: "marquise", name: "Маркиз", ratio: 2 },
];

export const COLORS_GIA = ["D", "E", "F", "G", "H", "I", "J", "K"] as const;
export const CLARITIES = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"] as const;
export const GRADES = ["Excellent", "Very Good", "Good"] as const;
export const FLUOR = ["None", "Faint", "Medium"] as const;

export type Diamond = {
  id: string;
  origin: Origin;
  shape: ShapeId;
  carat: number;
  color: (typeof COLORS_GIA)[number];
  clarity: (typeof CLARITIES)[number];
  cut: (typeof GRADES)[number] | null;
  polish: (typeof GRADES)[number];
  symmetry: (typeof GRADES)[number];
  fluorescence: (typeof FLUOR)[number];
  lab: "GIA" | "IGI" | "HRD";
  certNo: string;
  lengthMm: number;
  widthMm: number;
  depthMm: number;
  depthPct: number;
  tablePct: number;
  pricePerCt: number;
  price: number;
  available: boolean;
  deliveryDays: string;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Условная цена за карат натурального камня цвета H, чистоты VS2, по массе
const BASE: [number, number][] = [
  [0.3, 160000], [0.5, 250000], [0.7, 330000], [1.0, 560000], [1.5, 780000], [2.0, 1150000], [3.0, 1900000],
];
function basePerCt(ct: number) {
  for (let i = BASE.length - 1; i >= 0; i--) if (ct >= BASE[i][0]) return BASE[i][1];
  return BASE[0][1];
}
const COLOR_F = { D: 1.45, E: 1.32, F: 1.22, G: 1.1, H: 1, I: 0.88, J: 0.78, K: 0.68 };
const CLAR_F = { IF: 1.45, VVS1: 1.3, VVS2: 1.2, VS1: 1.1, VS2: 1, SI1: 0.86, SI2: 0.74 };
const CUT_F = { Excellent: 1.08, "Very Good": 1, Good: 0.9 };

/** Диаметр круглого бриллианта по массе: ≈ 6,5 мм × ∛карат */
export function roundDiameter(ct: number) {
  return 6.5 * Math.cbrt(ct);
}

function generate(): Diamond[] {
  const rnd = mulberry32(20261111);
  const pick = <T,>(arr: readonly T[], weights?: number[]) => {
    if (!weights) return arr[Math.floor(rnd() * arr.length)];
    const sum = weights.reduce((a, b) => a + b, 0);
    let r = rnd() * sum;
    for (let i = 0; i < arr.length; i++) {
      r -= weights[i];
      if (r <= 0) return arr[i];
    }
    return arr[arr.length - 1];
  };
  const caratSteps = [0.3, 0.31, 0.4, 0.5, 0.52, 0.6, 0.7, 0.72, 0.8, 0.9, 1.0, 1.01, 1.05, 1.2, 1.5, 1.51, 1.7, 2.0, 2.01, 2.5, 3.0];
  const out: Diamond[] = [];

  for (let i = 0; i < 168; i++) {
    const origin: Origin = i % 3 === 2 ? "lab" : "natural";
    const shape = pick(SHAPES, [42, 14, 9, 9, 8, 10, 8]);
    const carat = pick(caratSteps, origin === "lab" ? [1, 1, 2, 3, 2, 2, 3, 2, 3, 3, 5, 3, 3, 4, 5, 3, 3, 4, 3, 3, 2] : [3, 2, 4, 5, 3, 3, 4, 3, 3, 3, 5, 3, 2, 2, 3, 2, 1, 2, 1, 1, 1]);
    const color = origin === "lab" ? pick(COLORS_GIA, [3, 4, 4, 3, 1, 0, 0, 0]) : pick(COLORS_GIA, [1, 2, 3, 4, 4, 3, 2, 1]);
    const clarity = origin === "lab" ? pick(CLARITIES, [1, 3, 4, 4, 3, 1, 0]) : pick(CLARITIES, [0.5, 1, 2, 3, 4, 3, 2]);
    const cut = shape.id === "round" ? pick(GRADES, [6, 3, 1]) : null;
    const polish = pick(GRADES, [6, 3, 1]);
    const symmetry = pick(GRADES, [5, 4, 1]);
    const fluorescence = pick(FLUOR, [6, 3, 1]);
    const lab = origin === "lab" ? "IGI" : pick(["GIA", "GIA", "GIA", "HRD", "IGI"] as const);

    const d = roundDiameter(carat);
    const widthMm = shape.id === "round" ? d : d / Math.sqrt(shape.ratio) * 1.02;
    const lengthMm = shape.id === "round" ? d * 1.005 : widthMm * shape.ratio;
    const depthPct = 59 + rnd() * 4.5;
    const depthMm = widthMm * depthPct / 100;
    const tablePct = 54 + Math.round(rnd() * 8);

    let perCt = basePerCt(carat) * COLOR_F[color] * CLAR_F[clarity] * (cut ? CUT_F[cut] : 0.82);
    if (fluorescence === "Medium") perCt *= 0.93;
    if (origin === "lab") perCt *= 0.11;
    perCt *= 0.94 + rnd() * 0.12;
    perCt = Math.round(perCt / 100) * 100;

    const available = rnd() > 0.12;
    const certNo = lab === "GIA" ? String(2200000000 + Math.floor(rnd() * 99999999)) : lab === "IGI" ? `LG${600000000 + Math.floor(rnd() * 9999999)}` : String(240000000 + Math.floor(rnd() * 999999));

    out.push({
      id: `D-${String(10001 + i)}`,
      origin, shape: shape.id, carat, color, clarity, cut, polish, symmetry, fluorescence, lab, certNo,
      lengthMm: +lengthMm.toFixed(2), widthMm: +widthMm.toFixed(2), depthMm: +depthMm.toFixed(2),
      depthPct: +depthPct.toFixed(1), tablePct,
      pricePerCt: perCt, price: Math.round((perCt * carat) / 100) * 100,
      available, deliveryDays: available ? (origin === "lab" ? "5–7 дней" : "3–10 дней") : "под запрос",
    });
  }
  return out;
}

export const DIAMONDS: Diamond[] = generate();

export function getDiamond(id: string | null | undefined) {
  if (!id) return undefined;
  return DIAMONDS.find((d) => d.id === id);
}

export function shapeName(id: ShapeId) {
  return SHAPES.find((s) => s.id === id)?.name ?? id;
}

export function diamondTitle(d: Diamond) {
  return `${shapeName(d.shape)} ${d.carat.toFixed(2).replace(".", ",")} ct · ${d.color} / ${d.clarity}`;
}
