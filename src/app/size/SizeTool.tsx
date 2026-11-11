"use client";

import { useState } from "react";
import Link from "next/link";
import { RING_SIZES } from "@/lib/data";
import { fmtNum } from "@/lib/calc";

type Mode = "circ" | "diam";

export default function SizeTool() {
  const [mode, setMode] = useState<Mode>("circ");
  const [value, setValue] = useState("55");

  const n = parseFloat(value.replace(",", "."));
  const diameter = !n ? null : mode === "circ" ? n / Math.PI : n;
  const size = diameter ? Math.round(diameter * 2) / 2 : null;
  const inRange = size !== null && size >= RING_SIZES[0] && size <= RING_SIZES[RING_SIZES.length - 1];

  return (
    <div className="size-tool">
      <div className="panel">
        <div className="origin-switch" role="group" aria-label="Способ измерения">
          <button type="button" className={mode === "circ" ? "is-on" : ""} aria-pressed={mode === "circ"} onClick={() => { setMode("circ"); setValue("55"); }}>Обхват пальца</button>
          <button type="button" className={mode === "diam" ? "is-on" : ""} aria-pressed={mode === "diam"} onClick={() => { setMode("diam"); setValue("17,5"); }}>Диаметр кольца</button>
        </div>

        <ol className="steps-list">
          {mode === "circ" ? (
            <>
              <li>Оберните палец ниткой или полоской бумаги у основания.</li>
              <li>Отметьте место, где конец встречается с началом.</li>
              <li>Измерьте длину линейкой в миллиметрах и введите ниже.</li>
            </>
          ) : (
            <>
              <li>Возьмите кольцо, которое хорошо сидит на нужном пальце.</li>
              <li>Приложите линейку к внутренней стороне по самому широкому месту.</li>
              <li>Введите диаметр в миллиметрах.</li>
            </>
          )}
        </ol>

        <label className="field" htmlFor="size-input">
          {mode === "circ" ? "Обхват пальца, мм" : "Внутренний диаметр кольца, мм"}
          <input id="size-input" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>

        <div className="size-result" aria-live="polite">
          {inRange && size ? (
            <>
              <span>Ваш размер</span>
              <b className="num">{fmtNum(size, 1)}</b>
              <span>Диаметр {fmtNum(diameter!, 2)} мм. Если сомневаетесь между двумя размерами, берите больший, особенно для колец шире 5 мм.</span>
            </>
          ) : (
            <>
              <span>Ваш размер</span>
              <b>—</b>
              <span>{mode === "circ" ? "Введите обхват от 44 до 76 мм." : "Введите диаметр от 14 до 24 мм."}</span>
            </>
          )}
        </div>
        <Link href="/catalog/?cat=obruchalnye" className="btn btn-gold">Выбрать кольцо</Link>
      </div>

      <div className="panel">
        <h2 className="display h3">Таблица размеров</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="size-table">
            <thead><tr><th>Размер</th><th>Диаметр, мм</th><th>Обхват, мм</th></tr></thead>
            <tbody>
              {RING_SIZES.map((s) => (
                <tr key={s} className={size === s ? "hit" : ""}>
                  <td>{fmtNum(s, 1)}</td>
                  <td>{fmtNum(s, 1)}</td>
                  <td>{fmtNum(s * Math.PI, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">Палец утром и вечером может отличаться на полразмера. Лучше мерить днём, в тепле.</p>
      </div>
    </div>
  );
}
