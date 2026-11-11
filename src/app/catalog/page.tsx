import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import CatalogView from "./CatalogView";

export const metadata: Metadata = {
  title: "Каталог украшений на заказ",
  description: "Обручальные и помолвочные кольца, серьги, подвески и браслеты на заказ. Цена рассчитывается онлайн.",
};

export default function CatalogPage() {
  return (
    <div className="container">
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span><span>Каталог</span>
      </nav>
      <div className="page-head">
        <span className="eyebrow">Каталог</span>
        <h1 className="display h2">Модели для изготовления на заказ</h1>
        <p className="lead">Каждая модель — пример того, что делает мастерская. Металл, размер, ширину и камни вы выбираете сами.</p>
      </div>
      <Suspense fallback={<div className="empty">Загружаем каталог…</div>}>
        <CatalogView />
      </Suspense>
      <div style={{ height: 72 }} />
    </div>
  );
}
