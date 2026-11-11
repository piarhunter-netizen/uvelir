"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/catalog/", label: "Каталог" },
  { href: "/diamonds/", label: "Бриллианты" },
  { href: "/custom/", label: "На заказ" },
  { href: "/size/", label: "Размер кольца" },
  { href: "/#contacts", label: "Контакты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-name">Лучший день</span>
          <span className="logo-sub">ювелирная мастерская</span>
        </Link>

        <nav className={`nav ${open ? "is-open" : ""}`} aria-label="Основное меню">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={path?.startsWith(n.href.replace(/\/$/, "")) && n.href !== "/#contacts" ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <span className="nav-phone">+7 (000) 000-00-00</span>
        </nav>

        <div className="header-actions">
          <span className="header-phone">+7 (000) 000-00-00</span>
          <Link href="/custom/#form" className="btn btn-gold btn-sm">Записаться</Link>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
