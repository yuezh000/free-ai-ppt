"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { translations, type Locale } from "@/lib/i18n";

export function ComingSoon({ open, onClose, locale = "en" }: { open: boolean; onClose: () => void; locale?: Locale }) {
  const t = translations[locale].modal;
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  useEffect(() => { if (!open) setJoined(false); }, [open]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label={t.close}><X size={18} /></button>
        <span className="eyebrow">{t.eyebrow}</span>
        <h2>{t.title}</h2>
        <p>{t.text}</p>
        {joined ? <div className="success-note">{t.success}</div> : (
          <form onSubmit={(event) => { event.preventDefault(); if (email) setJoined(true); }} className="waitlist-form">
            <input type="email" required placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="primary-button">{t.button}</button>
          </form>
        )}
      </section>
    </div>
  );
}
