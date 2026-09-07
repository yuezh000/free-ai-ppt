"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Download, FileText, LoaderCircle, LogIn, Plus, RefreshCw } from "lucide-react";
import { openAuthDialog, readAuthSession } from "@/lib/client-auth";
import { localizePath, translations, type Locale } from "@/lib/i18n";

type DownloadLink = { kind:string; url:string };
type Job = { id:string; prompt:string; status:"pending"|"processing"|"completed"|"failed"; ready_at:string|null; attempts:number; error:string|null; created_at:string; updated_at:string; completed_at:string|null; input_count:number; template_slug:string|null; downloads:DownloadLink[] };

const copy: Record<Locale,{signIn:string;empty:string;queued:string;draft:string;processing:string;completed:string;failed:string;files:string;template:string;refresh:string;loadError:string}> = {
  en:{signIn:"Sign in to see your presentation queue.",empty:"No tasks yet. Describe a presentation to create your first one.",queued:"Queued",draft:"Uploading",processing:"Generating",completed:"Completed",failed:"Failed",files:"attachments",template:"Template",refresh:"Refresh",loadError:"Could not load your tasks."},
  "zh-CN":{signIn:"登录后查看你的演示文稿队列。",empty:"还没有任务，描述你的需求来创建第一份演示文稿。",queued:"等待中",draft:"上传中",processing:"生成中",completed:"已完成",failed:"失败",files:"个附件",template:"模板",refresh:"刷新",loadError:"无法加载任务。"},
  "zh-TW":{signIn:"登入後查看你的簡報佇列。",empty:"尚無任務，描述需求來建立第一份簡報。",queued:"等待中",draft:"上傳中",processing:"產生中",completed:"已完成",failed:"失敗",files:"個附件",template:"範本",refresh:"重新整理",loadError:"無法載入任務。"},
  ja:{signIn:"ログインしてプレゼン生成キューを確認してください。",empty:"タスクはまだありません。最初のプレゼンを作成しましょう。",queued:"待機中",draft:"アップロード中",processing:"生成中",completed:"完了",failed:"失敗",files:"件の添付",template:"テンプレート",refresh:"更新",loadError:"タスクを読み込めませんでした。"},
  ko:{signIn:"로그인하여 프레젠테이션 대기열을 확인하세요.",empty:"아직 작업이 없습니다. 첫 프레젠테이션을 만들어 보세요.",queued:"대기 중",draft:"업로드 중",processing:"생성 중",completed:"완료",failed:"실패",files:"개 첨부",template:"템플릿",refresh:"새로고침",loadError:"작업을 불러오지 못했습니다."},
  fr:{signIn:"Connectez-vous pour voir votre file de présentations.",empty:"Aucune tâche. Décrivez votre première présentation.",queued:"En attente",draft:"Importation",processing:"Génération",completed:"Terminée",failed:"Échec",files:"fichiers",template:"Modèle",refresh:"Actualiser",loadError:"Impossible de charger vos tâches."},
  es:{signIn:"Inicia sesión para ver tu cola de presentaciones.",empty:"Aún no hay tareas. Describe tu primera presentación.",queued:"En cola",draft:"Subiendo",processing:"Generando",completed:"Completada",failed:"Error",files:"archivos",template:"Plantilla",refresh:"Actualizar",loadError:"No se pudieron cargar las tareas."},
  ru:{signIn:"Войдите, чтобы увидеть очередь презентаций.",empty:"Задач пока нет. Опишите первую презентацию.",queued:"В очереди",draft:"Загрузка",processing:"Создаётся",completed:"Готово",failed:"Ошибка",files:"вложений",template:"Шаблон",refresh:"Обновить",loadError:"Не удалось загрузить задачи."},
};

function statusText(job: Job, t: (typeof copy)[Locale]) {
  if (job.status === "pending") return job.ready_at ? t.queued : t.draft;
  return t[job.status];
}

export function JobQueue({ locale = "en" }: { locale?: Locale }) {
  const t=translations[locale].queue,c=copy[locale];
  const [jobs,setJobs]=useState<Job[]>([]),[loading,setLoading]=useState(true),[signedOut,setSignedOut]=useState(false),[error,setError]=useState("");
  const load=useCallback(async()=>{
    const session=readAuthSession();
    if(!session){setSignedOut(true);setLoading(false);return;}
    setSignedOut(false);setError("");
    try{
      const response=await fetch("/api/v1/jobs",{headers:{Authorization:`Bearer ${session.token}`},cache:"no-store"});
      if(response.status===401){setSignedOut(true);throw new Error(c.signIn);}
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(typeof data.error==="string"?data.error:c.loadError);
      setJobs(Array.isArray(data.jobs)?data.jobs:[]);
    }catch(cause){setError(cause instanceof Error?cause.message:c.loadError);}finally{setLoading(false);}
  },[c.loadError,c.signIn]);
  useEffect(()=>{void load();const timer=window.setInterval(()=>void load(),10000);return()=>window.clearInterval(timer);},[load]);

  const download=async(job:Job,link:DownloadLink)=>{
    const session=readAuthSession();if(!session){openAuthDialog();return;}
    setError("");
    try{
      const response=await fetch(link.url,{headers:{Authorization:`Bearer ${session.token}`}});
      if(!response.ok)throw new Error(c.loadError);
      const data=await response.json().catch(()=>({})) as {url?:string};
      if(!data.url)throw new Error(c.loadError);
      const anchor=document.createElement("a");
      anchor.href=data.url;anchor.download=`freeaippt-${job.id}.${link.kind}`;anchor.rel="noopener";anchor.click();
    }catch(cause){setError(cause instanceof Error?cause.message:c.loadError);}
  };

  return <section className="dashboard"><div className="dashboard-title"><div><span className="eyebrow">{t.eyebrow}</span><h1>{t.title}</h1><p>{t.lead}</p></div><div className="dashboard-actions"><button data-testid="queue-refresh" className="secondary-button" onClick={()=>void load()}><RefreshCw size={16}/>{c.refresh}</button><Link href={localizePath(locale)} className="primary-button"><Plus size={17}/>{t.newDeck}</Link></div></div>
    {loading?<div className="queue-state"><LoaderCircle className="spin"/><p>{c.loadError.replace("Could not", "Loading")}</p></div>:signedOut?<div className="queue-state"><LogIn/><p>{c.signIn}</p><button data-testid="queue-sign-in" className="primary-button" onClick={openAuthDialog}>{translations[locale].nav.signIn}</button></div>:jobs.length===0?<div className="queue-state"><FileText/><p>{c.empty}</p></div>:<div className="queue-card">{jobs.map(job=><div className="queue-item" key={job.id}><span className="deck-icon">{job.status==="processing"?<LoaderCircle className="spin"/>:job.status==="failed"?<AlertCircle/>:<FileText/>}</span><div className="queue-main"><strong>{job.prompt}</strong><span>{new Date(job.created_at).toLocaleString(locale)} · {job.input_count} {c.files}{job.template_slug?` · ${c.template}: ${job.template_slug}`:""}</span>{job.error&&<span className="queue-error">{job.error}</span>}</div><span className={`status ${job.status==="completed"?"ready":job.status==="failed"?"failed":"generating"}`}>{statusText(job,c)}</span>{job.downloads.length>0&&<div className="download-group">{job.downloads.map(link=><button data-testid={`queue-${job.id}-download-${link.kind}`} key={link.kind} onClick={()=>void download(job,link)}><Download size={15}/>{link.kind.toUpperCase()}</button>)}</div>}</div>)}</div>}
    {error&&<p className="auth-error queue-page-error" role="alert">{error}</p>}
  </section>;
}
