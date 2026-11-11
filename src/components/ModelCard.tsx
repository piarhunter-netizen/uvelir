import Link from "next/link";
import RingArt from "./RingArt";
import { COLORS, METALS, type ColorId, type Model } from "@/lib/data";
import { calculate, fmtRub } from "@/lib/calc";

export function startPrice(m: Model) {
  if (!m.calc) return null;
  const r = calculate(m, {
    metal: "585",
    size: 17,
    width: m.width.min,
    thickness: m.thickness.min,
    profile: m.profiles[0],
  });
  return r.total;
}

export default function ModelCard({ model, color }: { model: Model; color?: ColorId }) {
  const price = startPrice(model);
  const c: ColorId = color ?? (model.center ? "white" : model.track ? "white" : "yellow");
  return (
    <Link href={`/catalog/${model.slug}/`} className="card">
      <div className="card-media">
        <RingArt model={model} color={c} />
        {model.calc ? (
          <span className="card-badge">Расчёт онлайн</span>
        ) : (
          <span className="card-badge master">Расчёт мастером</span>
        )}
      </div>
      <div className="card-body">
        <span className="card-art">{model.article} · {model.style}</span>
        <span className="card-title">{model.name}</span>
        <div className="swatches" aria-label="Доступные металлы">
          {(["white", "yellow", "rose", "platinum"] as ColorId[]).map((id) => (
            <span key={id} className="swatch" style={{ background: COLORS[id].hex }} title={COLORS[id].name} />
          ))}
        </div>
        <span className="card-price">
          {price ? (
            <>от {fmtRub(price)} <span>{model.center ? "без центрального камня" : `${METALS["585"].name}${model.pair ? ", за одно кольцо" : ""}`}</span></>
          ) : (
            <span>Цена по эскизу и материалам</span>
          )}
        </span>
      </div>
    </Link>
  );
}
