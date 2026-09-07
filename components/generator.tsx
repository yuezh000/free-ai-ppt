"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUp, Check, FileArchive, FileImage, FileSpreadsheet, FileText, LayoutTemplate, Paperclip, Plus, X } from "lucide-react";
import { ComingSoon } from "./coming-soon";
import { localizePath, translations, type Locale } from "@/lib/i18n";
import { captureConversion, conversionEvents } from "@/lib/analytics";
import { openAuthDialog, readAuthSession } from "@/lib/client-auth";
import { getFeatureFlags } from "@/lib/features";
import { getTemplate, templates, type PptTemplate } from "@/lib/templates";
import { localizedTemplateName } from "@/lib/template-i18n";

const extensions = ["DOCX", "PPTX", "XLSX", "PDF", "PNG", "JPG"];
const maxFileBytes = 25 * 1024 * 1024;

type CreatedJob = { id: string; job_token: string };
type UploadAuthorization = { reservation_id:string; upload_url:string; method:string; headers:Record<string,string> };
type BlobPutResult = { url:string };

const taskCopy: Record<Locale, { signIn:string; submitting:string; queued:string; unavailable:string; tooLarge:string; failed:string; attachmentPrompt:string; chooseTemplate:string; attachFiles:string; templateTitle:string; templateLead:string; removeTemplate:string }> = {
  en:{signIn:"Sign in to submit your presentation.",submitting:"Uploading and joining the queue…",queued:"Task submitted.",unavailable:"Task submission and trial registration are currently closed.",tooLarge:"Each attachment must be 25 MB or smaller.",failed:"Could not submit the task. Please try again.",attachmentPrompt:"Create a presentation from the attached files.",chooseTemplate:"Choose a template",attachFiles:"Attach files",templateTitle:"Choose a presentation style",templateLead:"The selected template will guide the generated deck.",removeTemplate:"Remove template"},
  "zh-CN":{signIn:"请先登录，再提交演示文稿任务。",submitting:"正在上传并加入队列……",queued:"任务已提交。",unavailable:"任务提交和试用候选登记目前均已关闭。",tooLarge:"每个附件不能超过 25 MB。",failed:"任务提交失败，请重试。",attachmentPrompt:"请根据附件制作一份演示文稿。",chooseTemplate:"选择模板",attachFiles:"上传附件",templateTitle:"选择演示文稿风格",templateLead:"所选模板将用于指导生成的演示文稿。",removeTemplate:"移除模板"},
  "zh-TW":{signIn:"請先登入，再提交簡報任務。",submitting:"正在上傳並加入佇列……",queued:"任務已提交。",unavailable:"任務提交與試用登記目前均已關閉。",tooLarge:"每個附件不得超過 25 MB。",failed:"任務提交失敗，請重試。",attachmentPrompt:"請根據附件製作一份簡報。",chooseTemplate:"選擇範本",attachFiles:"上傳附件",templateTitle:"選擇簡報風格",templateLead:"所選範本將用來指導產生的簡報。",removeTemplate:"移除範本"},
  ja:{signIn:"プレゼンを送信するにはログインしてください。",submitting:"アップロードしてキューに追加しています…",queued:"タスクを送信しました。",unavailable:"現在、タスク送信と先行登録は停止中です。",tooLarge:"各ファイルは25MB以下にしてください。",failed:"送信できませんでした。もう一度お試しください。",attachmentPrompt:"添付ファイルからプレゼンを作成してください。",chooseTemplate:"テンプレートを選択",attachFiles:"ファイルを添付",templateTitle:"プレゼンスタイルを選択",templateLead:"選んだテンプレートを生成デザインに反映します。",removeTemplate:"テンプレートを解除"},
  ko:{signIn:"프레젠테이션 작업을 제출하려면 로그인하세요.",submitting:"업로드 후 대기열에 추가하는 중…",queued:"작업이 제출되었습니다.",unavailable:"현재 작업 제출 및 체험 등록이 닫혀 있습니다.",tooLarge:"각 첨부 파일은 25MB 이하여야 합니다.",failed:"작업을 제출하지 못했습니다. 다시 시도하세요.",attachmentPrompt:"첨부 파일로 프레젠테이션을 만들어 주세요.",chooseTemplate:"템플릿 선택",attachFiles:"파일 첨부",templateTitle:"프레젠테이션 스타일 선택",templateLead:"선택한 템플릿이 생성 디자인을 안내합니다.",removeTemplate:"템플릿 제거"},
  fr:{signIn:"Connectez-vous pour envoyer votre présentation.",submitting:"Importation et ajout à la file…",queued:"Tâche envoyée.",unavailable:"L’envoi et les inscriptions sont actuellement fermés.",tooLarge:"Chaque fichier doit faire 25 Mo maximum.",failed:"Impossible d’envoyer la tâche. Réessayez.",attachmentPrompt:"Créez une présentation à partir des fichiers joints.",chooseTemplate:"Choisir un modèle",attachFiles:"Joindre des fichiers",templateTitle:"Choisissez un style",templateLead:"Le modèle sélectionné guidera la présentation générée.",removeTemplate:"Retirer le modèle"},
  es:{signIn:"Inicia sesión para enviar tu presentación.",submitting:"Subiendo y añadiendo a la cola…",queued:"Tarea enviada.",unavailable:"El envío y el registro de prueba están cerrados.",tooLarge:"Cada archivo debe tener 25 MB o menos.",failed:"No se pudo enviar la tarea. Inténtalo de nuevo.",attachmentPrompt:"Crea una presentación a partir de los archivos adjuntos.",chooseTemplate:"Elegir plantilla",attachFiles:"Adjuntar archivos",templateTitle:"Elige un estilo",templateLead:"La plantilla seleccionada guiará la presentación generada.",removeTemplate:"Quitar plantilla"},
  ru:{signIn:"Войдите, чтобы отправить задачу.",submitting:"Загрузка и добавление в очередь…",queued:"Задача отправлена.",unavailable:"Приём задач и заявок сейчас закрыт.",tooLarge:"Размер каждого файла — не более 25 МБ.",failed:"Не удалось отправить задачу. Повторите попытку.",attachmentPrompt:"Создайте презентацию из вложенных файлов.",chooseTemplate:"Выбрать шаблон",attachFiles:"Прикрепить файлы",templateTitle:"Выберите стиль",templateLead:"Выбранный шаблон задаст стиль новой презентации.",removeTemplate:"Убрать шаблон"},
};

function fileIcon(name: string) {
  if (/\.(png|jpg|jpeg|webp)$/i.test(name)) return <FileImage size={18} />;
  if (/\.(xls|xlsx|csv)$/i.test(name)) return <FileSpreadsheet size={18} />;
  if (/\.(ppt|pptx)$/i.test(name)) return <FileArchive size={18} />;
  return <FileText size={18} />;
}

export function Generator({ locale = "en" }: { locale?: Locale }) {
  const router = useRouter();
  const t = translations[locale].generator;
  const c = taskCopy[locale];
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [modal, setModal] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PptTemplate | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);

  useEffect(()=>{const slug=new URLSearchParams(window.location.search).get("template");if(!slug)return;const template=getTemplate(slug);if(template){setSelectedTemplate(template);captureConversion(conversionEvents.templateSelected,{template:slug,source:"url",locale});}},[locale]);

  const chooseTemplate=(template:PptTemplate)=>{setSelectedTemplate(template);setTemplateOpen(false);setToolsOpen(false);markStarted("prompt");captureConversion(conversionEvents.templateSelected,{template:template.slug,source:"picker",locale});};

  const markStarted = (inputSource: "attachment" | "prompt") => {
    if (startedRef.current) return;
    startedRef.current = true;
    captureConversion(conversionEvents.generatorStarted, { input_source: inputSource, locale });
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const added = Array.from(incoming);
    if (!added.length) return;
    if (added.some((file) => file.size > maxFileBytes)) { setError(c.tooLarge); return; }
    setError("");
    markStarted("attachment");
    captureConversion(conversionEvents.attachmentsAdded, {
      file_count: added.length,
      file_types: added.map((file) => file.name.split(".").pop()?.toLowerCase() ?? "unknown").join(","),
      locale,
    });
    setFiles((current) => [...current, ...added].slice(0, 8));
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => addFiles(event.target.files);
  const handleDrop = (event: DragEvent) => {
    event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files);
  };

  const submit = async () => {
    if (busy) return;
    setError(""); setMessage("");
    try {
      const features = await getFeatureFlags();
      if (!features.task_submission) {
        if (features.waitlist) setModal(true); else setError(c.unavailable);
        return;
      }
      const session = readAuthSession();
      if (!session) { setError(c.signIn); openAuthDialog(); return; }
      setBusy(true); setMessage(c.submitting);
      captureConversion(conversionEvents.generationRequested, { input_source: prompt.trim() && files.length ? "prompt_and_attachment" : files.length ? "attachment" : "prompt", file_count: files.length, locale });
      const create = await fetch("/api/v1/jobs", { method:"POST", headers:{"Authorization":`Bearer ${session.token}`,"Content-Type":"application/json"}, body:JSON.stringify({ prompt:prompt.trim() || c.attachmentPrompt, template_slug:selectedTemplate?.slug ?? null }) });
      const created = await create.json().catch(() => ({})) as CreatedJob & { error?:string };
      if (!create.ok) throw new Error(created.error || c.failed);
      for (const file of files) {
        const authorize = await fetch(`/api/v1/jobs/${created.id}/files/authorize`, {
          method:"POST",
          headers:{"x-job-token":created.job_token,"Content-Type":"application/json"},
          body:JSON.stringify({original_name:file.name,content_type:file.type,size_bytes:file.size}),
        });
        const authorization = await authorize.json().catch(()=>({})) as Partial<UploadAuthorization> & {error?:string};
        if (!authorize.ok || !authorization.upload_url || !authorization.reservation_id || !authorization.headers) {
          throw new Error(authorization.error || c.failed);
        }
        const upload = await fetch(authorization.upload_url, {method:authorization.method || "PUT",headers:authorization.headers,body:file});
        if (!upload.ok) throw new Error(c.failed);
        const blob = await upload.json().catch(()=>({})) as Partial<BlobPutResult>;
        if (!blob.url) throw new Error(c.failed);
        const register = await fetch(`/api/v1/jobs/${created.id}/files`, {
          method:"POST",
          headers:{"x-job-token":created.job_token,"Content-Type":"application/json"},
          body:JSON.stringify({reservation_id:authorization.reservation_id,blob_url:blob.url}),
        });
        if (!register.ok) { const data=await register.json().catch(()=>({})); throw new Error(typeof data.error === "string" ? data.error : c.failed); }
      }
      const queued = await fetch(`/api/v1/jobs/${created.id}/submit`, { method:"POST", headers:{"x-job-token":created.job_token} });
      if (!queued.ok) { const data=await queued.json().catch(()=>({})); throw new Error(typeof data.error === "string" ? data.error : c.failed); }
      captureConversion(conversionEvents.taskSubmitted, { file_count:files.length, locale });
      setMessage(c.queued);
      router.push(localizePath(locale, "/queue"));
    } catch (cause) {
      setMessage(""); setError(cause instanceof Error ? cause.message : c.failed);
    } finally { setBusy(false); }
  };

  return (
    <>
      <div id="generator" className={`composer ${dragging ? "dragging" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
        <textarea value={prompt} onChange={(e) => { if (e.target.value) markStarted("prompt"); setPrompt(e.target.value); }} placeholder={t.placeholder} aria-label={t.label} />
        {selectedTemplate&&<div className="selected-template"><Image src={`/templates/previews/${selectedTemplate.slug}/01.jpg`} width={96} height={54} alt=""/><span><small>{c.chooseTemplate}</small><strong>{localizedTemplateName(selectedTemplate,locale).shortName}</strong></span><button data-testid="generator-template-remove" onClick={()=>setSelectedTemplate(null)} aria-label={c.removeTemplate}><X size={14}/></button></div>}
        {files.length > 0 && <div className="file-list">{files.map((file, index) => (
          <span className="file-chip" key={`${file.name}-${index}`}>{fileIcon(file.name)}<span>{file.name}</span><button data-testid={`generator-attachment-remove-${index}`} onClick={() => setFiles(files.filter((_, i) => i !== index))} aria-label={`${t.remove} ${file.name}`}><X size={14} /></button></span>
        ))}</div>}
        <div className="composer-footer">
          <div>
            <input ref={inputRef} hidden type="file" multiple accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.pdf,.png,.jpg,.jpeg,.webp" onChange={handleInput} />
            <span className="composer-tools"><button data-testid="generator-tools-toggle" className="composer-plus" onClick={()=>setToolsOpen(!toolsOpen)} aria-label="Add" aria-expanded={toolsOpen}><Plus size={18}/></button>{toolsOpen&&<span className="composer-tools-menu"><button data-testid="generator-attachment-open" onClick={()=>{setToolsOpen(false);inputRef.current?.click();}}><Paperclip size={16}/>{c.attachFiles}</button><button data-testid="generator-template-open" onClick={()=>{setToolsOpen(false);setTemplateOpen(true);}}><LayoutTemplate size={16}/>{c.chooseTemplate}</button></span>}</span>
            <span className="file-hint">{t.drop}</span>
          </div>
          <button data-testid="generator-submit" className="send-button" disabled={busy || (!prompt.trim() && files.length === 0)} onClick={submit} aria-label="Generate deck"><ArrowUp size={20} /></button>
        </div>
      </div>
      {(message || error) && <p className={error ? "generator-feedback error" : "generator-feedback"} role="status">{error || message}</p>}
      <div className="format-row">{extensions.map((item) => <span key={item}>{item}</span>)}<span className="limit">{t.limit}</span></div>
      <ComingSoon open={modal} onClose={() => setModal(false)} locale={locale} source="generator" />
      {templateOpen&&<div className="modal-backdrop" onMouseDown={()=>setTemplateOpen(false)}><section className="modal template-picker" onMouseDown={event=>event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="template-picker-title"><button data-testid="generator-template-close" className="modal-close" onClick={()=>setTemplateOpen(false)} aria-label={translations[locale].modal.close}><X size={18}/></button><span className="eyebrow"><LayoutTemplate size={14}/>{c.chooseTemplate}</span><h2 id="template-picker-title">{c.templateTitle}</h2><p>{c.templateLead}</p><div className="template-picker-grid">{templates.map(template=><button data-testid={`generator-template-${template.slug}`} key={template.slug} className={selectedTemplate?.slug===template.slug?"selected":""} onClick={()=>chooseTemplate(template)}><Image src={`/templates/previews/${template.slug}/01.jpg`} alt="" width={320} height={180}/><span>{localizedTemplateName(template,locale).shortName}</span>{selectedTemplate?.slug===template.slug&&<Check size={17}/>}</button>)}</div></section></div>}
    </>
  );
}
