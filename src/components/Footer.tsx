import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="logo-name">Лучший день</span>
          <p>Ювелирная мастерская. Изготавливаем украшения на заказ и подбираем бриллианты с сертификатами.</p>
        </div>
        <div>
          <h3>Каталог</h3>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.id}><Link href={`/catalog/?cat=${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Сервис</h3>
          <ul>
            <li><Link href="/diamonds/">Подбор бриллиантов</Link></li>
            <li><Link href="/custom/">Изготовление по эскизу</Link></li>
            <li><Link href="/size/">Как узнать размер</Link></li>
            <li><Link href="/#service">Гарантия и уход</Link></li>
          </ul>
        </div>
        <div>
          <h3>Салон</h3>
          <ul className="plain">
            <li>Адрес салона</li>
            <li>+7 (000) 000-00-00</li>
            <li>Ежедневно 10:00–20:00, по записи</li>
          </ul>
        </div>
      </div>
      <div className="container footer-legal">
        <span>© Лучший день. Демо-версия.</span>
        <span>Политика обработки персональных данных · Оферта</span>
      </div>
    </footer>
  );
}
