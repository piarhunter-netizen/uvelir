"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Ring3DLazy from "@/components/Ring3DLazy";
import RingArt from "@/components/RingArt";
import Modal from "@/components/Modal";
import LeadForm, { type LeadLine } from "@/components/LeadForm";
import { COLORS, METALS, PROFILES, RING_SIZES, getModel, type ColorId, type MetalId, type ProfileId } from "@/lib/data";
import { calculate, fmtNum, fmtRub, trackCount } from "@/lib/calc";
import { diamondTitle, getDiamond } from "@/lib/diamonds";

const fmtMm = (n: number) => `${fmtNum(n, 1)} мм`;

export default function ProductView({ slug }: { slug: string }) {
  const model = getModel(slug)!;
  const params = useSearchParams();
  const stone = getDiamond(params.get("stone"));

  const [metal, setMetal] = useState<MetalId>("585");
  const [color, setColor] = useState<ColorId>(model.center || model.track ? "white" : "yellow");
  const [size, setSize] = useState(17);
  const [width, setWidth] = useState(model.width.def);
  const [thickness, setThickness] = useState(model.thickness.def);
  const [profile, setProfile] = useState<ProfileId>(model.profiles[0]);
  const [dark, setDark] = useState(false);
  const [order, setOrder] = useState(false);

  function pickMetal(id: MetalId) {
    setMetal(id);
    const allowed = METALS[id].colors;
    if (!allowed.includes(color)) setColor(allowed[0]);
  }

  const p = { metal, size, width, thickness, profile };
  const result = useMemo(
    () => calculate(model, { metal, size, width, thickness, profile }, stone?.price ?? 0),
    [model, metal, size, width, thickness, profile, stone],
  );
  const tc = trackCount(model, p);
  const isRing = model.kind === "ring";

  const summary: LeadLine[] = [
    { label: "Модель", value: `${model.name}, ${model.article}` },
    { label: "Металл", value: `${METALS[metal].name}, ${COLORS[color].name.toLowerCase()}` },
    ...(isRing ? [{ label: "Размер", value: fmtNum(size, 1) }] : []),
    ...(model.calc
      ? [
          { label: "Ширина / толщина", value: `${fmtMm(width)} / ${fmtMm(thickness)}` },
          { label: "Профиль", value: PROFILES[profile].name },
          ...(model.track ? [{ label: "Дорожка", value: `${tc} бриллиантов по ${fmtNum(model.track.stoneMm, 1)} мм` }] : []),
          ...(model.center ? [{ label: "Центральный камень", value: stone ? `${diamondTitle(stone)}, ${stone.lab} ${stone.certNo}` : "подобрать с мастером" }] : []),
          { label: "Расчётная масса", value: `${fmtNum(result.mass)} г` },
          { label: "Предварительная цена", value: fmtRub(result.total) },
        ]
      : [{ label: "Расчёт", value: "нужен расчёт мастером" }]),
  ];

  return (
    <div className="product">
      <div className="product-stage">
        <div className={`stage-box ${dark ? "dark" : ""}`}>
          {isRing ? (
            <Ring3DLazy
              className="ring3d"
              color={COLORS[color].hex}
              profile={profile}
              size={size}
              width={width}
              thickness={thickness}
              track={model.track ? { mode: model.track.mode, count: tc, stoneMm: model.track.stoneMm } : null}
              centerCarat={model.center ? stone?.carat ?? model.center.defaultCarat : null}
              halo={model.halo ? { count: model.halo.count, stoneMm: model.halo.stoneMm } : null}
              label={`3D-модель: ${model.name}. Потяните, чтобы повернуть.`}
            />
          ) : (
            <div className="stage-art"><RingArt model={model} color={color} /></div>
          )}
          <div className="stage-toggle" aria-label="Фон">
            <button type="button" aria-label="Светлый фон" aria-pressed={!dark} onClick={() => setDark(false)} style={{ background: "#f3f4f5" }} />
            <button type="button" aria-label="Тёмный фон" aria-pressed={dark} onClick={() => setDark(true)} style={{ background: "#0e1618" }} />
          </div>
          {isRing && <span className="stage-hint">3D-модель меняется вместе с параметрами · потяните, чтобы повернуть</span>}
        </div>
        <p className="muted small">
          В рабочей версии здесь будут предметные фото в нескольких ракурсах с увеличением. 3D-просмотр останется как дополнение.
        </p>
      </div>

      <div className="product-info">
        <div style={{ display: "grid", gap: 10 }}>
          <span className="art">Артикул {model.article} · {model.style}</span>
          <h1 className="display h2">{model.name}</h1>
          <p className="muted">{model.description}</p>
        </div>

        <div className="opt">
          <div className="opt-head"><b>Металл</b><span>{METALS[metal].name}</span></div>
          <div className="seg">
            {(Object.keys(METALS) as MetalId[]).map((id) => (
              <button key={id} type="button" className={metal === id ? "is-on" : ""} aria-pressed={metal === id} onClick={() => pickMetal(id)}>
                {METALS[id].short}
              </button>
            ))}
          </div>
        </div>

        <div className="opt">
          <div className="opt-head"><b>Цвет</b><span>{COLORS[color].name}</span></div>
          <div className="seg">
            {METALS[metal].colors.map((id) => (
              <button key={id} type="button" className={color === id ? "is-on" : ""} aria-pressed={color === id} onClick={() => setColor(id)}>
                <span className="dot" style={{ background: COLORS[id].hex }} />
                {COLORS[id].name}
              </button>
            ))}
          </div>
        </div>

        {isRing && (
          <div className="opt">
            <div className="opt-head">
              <b>Размер</b>
              <Link href="/size/" className="link small">Как узнать размер</Link>
            </div>
            <div className="size-row">
              <select className="select" id="ring-size" value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label="Размер кольца">
                {RING_SIZES.map((s) => <option key={s} value={s}>{fmtNum(s, 1)}</option>)}
              </select>
              <span className="muted small">внутренний диаметр {fmtMm(size)}</span>
            </div>
          </div>
        )}

        {model.calc && (
          <>
            {model.profiles.length > 1 && (
              <div className="opt">
                <div className="opt-head"><b>Профиль</b><span>{PROFILES[profile].hint}</span></div>
                <div className="seg">
                  {model.profiles.map((id) => (
                    <button key={id} type="button" className={profile === id ? "is-on" : ""} aria-pressed={profile === id} onClick={() => setProfile(id)}>
                      {PROFILES[id].name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="opt">
              <div className="opt-head"><b>Ширина</b><span>{fmtMm(model.width.min)} – {fmtMm(model.width.max)}</span></div>
              <div className="range">
                <input
                  id="ring-width"
                  type="range"
                  min={model.width.min}
                  max={model.width.max}
                  step={model.width.step}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  aria-label="Ширина кольца"
                />
                <output htmlFor="ring-width">{fmtMm(width)}</output>
              </div>
            </div>

            <div className="opt">
              <div className="opt-head"><b>Толщина</b><span>{fmtMm(model.thickness.min)} – {fmtMm(model.thickness.max)}</span></div>
              <div className="range">
                <input
                  id="ring-thickness"
                  type="range"
                  min={model.thickness.min}
                  max={model.thickness.max}
                  step={model.thickness.step}
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  aria-label="Толщина кольца"
                />
                <output htmlFor="ring-thickness">{fmtMm(thickness)}</output>
              </div>
            </div>

            {model.track && (
              <div className="opt">
                <div className="opt-head">
                  <b>Камни</b>
                  <span>{tc} × бриллиант {fmtNum(model.track.stoneMm, 1)} мм{model.track.mode === "eternity" ? " · зависит от размера" : ""}</span>
                </div>
              </div>
            )}

            {model.center && (
              <div className={`stone-pick ${stone ? "has" : ""}`}>
                {stone ? (
                  <>
                    <div className="row">
                      <b>{diamondTitle(stone)}</b>
                      <span className={`tag ${stone.origin === "lab" ? "lab" : "nat"}`}>{stone.origin === "lab" ? "выращенный" : "натуральный"}</span>
                    </div>
                    <div className="row small">
                      <span className="muted">{stone.lab} № {stone.certNo} · {stone.id}</span>
                      <b>{fmtRub(stone.price)}</b>
                    </div>
                    <div><Link className="link small" href={`/diamonds/?ring=${model.slug}`}>Выбрать другой камень</Link></div>
                  </>
                ) : (
                  <>
                    <div className="row">
                      <b>Центральный бриллиант</b>
                      <span className="muted small">не выбран</span>
                    </div>
                    <p className="muted small">Цена ниже указана без центрального камня. Подберите камень, и он добавится в расчёт и в 3D-модель.</p>
                    <div><Link className="btn btn-ink btn-sm" href={`/diamonds/?ring=${model.slug}`}>Подобрать бриллиант</Link></div>
                  </>
                )}
              </div>
            )}

            <div className="price-box" aria-live="polite">
              <div className="price-top">
                <div>
                  <div className="m">Предварительная цена{model.pair ? " за одно кольцо" : ""}</div>
                  <div className="p num">{fmtRub(result.total)}</div>
                </div>
                <div className="m">Расчётная масса <b className="num">{fmtNum(result.mass)} г</b></div>
              </div>
              <div className="breakdown">
                {result.lines.map((l) => (
                  <div key={l.label}><span>{l.label}</span><span>{fmtRub(l.value)}</span></div>
                ))}
              </div>
              <div className="price-actions">
                <button type="button" className="btn btn-gold" onClick={() => setOrder(true)}>Заказать изготовление</button>
                <Link href="/custom/#form" className="btn btn-light">Изменить дизайн</Link>
              </div>
              <p className="note">Тарифы в демо условные. Точную цену мастер подтверждает после согласования. Масса может отличаться на 5–10% после обработки.</p>
            </div>
          </>
        )}

        {!model.calc && (
          <div className="price-box">
            <div className="price-top">
              <div>
                <div className="m">Стоимость</div>
                <div className="p" style={{ fontSize: "1.9rem" }}>Рассчитает мастер</div>
              </div>
            </div>
            <p className="m">Это сложное изделие: масса зависит от рисунка и камней. Мастер посчитает цену по 3D-модели в течение дня, без выдуманных цифр.</p>
            <div className="price-actions">
              <button type="button" className="btn btn-gold" onClick={() => setOrder(true)}>Запросить расчёт</button>
            </div>
          </div>
        )}

        <div className="terms">
          <div><span>Срок изготовления</span><span>{model.lead}</span></div>
          <div><span>Предоплата</span><span>50% после согласования</span></div>
          <div><span>В комплекте</span><span>паспорт изделия, футляр, сертификаты камней</span></div>
          <div><span>Гарантия</span><span>на работу мастера и закрепку камней</span></div>
        </div>
      </div>

      {order && (
        <Modal title="Заявка на изготовление" onClose={() => setOrder(false)}>
          <LeadForm
            title={model.calc ? "Заказать изготовление" : "Запросить расчёт"}
            summary={summary}
            onDone={() => setOrder(false)}
          />
        </Modal>
      )}
    </div>
  );
}
