"use client";

import { useId, useState } from "react";

export type LeadLine = { label: string; value: string };

type Props = {
  title?: string;
  summary?: LeadLine[]; // параметры, которые уйдут в заявку
  withFile?: boolean;
  withBudget?: boolean;
  submitLabel?: string;
  onDone?: () => void;
};

// В демо заявка никуда не отправляется: показываем, что получит салон
export default function LeadForm({ title, summary = [], withFile, withBudget, submitLabel = "Отправить заявку", onDone }: Props) {
  const uid = useId();
  const [sent, setSent] = useState<null | LeadLine[]>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    if (!name || phone.replace(/\D/g, "").length < 10) {
      setError("Укажите имя и телефон из 10–11 цифр, чтобы мастер мог перезвонить.");
      return;
    }
    if (!f.get("consent")) {
      setError("Нужно согласие на обработку персональных данных.");
      return;
    }
    setError("");
    const lines: LeadLine[] = [
      { label: "Имя", value: name },
      { label: "Телефон", value: phone },
      { label: "Связаться", value: String(f.get("channel")) },
      ...summary,
    ];
    if (withBudget && f.get("budget")) lines.push({ label: "Бюджет", value: String(f.get("budget")) });
    if (f.get("comment")) lines.push({ label: "Комментарий", value: String(f.get("comment")) });
    if (file) lines.push({ label: "Вложение", value: `${file.name} (${Math.round(file.size / 1024)} КБ)` });
    setSent(lines);
  }

  if (sent) {
    return (
      <div className="success">
        <div className="mark" aria-hidden="true">✓</div>
        <h3 className="display h3">Заявка сформирована</h3>
        <p className="muted small">
          Это демо, поэтому заявка не отправлена. На рабочем сайте она попадёт в админку, на почту и в Telegram салона со всеми параметрами:
        </p>
        <div className="summary" style={{ width: "100%" }}>
          {sent.map((l) => (
            <div key={l.label}><span className="muted">{l.label}:</span> <b>{l.value}</b></div>
          ))}
        </div>
        {onDone && <button type="button" className="btn btn-ink" onClick={onDone}>Готово</button>}
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      {title && <h3 className="display h3">{title}</h3>}
      {summary.length > 0 && (
        <div className="summary">
          {summary.map((l) => (
            <div key={l.label}><span className="muted">{l.label}:</span> <b>{l.value}</b></div>
          ))}
        </div>
      )}
      <div className="form-grid">
        <label className="field" htmlFor={`${uid}-name`}>
          Имя
          <input id={`${uid}-name`} name="name" autoComplete="name" placeholder="Как к вам обращаться" />
        </label>
        <label className="field" htmlFor={`${uid}-phone`}>
          Телефон
          <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="+7 900 000-00-00" />
        </label>
        <label className="field" htmlFor={`${uid}-channel`}>
          Где удобнее ответить
          <select id={`${uid}-channel`} name="channel" defaultValue="Telegram">
            <option>Telegram</option>
            <option>WhatsApp</option>
            <option>MAX</option>
            <option>Звонок</option>
          </select>
        </label>
        {withBudget && (
          <label className="field" htmlFor={`${uid}-budget`}>
            Ориентир по бюджету
            <select id={`${uid}-budget`} name="budget" defaultValue="">
              <option value="">Пока не знаю</option>
              <option>до 50 000 ₽</option>
              <option>50–150 тыс. ₽</option>
              <option>150–400 тыс. ₽</option>
              <option>больше 400 тыс. ₽</option>
            </select>
          </label>
        )}
        <label className="field full" htmlFor={`${uid}-comment`}>
          Комментарий
          <textarea id={`${uid}-comment`} name="comment" placeholder="Гравировка, сроки, пожелания по камням" />
        </label>
        {withFile && (
          <label className={`drop field full ${file ? "has" : ""}`} htmlFor={`${uid}-file`}>
            <input
              id={`${uid}-file`}
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <><b>{file.name}</b><span>Нажмите, чтобы заменить</span></>
            ) : (
              <><b>Прикрепите эскиз, фото или рисунок</b><span>JPG, PNG, PDF до 20 МБ</span></>
            )}
          </label>
        )}
      </div>
      <label className="check" htmlFor={`${uid}-consent`}>
        <input id={`${uid}-consent`} type="checkbox" name="consent" />
        <span>Согласен на обработку персональных данных по политике конфиденциальности</span>
      </label>
      {error && <p className="err" role="alert">{error}</p>}
      <button type="submit" className="btn btn-gold">{submitLabel}</button>
    </form>
  );
}
