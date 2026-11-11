import type { Metadata } from "next";
import Link from "next/link";
import SizeTool from "./SizeTool";

export const metadata: Metadata = {
  title: "Как узнать размер кольца",
  description: "Определите размер кольца по обхвату пальца или диаметру своего кольца. Таблица российских размеров.",
};

export default function SizePage() {
  return (
    <div className="container">
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span><span>Размер кольца</span>
      </nav>
      <div className="page-head">
        <span className="eyebrow">Покупателям</span>
        <h1 className="display h2">Как узнать размер кольца</h1>
        <p className="lead">Российский размер — это внутренний диаметр кольца в миллиметрах. Измерьте палец ниткой или своё кольцо линейкой.</p>
      </div>
      <SizeTool />
    </div>
  );
}
