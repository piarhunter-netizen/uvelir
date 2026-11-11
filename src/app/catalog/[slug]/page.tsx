import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductView from "./ProductView";
import { MODELS, categoryName, getModel } from "@/lib/data";
import { startPrice } from "@/components/ModelCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODELS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getModel(slug);
  if (!m) return {};
  return { title: `${m.name} ${m.article}`, description: m.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();
  const price = startPrice(model);

  // Разметка Schema.org для поисковиков: товар с ценой «от»
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.name,
    sku: model.article,
    description: model.description,
    brand: { "@type": "Brand", name: "Лучший день" },
    ...(price
      ? { offers: { "@type": "AggregateOffer", priceCurrency: "RUB", lowPrice: price, availability: "https://schema.org/PreOrder" } }
      : {}),
  };

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span>
        <Link href="/catalog/">Каталог</Link><span>/</span>
        <Link href={`/catalog/?cat=${model.category}`}>{categoryName(model.category)}</Link><span>/</span>
        <span>{model.name}</span>
      </nav>
      <div style={{ height: 20 }} />
      <Suspense fallback={<div className="empty">Загружаем модель…</div>}>
        <ProductView slug={model.slug} />
      </Suspense>
    </div>
  );
}
