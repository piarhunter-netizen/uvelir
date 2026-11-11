"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ModelCard, { startPrice } from "@/components/ModelCard";
import { CATEGORIES, MODELS, STYLES, type CategoryId } from "@/lib/data";

type Sort = "default" | "price-asc" | "price-desc";

export default function CatalogView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const cat = (params.get("cat") as CategoryId | null) ?? null;
  const style = params.get("style");
  const [q, setQ] = useState("");
  const [onlyCalc, setOnlyCalc] = useState(false);
  const [sort, setSort] = useState<Sort>("default");

  // Фильтры живут в адресе, поэтому ссылку на подборку можно отправить
  function setParam(key: string, value: string | null) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    if (key === "cat") p.delete("style");
    const s = p.toString();
    router.replace(s ? `${path}?${s}` : path, { scroll: false });
  }

  const inCat = MODELS.filter((m) => !cat || m.category === cat);
  const stylesHere = STYLES.filter((s) => inCat.some((m) => m.style === s));

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const res = MODELS.filter(
      (m) =>
        (!cat || m.category === cat) &&
        (!style || m.style === style) &&
        (!onlyCalc || m.calc) &&
        (!needle || `${m.name} ${m.article} ${m.style} ${m.description}`.toLowerCase().includes(needle)),
    );
    if (sort !== "default") {
      const val = (m: (typeof MODELS)[number]) => startPrice(m) ?? (sort === "price-asc" ? Infinity : -Infinity);
      res.sort((a, b) => (sort === "price-asc" ? val(a) - val(b) : val(b) - val(a)));
    }
    return res;
  }, [cat, style, onlyCalc, q, sort]);

  return (
    <div className="catalog-layout">
      <div className="filter-row">
        <span className="filter-label">Категория</span>
        <div className="chips">
          <button type="button" className={`chip ${!cat ? "is-on" : ""}`} onClick={() => setParam("cat", null)}>
            Все <span className="count">{MODELS.length}</span>
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className={`chip ${cat === c.id ? "is-on" : ""}`} onClick={() => setParam("cat", c.id)}>
              {c.name} <span className="count">{MODELS.filter((m) => m.category === c.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      {stylesHere.length > 1 && (
        <div className="filter-row">
          <span className="filter-label">Стиль</span>
          <div className="chips">
            <button type="button" className={`chip ${!style ? "is-on" : ""}`} onClick={() => setParam("style", null)}>Любой</button>
            {stylesHere.map((s) => (
              <button key={s} type="button" className={`chip ${style === s ? "is-on" : ""}`} onClick={() => setParam("style", s)}>{s}</button>
            ))}
          </div>
        </div>
      )}

      <div className="toolbar">
        <input
          className="search"
          type="search"
          id="catalog-search"
          placeholder="Поиск по названию или артикулу"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Поиск по каталогу"
        />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label className="check" htmlFor="only-calc" style={{ alignItems: "center" }}>
            <input id="only-calc" type="checkbox" checked={onlyCalc} onChange={(e) => setOnlyCalc(e.target.checked)} style={{ marginTop: 0 }} />
            <span>Только с расчётом онлайн</span>
          </label>
          <select className="select" id="catalog-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Сортировка">
            <option value="default">По умолчанию</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
          </select>
        </div>
      </div>

      {list.length ? (
        <div className="card-grid">
          {list.map((m) => <ModelCard key={m.slug} model={m} />)}
        </div>
      ) : (
        <div className="empty">
          <p>По этим условиям моделей нет. Мастер сделает изделие по вашему эскизу.</p>
          <button type="button" className="btn btn-ghost" onClick={() => { setQ(""); setOnlyCalc(false); setParam("cat", null); }}>Сбросить фильтры</button>
        </div>
      )}
    </div>
  );
}
