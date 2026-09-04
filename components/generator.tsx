"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { ArrowUp, FileArchive, FileImage, FileSpreadsheet, FileText, Paperclip, X } from "lucide-react";
import { ComingSoon } from "./coming-soon";
import { translations, type Locale } from "@/lib/i18n";

const extensions = ["DOCX", "PPTX", "XLSX", "PDF", "PNG", "JPG"];

function fileIcon(name: string) {
  if (/\.(png|jpg|jpeg|webp)$/i.test(name)) return <FileImage size={18} />;
  if (/\.(xls|xlsx|csv)$/i.test(name)) return <FileSpreadsheet size={18} />;
  if (/\.(ppt|pptx)$/i.test(name)) return <FileArchive size={18} />;
  return <FileText size={18} />;
}

export function Generator({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale].generator;
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [modal, setModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((current) => [...current, ...Array.from(incoming)].slice(0, 8));
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => addFiles(event.target.files);
  const handleDrop = (event: DragEvent) => {
    event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files);
  };

  return (
    <>
      <div className={`composer ${dragging ? "dragging" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t.placeholder} aria-label={t.label} />
        {files.length > 0 && <div className="file-list">{files.map((file, index) => (
          <span className="file-chip" key={`${file.name}-${index}`}>{fileIcon(file.name)}<span>{file.name}</span><button onClick={() => setFiles(files.filter((_, i) => i !== index))} aria-label={`${t.remove} ${file.name}`}><X size={14} /></button></span>
        ))}</div>}
        <div className="composer-footer">
          <div>
            <input ref={inputRef} hidden type="file" multiple accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.pdf,.png,.jpg,.jpeg,.webp" onChange={handleInput} />
            <button className="attach-button" onClick={() => inputRef.current?.click()}><Paperclip size={17} /> {t.attach}</button>
            <span className="file-hint">{t.drop}</span>
          </div>
          <button className="send-button" disabled={!prompt.trim() && files.length === 0} onClick={() => setModal(true)} aria-label="Generate deck"><ArrowUp size={20} /></button>
        </div>
      </div>
      <div className="format-row">{extensions.map((item) => <span key={item}>{item}</span>)}<span className="limit">{t.limit}</span></div>
      <ComingSoon open={modal} onClose={() => setModal(false)} locale={locale} />
    </>
  );
}
