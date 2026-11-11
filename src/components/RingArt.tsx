import { COLORS, type ColorId, type Model } from "@/lib/data";

type Props = { model: Model; color?: ColorId; className?: string };

// Векторная иллюстрация изделия для карточек каталога (вместо фото в демо)
export default function RingArt({ model, color = "yellow", className }: Props) {
  const c = COLORS[color];
  const id = `${model.slug}-${color}`;
  const defs = (
    <defs>
      <linearGradient id={`m-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={c.deep} />
        <stop offset="0.35" stopColor={c.hex} />
        <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="0.62" stopColor={c.hex} />
        <stop offset="1" stopColor={c.deep} />
      </linearGradient>
      <radialGradient id={`g-${id}`} cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.55" stopColor="#E7EEF5" />
        <stop offset="1" stopColor="#9FB0C2" />
      </radialGradient>
    </defs>
  );
  const metal = `url(#m-${id})`;
  const gem = `url(#g-${id})`;

  if (model.kind === "earrings") {
    return (
      <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
        {defs}
        {[70, 130].map((x) => (
          <g key={x}>
            <circle cx={x} cy="78" r="17" fill={metal} />
            <polygon points={facet(x, 78, 13)} fill={gem} stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.6" />
            <rect x={x - 1.5} y="95" width="3" height="26" rx="1.5" fill={metal} />
          </g>
        ))}
      </svg>
    );
  }
  if (model.kind === "pendant") {
    return (
      <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
        {defs}
        <path d="M30 10 Q100 95 170 10" fill="none" stroke={metal} strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="100" cy="62" r="5" fill="none" stroke={metal} strokeWidth="3" />
        <path d="M100 70 C80 98 78 118 100 132 C122 118 120 98 100 70 Z" fill={gem} stroke={c.deep} strokeWidth="3" />
        <path d="M100 76 L92 110 L100 128 L108 110 Z" fill="#FFFFFF" opacity="0.45" />
      </svg>
    );
  }
  if (model.kind === "bracelet") {
    const n = 26;
    return (
      <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
        {defs}
        <ellipse cx="100" cy="82" rx="78" ry="46" fill="none" stroke={metal} strokeWidth="12" />
        {Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2;
          return <circle key={i} cx={100 + Math.cos(a) * 78} cy={82 + Math.sin(a) * 46} r="4.6" fill={gem} stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.5" />;
        })}
      </svg>
    );
  }

  // Кольцо в лёгкой перспективе
  const cx = 100, cy = 96, rx = 60, ry = 48;
  const band = Math.min(14, 5 + model.width.def * 1.6);
  const stones: { x: number; y: number; r: number }[] = [];
  if (model.track) {
    const t = model.track;
    const total = t.mode === "eternity" ? 22 : t.mode === "half" ? 10 : (t.count ?? 12);
    for (let i = 0; i < total; i++) {
      let a: number;
      if (t.mode === "eternity") a = (i / total) * Math.PI * 2;
      else if (t.mode === "top") a = -Math.PI / 2 + (i - (total - 1) / 2) * 0.11;
      else a = -Math.PI / 2 + (i % 2 === 0 ? 1 : -1) * (0.32 + Math.floor(i / 2) * 0.12);
      stones.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, r: 3.4 });
    }
  }

  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
      {defs}
      <ellipse cx={cx} cy={cy + 4} rx={rx + 2} ry={ry} fill="#000" opacity="0.06" />
      <path
        fillRule="evenodd"
        fill={metal}
        d={`M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 ${-rx * 2},0 Z M${cx - rx + band},${cy} a${rx - band},${ry - band * 0.8} 0 1,0 ${(rx - band) * 2},0 a${rx - band},${ry - band * 0.8} 0 1,0 ${-(rx - band) * 2},0 Z`}
      />
      <ellipse cx={cx} cy={cy} rx={rx - band / 2} ry={ry - band * 0.4} fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1" />
      {model.style === "Ажур" && (
        <ellipse cx={cx} cy={cy} rx={rx - band / 2} ry={ry - band * 0.4} fill="none" stroke={c.deep} strokeWidth={band * 0.5} strokeDasharray="5 4" opacity="0.55" />
      )}
      {model.style === "Геометрия" && (
        <ellipse cx={cx} cy={cy} rx={rx - band / 2} ry={ry - band * 0.4} fill="none" stroke={c.deep} strokeOpacity="0.35" strokeWidth={band * 0.3} />
      )}
      {stones.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={gem} stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.5" />
      ))}
      {model.center && (
        <g>
          {model.halo && Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return <circle key={i} cx={cx + Math.cos(a) * 21} cy={cy - ry - 4 + Math.sin(a) * 13} r="3" fill={gem} stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.4" />;
          })}
          <path d={`M${cx - 10},${cy - ry + 4} L${cx - 16},${cy - ry - 10} M${cx + 10},${cy - ry + 4} L${cx + 16},${cy - ry - 10}`} stroke={metal} strokeWidth="3" />
          <polygon points={facet(cx, cy - ry - 4, model.halo ? 14 : 17)} fill={model.slug.includes("sapfir") ? "#2E4F9E" : gem} stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="0.7" />
          <polygon points={facet(cx, cy - ry - 4, model.halo ? 7 : 8.5)} fill="#FFFFFF" opacity="0.35" />
        </g>
      )}
    </svg>
  );
}

function facet(x: number, y: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    pts.push(`${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r * 0.72).toFixed(1)}`);
  }
  return pts.join(" ");
}
