import { METALS, PROFILES, type MetalId, type Model, type ProfileId } from "./data";

export type RingParams = {
  metal: MetalId;
  size: number; // внутренний диаметр, мм
  width: number; // мм
  thickness: number; // мм
  profile: ProfileId;
};

export type CalcLine = { label: string; value: number };

export type CalcResult = {
  mass: number; // г
  metalCost: number;
  trackCount: number;
  lines: CalcLine[];
  total: number;
};

/** Сколько камней поместится по всей окружности кольца */
export function eternityCount(size: number, thickness: number, stoneMm: number) {
  const circumference = Math.PI * (size + 2 * thickness);
  return Math.floor(circumference / (stoneMm + 0.2));
}

export function trackCount(model: Model, p: RingParams) {
  if (!model.track) return 0;
  if (model.track.mode === "eternity") return eternityCount(p.size, p.thickness, model.track.stoneMm);
  return model.track.count ?? 0;
}

/** Масса шинки: длина средней окружности × ширина × толщина × коэффициент профиля × плотность */
export function ringMass(p: RingParams) {
  const k = PROFILES[p.profile].k;
  const volumeMm3 = Math.PI * (p.size + p.thickness) * p.width * p.thickness * k;
  return (volumeMm3 * METALS[p.metal].density) / 1000;
}

export function calculate(model: Model, p: RingParams, centerStonePrice = 0): CalcResult {
  const mass = ringMass(p);
  const metal = METALS[p.metal];
  const metalCost = mass * metal.tariff;
  const lines: CalcLine[] = [
    { label: `${metal.name}, ${mass.toFixed(2).replace(".", ",")} г × ${fmtRub(metal.tariff)}`, value: metalCost },
    { label: "Работа мастера", value: model.work },
  ];

  const count = trackCount(model, p);
  if (model.track && count > 0) {
    lines.push({ label: `Бриллианты ${model.track.stoneMm.toString().replace(".", ",")} мм × ${count}`, value: count * model.track.price });
  }
  if (model.halo) {
    lines.push({ label: `Ореол: бриллианты × ${model.halo.count}`, value: model.halo.count * model.halo.price });
  }
  if (model.center) {
    lines.push({ label: "Каст для центрального камня", value: model.center.head });
    if (centerStonePrice > 0) lines.push({ label: "Центральный бриллиант", value: centerStonePrice });
  }

  const raw = lines.reduce((s, l) => s + l.value, 0);
  const total = Math.round(raw / 100) * 100;
  return { mass, metalCost, trackCount: count, lines, total };
}

const rub = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
export function fmtRub(n: number) {
  return `${rub.format(Math.round(n))} ₽`;
}
export function fmtNum(n: number, digits = 2) {
  return n.toFixed(digits).replace(".", ",");
}
