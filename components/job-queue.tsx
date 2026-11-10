"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Download, ExternalLink, FileText, LoaderCircle, LogIn, Plus, RefreshCw } from "lucide-react";
import { openAuthDialog, readAuthSession } from "@/lib/client-auth";
import { localizePath, translations, type Locale } from "@/lib/i18n";
import { captureConversion, conversionEvents } from "@/lib/analytics";
import { loadPageAllowance, pageAllowanceCopy, type PageAllowance } from "@/lib/page-allowance";

type DownloadLink = { kind:string; url:string };
type Job = { id:string; prompt:string; status:"pending"|"processing"|"completed"|"failed"; ready_at:string|null; attempts:number; created_at:string; updated_at:string; completed_at:string|null; input_count:number; template_slug:string|null; requested_slides?:number; downloads:DownloadLink[] };

const slidesLabel: Record<Locale,string> = {en:"slides","zh-CN":"页","zh-TW":"頁",ja:"枚",ko:"장",fr:"diapositives",es:"diapositivas",ru:"слайдов"};
const retryCopy: Record<Locale,{retry:string;retrying:string;failed:string;quota:string}> = {
  en:{retry:"Retry",retrying:"Retrying…",failed:"Could not retry the task. Please try again.",quota:"Not enough free pages remain to retry this task."},
  "zh-CN":{retry:"重试",retrying:"正在重试……",failed:"重试失败，请稍后再试。",quota:"剩余免费页数不足，无法重试此任务。"},
  "zh-TW":{retry:"重試",retrying:"正在重試……",failed:"重試失敗，請稍後再試。",quota:"剩餘免費頁數不足，無法重試此任務。"},
  ja:{retry:"再試行",retrying:"再試行中…",failed:"再試行できませんでした。もう一度お試しください。",quota:"再試行に必要な無料ページ数が残っていません。"},
  ko:{retry:"다시 시도",retrying:"다시 시도 중…",failed:"다시 시도하지 못했습니다. 잠시 후 다시 시도하세요.",quota:"다시 시도할 무료 페이지가 부족합니다."},
  fr:{retry:"Réessayer",retrying:"Nouvel essai…",failed:"Impossible de relancer la tâche. Réessayez.",quota:"Il ne reste pas assez de pages gratuites pour réessayer."},
  es:{retry:"Reintentar",retrying:"Reintentando…",failed:"No se pudo reintentar la tarea. Inténtalo de nuevo.",quota:"No quedan suficientes páginas gratuitas para reintentar."},
  ru:{retry:"Повторить",retrying:"Повтор…",failed:"Не удалось повторить задачу. Попробуйте позже.",quota:"Для повтора не хватает бесплатных страниц."},
};

const copy: Record<Locale,{signIn:string;empty:string;queued:string;draft:string;processing:string;completed:string;failed:string;files:string;template:string;refresh:string;loadError:string;viewHtml:string;downloadPptx:string}> = {
  en:{signIn:"Sign in to see your presentation queue.",empty:"No tasks yet. Describe a presentation to create your first one.",queued:"Queued",draft:"Uploading",processing:"Generating",completed:"Completed",failed:"Failed",files:"attachments",template:"Template",refresh:"Refresh",loadError:"Could not load your tasks.",viewHtml:"View HTML",downloadPptx:"Download PPTX"},
  "zh-CN":{signIn:"登录后查看你的演示文稿队列。",empty:"还没有任务，描述你的需求来创建第一份演示文稿。",queued:"等待中",draft:"上传中",processing:"生成中",completed:"已完成",failed:"失败",files:"个附件",template:"模板",refresh:"刷新",loadError:"无法加载任务。",viewHtml:"查看 HTML",downloadPptx:"下载 PPTX"},
  "zh-TW":{signIn:"登入後查看你的簡報佇列。",empty:"尚無任務，描述需求來建立第一份簡報。",queued:"等待中",draft:"上傳中",processing:"產生中",completed:"已完成",failed:"失敗",files:"個附件",template:"範本",refresh:"重新整理",loadError:"無法載入任務。",viewHtml:"檢視 HTML",downloadPptx:"下載 PPTX"},
  ja:{signIn:"ログインしてプレゼン生成キューを確認してください。",empty:"タスクはまだありません。最初のプレゼンを作成しましょう。",queued:"待機中",draft:"アップロード中",processing:"生成中",completed:"完了",failed:"失敗",files:"件の添付",template:"テンプレート",refresh:"更新",loadError:"タスクを読み込めませんでした。",viewHtml:"HTML を表示",downloadPptx:"PPTX をダウンロード"},
  ko:{signIn:"로그인하여 프레젠테이션 대기열을 확인하세요.",empty:"아직 작업이 없습니다. 첫 프레젠테이션을 만들어 보세요.",queued:"대기 중",draft:"업로드 중",processing:"생성 중",completed:"완료",failed:"실패",files:"개 첨부",template:"템플릿",refresh:"새로고침",loadError:"작업을 불러오지 못했습니다.",viewHtml:"HTML 보기",downloadPptx:"PPTX 다운로드"},
  fr:{signIn:"Connectez-vous pour voir votre file de présentations.",empty:"Aucune tâche. Décrivez votre première présentation.",queued:"En attente",draft:"Importation",processing:"Génération",completed:"Terminée",failed:"Échec",files:"fichiers",template:"Modèle",refresh:"Actualiser",loadError:"Impossible de charger vos tâches.",viewHtml:"Voir le HTML",downloadPptx:"Télécharger le PPTX"},
  es:{signIn:"Inicia sesión para ver tu cola de presentaciones.",empty:"Aún no hay tareas. Describe tu primera presentación.",queued:"En cola",draft:"Subiendo",processing:"Generando",completed:"Completada",failed:"Error",files:"archivos",template:"Plantilla",refresh:"Actualizar",loadError:"No se pudieron cargar las tareas.",viewHtml:"Ver HTML",downloadPptx:"Descargar PPTX"},
  ru:{signIn:"Войдите, чтобы увидеть очередь презентаций.",empty:"Задач пока нет. Опишите первую презентацию.",queued:"В очереди",draft:"Загрузка",processing:"Создаётся",completed:"Готово",failed:"Ошибка",files:"вложений",template:"Шаблон",refresh:"Обновить",loadError:"Не удалось загрузить задачи.",viewHtml:"Открыть HTML",downloadPptx:"Скачать PPTX"},
};

function statusText(job: Job, t: (typeof copy)[Locale]) {
  if (job.status === "pending") return job.ready_at ? t.queued : t.draft;
  return t[job.status];
}

export function JobQueue({ locale = "en" }: { locale?: Locale }) {
  const t=translations[locale].queue,c=copy[locale];
  const [jobs,setJobs]=useState<Job[]>([]),[loading,setLoading]=useState(true),[signedOut,setSignedOut]=useState(false),[error,setError]=useState("");
  const [allowance,setAllowance]=useState<PageAllowance|null>(null);
  const [retryingJobId,setRetryingJobId]=useState<string|null>(null);
  const load=useCallback(async()=>{
    const session=readAuthSession();
    if(!session){setSignedOut(true);setAllowance(null);setLoading(false);return;}
    setSignedOut(false);setError("");
    try{
      const response=await fetch("/api/v1/jobs",{headers:{Authorization:`Bearer ${session.token}`},cache:"no-store"});
      if(response.status===401){setSignedOut(true);throw new Error(c.signIn);}
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(typeof data.error==="string"?data.error:c.loadError);
      const nextJobs: Job[] = Array.isArray(data.jobs)?data.jobs:[];
      for (const job of nextJobs) {
        if (job.status!=="completed" && job.status!=="failed") continue;
        const key=`freeppt-analytics-${job.id}-${job.status}`;
        let firstObservation=true;
        try { firstObservation=sessionStorage.getItem(key)!=="1"; if(firstObservation)sessionStorage.setItem(key,"1"); } catch { /* Analytics must not block the queue. */ }
        if(firstObservation)captureConversion(job.status==="completed"?conversionEvents.taskCompleted:conversionEvents.taskFailed,{job_id:job.id,slide_count:job.requested_slides,attempts:job.attempts,input_count:job.input_count,template:job.template_slug,locale});
      }
      setJobs(nextJobs);
      setAllowance(await loadPageAllowance(session.token));
    }catch(cause){setError(cause instanceof Error?cause.message:c.loadError);}finally{setLoading(false);}
  },[c.loadError,c.signIn,locale]);
  useEffect(()=>{void load();const timer=window.setInterval(()=>void load(),10000);return()=>window.clearInterval(timer);},[load]);

  const retryJob=async(job:Job)=>{
    const session=readAuthSession();if(!session){openAuthDialog();return;}
    setRetryingJobId(job.id);setError("");
    try{
      const response=await fetch(`/api/v1/jobs/${encodeURIComponent(job.id)}/retry`,{method:"POST",headers:{Authorization:`Bearer ${session.token}`}});
      if(!response.ok)throw new Error(response.status===402?retryCopy[locale].quota:retryCopy[locale].failed);
      setJobs(previous=>previous.map(item=>item.id===job.id?{...item,status:"pending",ready_at:new Date().toISOString(),attempts:0}:item));
      await load();
    }catch(cause){setError(cause instanceof Error?cause.message:retryCopy[locale].failed);}finally{setRetryingJobId(null);}
  };

  const openOutput=async(job:Job,link:DownloadLink)=>{
    const session=readAuthSession();if(!session){openAuthDialog();return;}
    setError("");
    try{
      const response=await fetch(link.url,{headers:{Authorization:`Bearer ${session.token}`}});
      if(!response.ok)throw new Error(c.loadError);
      const data=await response.json().catch(()=>({})) as {url?:string};
      if(!data.url)throw new Error(c.loadError);
      captureConversion(conversionEvents.outputOpened,{job_id:job.id,format:link.kind,slide_count:job.requested_slides,template:job.template_slug,locale});
      const anchor=document.createElement("a");
      anchor.href=data.url;anchor.rel="noopener noreferrer";
      if(link.kind==="html"){anchor.target="_blank";}else{anchor.download=`freeaippt-${job.id}.${link.kind}`;}
      anchor.click();
    }catch(cause){setError(cause instanceof Error?cause.message:c.loadError);}
  };

  return <section className="dashboard"><div className="dashboard-title"><div><span className="eyebrow">{t.eyebrow}</span><h1>{t.title}</h1><p>{t.lead}</p></div><div className="dashboard-actions"><button data-testid="queue-refresh" className="secondary-button" onClick={()=>void load()}><RefreshCw size={16}/>{c.refresh}</button><Link data-testid="queue-new-deck" href={localizePath(locale)} className="primary-button"><Plus size={17}/>{t.newDeck}</Link></div></div>
    {!loading&&!signedOut&&<div className="queue-allowance"><div><span>{pageAllowanceCopy[locale].remaining}</span><strong data-testid="queue-remaining">{allowance?`${allowance.remaining} / ${allowance.total}`:"— / 10"}</strong></div><Link data-testid="queue-buy-pages" href={localizePath(locale,"/pricing")}>{pageAllowanceCopy[locale].buy}</Link></div>}
    {loading?<div className="queue-state"><LoaderCircle className="spin"/><p>{c.loadError.replace("Could not", "Loading")}</p></div>:signedOut?<div className="queue-state"><LogIn/><p>{c.signIn}</p><button data-testid="queue-sign-in" className="primary-button" onClick={openAuthDialog}>{translations[locale].nav.signIn}</button></div>:jobs.length===0?<div className="queue-state"><FileText/><p>{c.empty}</p></div>:<div className="queue-card">{jobs.map(job=><div className="queue-item" key={job.id}><span className="deck-icon">{job.status==="processing"?<LoaderCircle className="spin"/>:job.status==="failed"?<AlertCircle/>:<FileText/>}</span><div className="queue-main"><strong>{job.prompt}</strong><span>{new Date(job.created_at).toLocaleString(locale)} · {job.input_count} {c.files}{job.requested_slides?` · ${job.requested_slides} ${slidesLabel[locale]}`:""}{job.template_slug?` · ${c.template}: ${job.template_slug}`:""}</span></div><span className={`status ${job.status==="completed"?"ready":job.status==="failed"?"failed":"generating"}`}>{statusText(job,c)}</span>{(job.status==="failed"||job.downloads.length>0)&&<div className="download-group">{job.status==="failed"&&<button data-testid={`queue-${job.id}-retry`} disabled={retryingJobId!==null} onClick={()=>void retryJob(job)}>{retryingJobId===job.id?<LoaderCircle className="spin" size={15}/>:<RefreshCw size={15}/>} {retryingJobId===job.id?retryCopy[locale].retrying:retryCopy[locale].retry}</button>}{job.downloads.map(link=><button data-testid={`queue-${job.id}-${link.kind==="html"?"view":"download"}-${link.kind}`} key={link.kind} onClick={()=>void openOutput(job,link)}>{link.kind==="html"?<ExternalLink size={15}/>:<Download size={15}/>} {link.kind==="html"?c.viewHtml:c.downloadPptx}</button>)}</div>}</div>)}</div>}
    {error&&<p className="auth-error queue-page-error" role="alert">{error}</p>}
  </section>;
}
