"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function ComingSoon({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  useEffect(() => { if (!open) setJoined(false); }, [open]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <span className="eyebrow">EARLY ACCESS</span>
        <h2>Generation is coming soon.</h2>
        <p>We&apos;re polishing the deck engine. Join the list and get your first presentation free when we launch.</p>
        {joined ? <div className="success-note">You&apos;re on the list. We&apos;ll be in touch!</div> : (
          <form onSubmit={(event) => { event.preventDefault(); if (email) setJoined(true); }} className="waitlist-form">
            <input type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="primary-button">Notify me</button>
          </form>
        )}
      </section>
    </div>
  );
}
