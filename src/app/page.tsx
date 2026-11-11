import Link from "next/link";
import Ring3DLazy from "@/components/Ring3DLazy";
import ModelCard from "@/components/ModelCard";
import RingArt from "@/components/RingArt";
import LeadForm from "@/components/LeadForm";
import { COLORS, MODELS, STYLES, getModel, type ColorId } from "@/lib/data";
import { DIAMONDS } from "@/lib/diamonds";

const TILES = [
  { href: "/catalog/?cat=obruchalnye", t: "Обручальные кольца", s: "Классика, дорожки, ажур" },
  { href: "/catalog/?cat=pomolvochnye", t: "Помолвочные кольца", s: "Пасьянс, ореол, винтаж" },
  { href: "/catalog/?cat=sergi", t: "Серьги", s: "Пусеты и подвесные" },
  { href: "/catalog/?cat=podveski", t: "Подвески", s: "С бриллиантами и без" },
  { href: "/catalog/?cat=braslety", t: "Браслеты", s: "Теннисные и цепочные" },
  { href: "/catalog/?cat=s-kamnyami", t: "Кольца с камнями", s: "Сапфиры, изумруды, рубины" },
  { href: "/diamonds/", t: "Бриллианты", s: "Натуральные и выращенные", dark: true },
  { href: "/custom/", t: "Индивидуальное изготовление", s: "По фото, рисунку, эскизу" },
  { href: "/#works", t: "Наши работы", s: "Готовые заказы мастерской" },
];

const PROCESS = [
  { t: "Консультация и бюджет", p: "Обсуждаем идею, размер, металл и сумму, на которую ориентируемся." },
  { t: "Эскиз и камни", p: "Рисуем варианты и подбираем бриллианты с сертификатами под бюджет." },
  { t: "3D-модель", p: "Показываем изделие со всех сторон и считаем точную массу металла." },
  { t: "Согласование", p: "Фиксируем модель, камни, цену и срок в договоре." },
  { t: "Литьё и обработка", p: "Отливаем шинку, опиливаем, собираем касты." },
  { t: "Закрепка и полировка", p: "Закрепляем камни, полируем, наносим гравировку." },
  { t: "Контроль и паспорт", p: "Проверяем каждый камень, выдаём паспорт изделия и сертификаты." },
];

const SERVICE = [
  { t: "Гравировка", p: "Лазерная или ручная, внутри и снаружи кольца. Почерк, даты, отпечатки пальцев." },
  { t: "Гарантия", p: "Бесплатно устраняем дефекты изготовления и подтягиваем крапана." },
  { t: "Паспорт изделия", p: "Металл, проба, масса, камни. Все изделия проходят пробирный контроль." },
  { t: "Упаковка", p: "Футляр из дерева или бархата и подарочная коробка." },
  { t: "Подарочные карты", p: "Номинал на выбор, с уникальным кодом." },
  { t: "Уход", p: "Чистка и полировка украшений нашей мастерской." },
];

export default function Home() {
  const natural = DIAMONDS.filter((d) => d.origin === "natural").length;
  const lab = DIAMONDS.length - natural;
  const featured = ["dorozhka-15", "pasyans-klassicheskiy", "klassika-komfort", "oreol"].map((s) => getModel(s)!);
  const works: { slug: string; color: ColorId; big?: boolean; cap: string }[] = [
    { slug: "oreol", color: "platinum", big: true, cap: "Ореол, платина, 1,2 ct" },
    { slug: "dorozhka-po-krugu", color: "rose", cap: "Дорожка по кругу" },
    { slug: "grani", color: "yellow", cap: "Грани, 750" },
    { slug: "pasyans-s-dorozhkoy", color: "white", cap: "Пасьянс с дорожкой" },
    { slug: "tennisnyy-braslet", color: "white", cap: "Теннисный браслет" },
  ];

  return (
    <>
      {/* Первый экран */}
      <section className="hero velvet">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Ювелирная мастерская · изготовление на заказ</span>
            <h1 className="display h1">Кольцо, которое <em>сделано</em> для вас</h1>
            <p className="lead">
              Выберите модель, металл и размер, и цена посчитается сразу. Бриллиант подберём под ваш бюджет: натуральный или выращенный, с сертификатом.
            </p>
            <div className="hero-actions">
              <Link href="/catalog/?cat=obruchalnye" className="btn btn-gold">Рассчитать кольцо</Link>
              <Link href="/diamonds/" className="btn btn-light">Подобрать бриллиант</Link>
            </div>
            <div className="hero-facts">
              <div><b>585 · 750 · Pt</b><span>золото и платина</span></div>
              <div><b className="num">{DIAMONDS.length}</b><span>бриллиантов у поставщика</span></div>
              <div><b>от 7 дней</b><span>изготовление</span></div>
            </div>
          </div>
          <div className="hero-stage">
            <Ring3DLazy
              className="ring3d"
              color={COLORS.white.hex}
              profile="round"
              size={17}
              width={2}
              thickness={1.8}
              centerCarat={0.9}
              track={{ mode: "half", count: 12, stoneMm: 1.2 }}
              label="3D-модель помолвочного кольца. Потяните, чтобы повернуть."
            />
            <span className="hero-note">Здесь будет видео мастерской. Сейчас — 3D: потяните кольцо</span>
          </div>
        </div>
      </section>

      {/* Кнопки категорий сразу под первым экраном */}
      <section className="section-tight">
        <div className="container">
          <nav className="cat-grid" aria-label="Категории">
            {TILES.map((t) => (
              <Link key={t.t} href={t.href} className={`cat-tile ${t.dark ? "dark" : ""}`}>
                <span className="t">{t.t}</span>
                <span className="s">{t.s}</span>
                <span className="arr" aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Подборки */}
      <section className="section paper">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Подборки</span>
              <h2 className="display h2">Модели, которые можно рассчитать прямо сейчас</h2>
            </div>
            <Link href="/catalog/" className="btn btn-ghost">Весь каталог</Link>
          </div>
          <div style={{ display: "grid", gap: 14, marginBottom: 36 }}>
            <div className="chips" aria-label="Обручальные кольца по стилю">
              <span className="filter-label" style={{ alignSelf: "center", marginRight: 6 }}>Обручальные</span>
              {STYLES.filter((s) => MODELS.some((m) => m.category === "obruchalnye" && m.style === s)).map((s) => (
                <Link key={s} className="chip" href={`/catalog/?cat=obruchalnye&style=${encodeURIComponent(s)}`}>{s}</Link>
              ))}
            </div>
            <div className="chips" aria-label="Помолвочные кольца по стилю">
              <span className="filter-label" style={{ alignSelf: "center", marginRight: 6 }}>Помолвочные</span>
              {STYLES.filter((s) => MODELS.some((m) => m.category === "pomolvochnye" && m.style === s)).map((s) => (
                <Link key={s} className="chip" href={`/catalog/?cat=pomolvochnye&style=${encodeURIComponent(s)}`}>{s}</Link>
              ))}
            </div>
          </div>
          <div className="card-grid">
            {featured.map((m) => <ModelCard key={m.slug} model={m} />)}
          </div>
        </div>
      </section>

      {/* Бриллианты */}
      <section className="section velvet">
        <div className="container diamond-split">
          <div style={{ display: "grid", gap: 22 }}>
            <span className="eyebrow">Бриллианты под заказ</span>
            <h2 className="display h2">Камень с сертификатом, подобранный по вашим параметрам</h2>
            <p className="lead">
              Подбираем натуральные и выращенные бриллианты из стока поставщиков. Камень можно заказать отдельно или сразу вставить в кольцо.
            </p>
            <div className="origin-cards">
              <Link href="/diamonds/?origin=natural" className="origin-card">
                <b className="num">{natural}</b>
                <span>натуральных камней · GIA, HRD, IGI</span>
              </Link>
              <Link href="/diamonds/?origin=lab" className="origin-card">
                <b className="num">{lab}</b>
                <span>выращенных камней · IGI</span>
              </Link>
            </div>
            <div><Link href="/diamonds/" className="btn btn-gold">Открыть подбор</Link></div>
          </div>
          <div className="spec-list" aria-label="Что указано у каждого камня">
            {[
              ["Форма и огранка", "7 форм, огранка Excellent–Good"],
              ["Масса", "0,30–3,00 ct"],
              ["Цвет и чистота", "D–K, IF–SI2"],
              ["Сертификат", "номер и ссылка на проверку"],
              ["Цена", "за камень и за карат"],
              ["Наличие", "у поставщика и срок доставки"],
            ].map(([a, b]) => (
              <div key={a}><span>{a}</span><span>{b}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* Индивидуальное изготовление */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Индивидуальное изготовление</span>
              <h2 className="display h2">От эскиза на салфетке до паспорта изделия</h2>
              <p className="lead">Сделаем украшение по фото, рисунку или вашей идее. Изменим готовую модель или восстановим старое кольцо.</p>
            </div>
            <Link href="/custom/#form" className="btn btn-ink">Отправить эскиз</Link>
          </div>
          <ol className="process">
            {PROCESS.map((s, i) => (
              <li key={s.t}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Наши работы */}
      <section className="section paper" id="works">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Наши работы</span>
              <h2 className="display h2">Из мастерской</h2>
              <p className="muted">В рабочей версии здесь будут фотографии и видео реальных заказов.</p>
            </div>
          </div>
          <div className="works">
            {works.map((w) => (
              <div key={w.slug} className={`work ${w.big ? "big" : ""}`}>
                <RingArt model={getModel(w.slug)!} color={w.color} />
                <span className="cap">{w.cap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Сервис */}
      <section className="section" id="service">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Мастерская и сервис</span>
              <h2 className="display h2">Делаем сами и отвечаем за результат</h2>
              <p className="lead">Литьё, закрепка, полировка и гравировка в собственной мастерской. Один мастер ведёт заказ от эскиза до выдачи.</p>
            </div>
          </div>
          <div className="service">
            {SERVICE.map((s) => (
              <div key={s.t}><h3>{s.t}</h3><p>{s.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section className="section velvet" id="contacts">
        <div className="container contacts">
          <div style={{ display: "grid", gap: 24 }}>
            <span className="eyebrow">Салон</span>
            <h2 className="display h2">Приходите примерить</h2>
            <div className="contact-list">
              <div><span>Адрес</span><b>Город, улица, дом</b></div>
              <div><span>Телефон</span><b>+7 (000) 000-00-00</b></div>
              <div><span>Часы работы</span><b>Ежедневно 10:00–20:00, по записи</b></div>
            </div>
          </div>
          <div className="panel" style={{ color: "var(--ink)" }}>
            <LeadForm title="Записаться на консультацию" submitLabel="Записаться" />
          </div>
        </div>
      </section>
    </>
  );
}
