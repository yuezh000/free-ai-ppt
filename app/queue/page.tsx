"use client";

import { Download, FileText, LoaderCircle, Plus } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { ComingSoon } from "@/components/coming-soon";
import { useState } from "react";

export default function Queue() {
  const [open, setOpen] = useState(false);
  return <main><Header /><section className="dashboard"><div className="dashboard-title"><div><span className="eyebrow">MY DECKS</span><h1>Your presentation queue</h1><p>Track generations and download completed decks in both formats.</p></div><Link href="/" className="primary-button"><Plus size={17} /> New deck</Link></div><div className="queue-card"><div className="queue-item"><span className="deck-icon"><LoaderCircle className="spin" /></span><div className="queue-main"><strong>Quarterly product strategy</strong><span>Generating · Added just now</span><div className="progress"><i /></div></div><span className="status generating">GENERATING</span></div><div className="queue-item"><span className="deck-icon"><FileText /></span><div className="queue-main"><strong>Remote work trends 2026</strong><span>12 slides · Completed yesterday</span></div><span className="status ready">READY</span><div className="download-group"><button onClick={() => setOpen(true)}><Download size={15} /> PPTX</button><button onClick={() => setOpen(true)}><Download size={15} /> HTML</button></div></div></div><div className="coming-banner"><span>DEMO QUEUE</span><p>Generation history and downloads will become available at launch.</p></div></section><ComingSoon open={open} onClose={() => setOpen(false)} /></main>;
}
