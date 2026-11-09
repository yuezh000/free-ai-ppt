"use client";

import { X } from "lucide-react";
import { translations, type Locale } from "@/lib/i18n";

const title: Record<Locale,string> = {
  en:"Payments are coming soon", "zh-CN":"支付功能即将上线", "zh-TW":"付款功能即將上線",
  ja:"決済機能は近日公開", ko:"결제 기능이 곧 출시됩니다", fr:"Les paiements arrivent bientôt",
  es:"Los pagos estarán disponibles pronto", ru:"Оплата скоро появится",
};

export function PricingNotice({ locale="en", open, onClose }: { locale?:Locale; open:boolean; onClose:()=>void }) {
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="pricing-notice-title" onMouseDown={event=>event.stopPropagation()}><button data-testid="pricing-notice-close" className="modal-close" onClick={onClose} aria-label={translations[locale].modal.close}><X size={18}/></button><h2 id="pricing-notice-title">{title[locale]}</h2><p>{translations[locale].pricing.note}</p></section></div>;
}
