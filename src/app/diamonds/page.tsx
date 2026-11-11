import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import DiamondPicker from "./DiamondPicker";

export const metadata: Metadata = {
  title: "Подбор бриллиантов: натуральные и выращенные",
  description: "Бриллианты с сертификатами GIA и IGI: фильтр по форме, массе, цвету, чистоте и цене. Заказ отдельно или в кольцо.",
};

export default function DiamondsPage() {
  return (
    <div className="container">
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span><span>Бриллианты</span>
      </nav>
      <div className="page-head">
        <span className="eyebrow">Бриллианты под заказ</span>
        <h1 className="display h2">Подбор бриллианта</h1>
        <p className="lead">Камни из стока поставщиков с сертификатами. Наличие и цена обновляются автоматически, бронь подтверждает менеджер.</p>
      </div>
      <Suspense fallback={<div className="empty">Загружаем камни…</div>}>
        <DiamondPicker />
      </Suspense>
    </div>
  );
}
