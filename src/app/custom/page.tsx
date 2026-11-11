import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Украшения на заказ по эскизу",
  description: "Изготовим кольцо или серьги по фото, рисунку или эскизу. 3D-модель, согласование, литьё, закрепка, паспорт изделия.",
};

const WHAT = [
  { t: "По фотографии", s: "Повторим понравившееся украшение со своими доработками" },
  { t: "По рисунку или эскизу", s: "Превратим набросок в 3D-модель и готовое изделие" },
  { t: "Уникальный дизайн", s: "Придумаем украшение с нуля под историю и бюджет" },
  { t: "Изменение модели", s: "Поменяем ширину, камни, профиль у модели из каталога" },
  { t: "Сложные конструкции", s: "Трансформеры, подвижные элементы, ажур" },
  { t: "Восстановление", s: "Переделаем старое украшение, сохраним камни и металл" },
];

export default function CustomPage() {
  return (
    <div className="container">
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span><span>Индивидуальное изготовление</span>
      </nav>
      <div className="page-head">
        <span className="eyebrow">Индивидуальное изготовление</span>
        <h1 className="display h2">Сделаем украшение по вашей идее</h1>
        <p className="lead">Пришлите фото, рисунок или опишите словами. Мастер ответит в течение рабочего дня, предложит материалы и назовёт ориентир по цене.</p>
      </div>

      <div className="custom-grid" style={{ paddingBottom: 72 }}>
        <div style={{ display: "grid", gap: 28 }}>
          <div className="what">
            {WHAT.map((w) => (
              <div key={w.t}><b>{w.t}</b><span>{w.s}</span></div>
            ))}
          </div>
          <div className="panel">
            <h2 className="display h3">Как это работает</h2>
            <ol className="steps-list">
              <li>Консультация: идея, размер, металл и бюджет.</li>
              <li>Эскиз и подбор камней с сертификатами.</li>
              <li>3D-модель и точный расчёт массы и цены.</li>
              <li>Согласование и предоплата 50%.</li>
              <li>Литьё, закрепка камней, полировка.</li>
              <li>Контроль качества, паспорт изделия, выдача.</li>
            </ol>
          </div>
        </div>
        <div className="panel" id="form" style={{ scrollMarginTop: 110 }}>
          <LeadForm title="Расскажите об идее" withFile withBudget submitLabel="Отправить мастеру" />
        </div>
      </div>
    </div>
  );
}
