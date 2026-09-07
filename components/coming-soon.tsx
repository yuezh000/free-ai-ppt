"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { translations, type Locale } from "@/lib/i18n";
import { captureConversion, conversionEvents } from "@/lib/analytics";

export function ComingSoon({ open, onClose, locale = "en", source = "unknown" }: { open: boolean; onClose: () => void; locale?: Locale; source?: "generator" | "pricing" | "queue" | "unknown" }) {
  const t = translations[locale].modal;
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { if (!open) { setJoined(false); setError(""); } }, [open]);
  const join = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/v1/waitlist", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email, locale, source }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Request failed");
      captureConversion(conversionEvents.waitlistJoined, { locale, source });
      setJoined(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Request failed");
    } finally { setBusy(false); }
  };
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button data-testid="coming-soon-close" className="modal-close" onClick={onClose} aria-label={t.close}><X size={18} /></button>
        <span className="eyebrow">{t.eyebrow}</span>
        <h2>{t.title}</h2>
        <p>{t.text}</p>
        {joined ? <div className="success-note">{t.success}</div> : (
          <form onSubmit={join} className="waitlist-form">
            <input aria-label="Email" type="email" required placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button data-testid="coming-soon-waitlist-submit" type="submit" className="primary-button" disabled={busy}>{busy ? "…" : t.button}</button>
          </form>
        )}
        {error && <p className="auth-error" role="alert">{error}</p>}
      </section>
    </div>
  );
}
