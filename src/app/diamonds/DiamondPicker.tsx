"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ShapeIcon from "@/components/ShapeIcon";
import Modal from "@/components/Modal";
import LeadForm from "@/components/LeadForm";
import { MODELS, getModel } from "@/lib/data";
import { fmtNum, fmtRub } from "@/lib/calc";
import {
  CLARITIES, COLORS_GIA, DIAMONDS, SHAPES, diamondTitle, shapeName,
  type Diamond, type Origin, type ShapeId,
} from "@/lib/diamonds";

type Sort = "price-asc" | "price-desc" | "carat-desc" | "carat-asc";
type Action = "price" | "stock" | "order";
const PAGE = 24;

function Scale<T extends string>({ items, range, onChange, label }: { items: readonly T[]; range: [number, number]; onChange: (r: [number, number]) => void; label: string }) {
  const [from, to] = range;
  function click(i: number) {
    if (i < from || i - from <= to - i) onChange([i, Math.max(i, to)]);
    else onChange([from, i]);
  }
  return (
    <div className="scale" role="group" aria-label={label}>
      {items.map((it, i) => (
        <button key={it} type="button" className={i >= from && i <= to ? "in" : ""} onClick={() => click(i)} aria-pressed={i >= from && i <= to}>
          {it}
        </button>
      ))}
    </div>
  );
}

export default function DiamondPicker() {
  const params = useSearchParams();
  const ringSlug = params.get("ring");
  const ring = ringSlug ? getModel(ringSlug) : undefined;
  const initialOrigin = (params.get("origin") as Origin | null) ?? "natural";

  const [origin, setOrigin] = useState<Origin>(initialOrigin === "lab" ? "lab" : "natural");
  const [shapes, setShapes] = useState<ShapeId[]>(ring ? ["round"] : []);
  const [ctMin, setCtMin] = useState("");
  const [ctMax, setCtMax] = useState("");
  const [color, setColor] = useState<[number, number]>([0, COLORS_GIA.length - 1]);
  const [clarity, setClarity] = useState<[number, number]>([0, CLARITIES.length - 1]);
  const [priceMax, setPriceMax] = useState("");
  const [certs, setCerts] = useState<string[]>([]);
  const [onlyStock, setOnlyStock] = useState(false);
  const [sort, setSort] = useState<Sort>("price-asc");
  const [shown, setShown] = useState(PAGE);
  const [sel, setSel] = useState<Diamond | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    const min = parseFloat(ctMin.replace(",", ".")) || 0;
    const max = parseFloat(ctMax.replace(",", ".")) || Infinity;
    const pmax = parseFloat(priceMax.replace(/\s/g, "")) || Infinity;
    const res = DIAMONDS.filter((d) => {
      const ci = COLORS_GIA.indexOf(d.color);
      const qi = CLARITIES.indexOf(d.clarity);
      return (
        d.origin === origin &&
        (!shapes.length || shapes.includes(d.shape)) &&
        d.carat >= min && d.carat <= max &&
        ci >= color[0] && ci <= color[1] &&
        qi >= clarity[0] && qi <= clarity[1] &&
        d.price <= pmax &&
        (!certs.length || certs.includes(d.lab)) &&
        (!onlyStock || d.available)
      );
    });
    const by: Record<Sort, (a: Diamond, b: Diamond) => number> = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "carat-desc": (a, b) => b.carat - a.carat,
      "carat-asc": (a, b) => a.carat - b.carat,
    };
    return res.sort(by[sort]);
  }, [origin, shapes, ctMin, ctMax, color, clarity, priceMax, certs, onlyStock, sort]);

  function reset() {
    setShapes([]); setCtMin(""); setCtMax(""); setPriceMax(""); setCerts([]); setOnlyStock(false);
    setColor([0, COLORS_GIA.length - 1]); setClarity([0, CLARITIES.length - 1]); setShown(PAGE);
  }
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const centerModels = MODELS.filter((m) => m.center && m.calc);
  const actionTitle: Record<Action, string> = { price: "Запросить стоимость", stock: "Уточнить наличие", order: "Заказать камень" };

  return (
    <>
      {ring && (
        <div className="stone-pick has" style={{ marginBottom: 20 }}>
          <div className="row">
            <span>Подбираете камень для кольца <b>«{ring.name}»</b>. Выберите бриллиант и нажмите «Вставить в кольцо».</span>
            <Link className="link small" href={`/catalog/${ring.slug}/`}>Вернуться к кольцу</Link>
          </div>
        </div>
      )}

      <div className="picker">
        <button type="button" className="btn btn-ghost filters-toggle" onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen}>
          {filtersOpen ? "Скрыть фильтры" : "Фильтры"}
        </button>

        <aside className={`filters ${filtersOpen ? "is-open" : ""}`} aria-label="Фильтры">
          <div className="origin-switch" role="group" aria-label="Происхождение">
            <button type="button" className={origin === "natural" ? "is-on" : ""} aria-pressed={origin === "natural"} onClick={() => { setOrigin("natural"); setShown(PAGE); }}>Натуральные</button>
            <button type="button" className={origin === "lab" ? "is-on" : ""} aria-pressed={origin === "lab"} onClick={() => { setOrigin("lab"); setShown(PAGE); }}>Выращенные</button>
          </div>

          <div className="filter-row">
            <span className="filter-label">Форма</span>
            <div className="shape-grid">
              {SHAPES.map((s) => (
                <button key={s.id} type="button" className={`shape-btn ${shapes.includes(s.id) ? "is-on" : ""}`} aria-pressed={shapes.includes(s.id)} onClick={() => setShapes(toggle(shapes, s.id))}>
                  <ShapeIcon shape={s.id} />{s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-label">Масса, ct</span>
            <div className="pair">
              <input id="ct-min" inputMode="decimal" placeholder="от 0,3" value={ctMin} onChange={(e) => setCtMin(e.target.value)} aria-label="Масса от" />
              <input id="ct-max" inputMode="decimal" placeholder="до 3,0" value={ctMax} onChange={(e) => setCtMax(e.target.value)} aria-label="Масса до" />
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-label">Цвет</span>
            <Scale items={COLORS_GIA} range={color} onChange={setColor} label="Цвет" />
          </div>

          <div className="filter-row">
            <span className="filter-label">Чистота</span>
            <Scale items={CLARITIES} range={clarity} onChange={setClarity} label="Чистота" />
          </div>

          <div className="filter-row">
            <span className="filter-label">Цена до, ₽</span>
            <div className="pair" style={{ gridTemplateColumns: "1fr" }}>
              <input id="price-max" inputMode="numeric" placeholder="без ограничения" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} aria-label="Цена до" />
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-label">Сертификат</span>
            <div className="chips">
              {["GIA", "IGI", "HRD"].map((c) => (
                <button key={c} type="button" className={`chip ${certs.includes(c) ? "is-on" : ""}`} onClick={() => setCerts(toggle(certs, c))}>{c}</button>
              ))}
            </div>
          </div>

          <label className="check" htmlFor="only-stock">
            <input id="only-stock" type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} />
            <span>Только в наличии у поставщика</span>
          </label>

          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>Сбросить фильтры</button>
        </aside>

        <div style={{ minWidth: 0 }}>
          <div className="results-head">
            <div><b className="num">{list.length}</b> <span className="muted">{origin === "lab" ? "выращенных" : "натуральных"} камней</span></div>
            <select className="select" id="d-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Сортировка">
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="carat-desc">Сначала крупнее</option>
              <option value="carat-asc">Сначала мельче</option>
            </select>
          </div>

          {list.length === 0 ? (
            <div className="empty">
              <p>Таких камней сейчас нет в стоке. Оставьте заявку, и мы найдём камень у других поставщиков.</p>
              <button type="button" className="btn btn-ghost" onClick={reset}>Сбросить фильтры</button>
            </div>
          ) : (
            <>
              <div className="dtable-wrap">
                <table className="dtable">
                  <thead>
                    <tr><th>Форма</th><th>Масса</th><th>Цвет</th><th>Чистота</th><th>Огранка</th><th>Серт.</th><th>Наличие</th><th style={{ textAlign: "right" }}>Цена</th></tr>
                  </thead>
                  <tbody>
                    {list.slice(0, shown).map((d) => (
                      <tr key={d.id} className={sel?.id === d.id ? "is-sel" : ""} onClick={() => setSel(d)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSel(d)}>
                        <td><span className="shape-cell"><ShapeIcon shape={d.shape} />{shapeName(d.shape)}</span></td>
                        <td>{fmtNum(d.carat)} ct</td>
                        <td>{d.color}</td>
                        <td>{d.clarity}</td>
                        <td>{d.cut ?? "—"}</td>
                        <td>{d.lab}</td>
                        <td>{d.available ? <span className="tag ok">{d.deliveryDays}</span> : <span className="tag wait">под запрос</span>}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>{fmtRub(d.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="dcards">
                {list.slice(0, shown).map((d) => (
                  <button key={d.id} type="button" className="dcard" onClick={() => setSel(d)}>
                    <ShapeIcon shape={d.shape} />
                    <span>
                      <b>{shapeName(d.shape)} {fmtNum(d.carat)} ct</b>
                      <span className="sub">{d.color} / {d.clarity} · {d.lab} · {d.available ? d.deliveryDays : "под запрос"}</span>
                    </span>
                    <span className="pr">{fmtRub(d.price)}</span>
                  </button>
                ))}
              </div>
              {shown < list.length && (
                <div className="more">
                  <button type="button" className="btn btn-ghost" onClick={() => setShown((n) => n + PAGE)}>Показать ещё {Math.min(PAGE, list.length - shown)}</button>
                </div>
              )}
            </>
          )}
          <p className="muted small" style={{ marginTop: 16 }}>
            Демо-сток: камни и цены сгенерированы для примера. В рабочей версии сток загружается из файла или API поставщика без дублей, с номерами сертификатов.
          </p>
        </div>
      </div>

      {sel && !action && (
        <Modal title={diamondTitle(sel)} onClose={() => setSel(null)}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ width: 56, height: 56, color: "var(--gold)", flex: "none" }}><ShapeIcon shape={sel.shape} /></span>
            <div style={{ display: "grid", gap: 4 }}>
              <h2 className="display h3">{diamondTitle(sel)}</h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className={`tag ${sel.origin === "lab" ? "lab" : "nat"}`}>{sel.origin === "lab" ? "выращенный" : "натуральный"}</span>
                {sel.available ? <span className="tag ok">у поставщика · {sel.deliveryDays}</span> : <span className="tag wait">наличие под запрос</span>}
              </div>
            </div>
          </div>
          <div className="dgrid">
            {[
              ["ID", sel.id],
              ["Форма", shapeName(sel.shape)],
              ["Масса", `${fmtNum(sel.carat)} ct`],
              ["Размеры", `${fmtNum(sel.lengthMm)} × ${fmtNum(sel.widthMm)} × ${fmtNum(sel.depthMm)} мм`],
              ["Цвет", sel.color],
              ["Чистота", sel.clarity],
              ["Огранка", sel.cut ?? "—"],
              ["Полировка", sel.polish],
              ["Симметрия", sel.symmetry],
              ["Флуоресценция", sel.fluorescence],
              ["Глубина / площадка", `${fmtNum(sel.depthPct, 1)}% / ${sel.tablePct}%`],
              ["Сертификат", `${sel.lab} № ${sel.certNo}`],
              ["Цена за карат", fmtRub(sel.pricePerCt)],
              ["Цена камня", fmtRub(sel.price)],
            ].map(([a, b]) => (
              <div key={a}><span>{a}</span><span>{b}</span></div>
            ))}
          </div>
          <p className="muted small">Ссылка на проверку сертификата на сайте лаборатории появится с реальным стоком. Бронь камня подтверждает менеджер после ответа поставщика.</p>
          <div style={{ display: "grid", gap: 10 }}>
            {ring ? (
              <Link className="btn btn-gold" href={`/catalog/${ring.slug}/?stone=${sel.id}`}>Вставить в кольцо «{ring.name}»</Link>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                <span className="filter-label">Использовать в кольце</span>
                <div className="chips">
                  {centerModels.map((m) => (
                    <Link key={m.slug} className="chip" href={`/catalog/${m.slug}/?stone=${sel.id}`}>{m.name}</Link>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" className="btn btn-ink btn-sm" onClick={() => setAction("order")}>Заказать камень</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAction("price")}>Запросить стоимость</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAction("stock")}>Уточнить наличие</button>
            </div>
          </div>
        </Modal>
      )}

      {sel && action && (
        <Modal title={actionTitle[action]} onClose={() => setAction(null)}>
          <LeadForm
            title={actionTitle[action]}
            summary={[
              { label: "Запрос", value: actionTitle[action] },
              { label: "Камень", value: `${diamondTitle(sel)}, ${sel.id}` },
              { label: "Сертификат", value: `${sel.lab} № ${sel.certNo}` },
              { label: "Цена в стоке", value: fmtRub(sel.price) },
            ]}
            onDone={() => { setAction(null); setSel(null); }}
          />
        </Modal>
      )}
    </>
  );
}
