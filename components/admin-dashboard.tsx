"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardList, Clock3, LoaderCircle, LockKeyhole, RefreshCw, Users } from "lucide-react";
import { openAuthDialog, readAuthSession } from "@/lib/client-auth";
import { getFeatureFlags, type FeatureFlags } from "@/lib/features";

type AdminJob = { id:string; prompt:string; status:string; ready_at:string|null; agent_id:string|null; lease_until:string|null; attempts:number; max_attempts:number; error:string|null; created_at:string; updated_at:string; completed_at:string|null; user_email:string|null; input_count:number; template_slug:string|null };
type Candidate = { id:string; email:string; source:string; locale:string; created_at:string; updated_at:string };
type Access = "loading"|"signed-out"|"denied"|"ready"|"error";

export function AdminDashboard() {
  const [jobs,setJobs]=useState<AdminJob[]>([]),[candidates,setCandidates]=useState<Candidate[]>([]),[features,setFeatures]=useState<FeatureFlags|null>(null),[access,setAccess]=useState<Access>("loading"),[error,setError]=useState("");
  const load=useCallback(async()=>{
    const session=readAuthSession();
    if(!session){setAccess("signed-out");return;}
    setError("");
    try{
      const headers={Authorization:`Bearer ${session.token}`};
      const [jobResponse,candidateResponse,flags]=await Promise.all([
        fetch("/api/v1/admin/jobs",{headers,cache:"no-store"}),
        fetch("/api/v1/admin/waitlist",{headers,cache:"no-store"}),
        getFeatureFlags(),
      ]);
      if(jobResponse.status===401||candidateResponse.status===401){setAccess("signed-out");return;}
      if(jobResponse.status===403||candidateResponse.status===403){setAccess("denied");return;}
      const [jobData,candidateData]=await Promise.all([jobResponse.json().catch(()=>({})),candidateResponse.json().catch(()=>({}))]);
      if(!jobResponse.ok||!candidateResponse.ok)throw new Error(jobData.error||candidateData.error||"Could not load admin data");
      setJobs(Array.isArray(jobData.jobs)?jobData.jobs:[]);setCandidates(Array.isArray(candidateData.entries)?candidateData.entries:[]);setFeatures(flags);setAccess("ready");
    }catch(cause){setError(cause instanceof Error?cause.message:"Could not load admin data");setAccess("error");}
  },[]);
  useEffect(()=>{void load();const timer=window.setInterval(()=>void load(),15000);return()=>window.clearInterval(timer);},[load]);
  const counts=useMemo(()=>({queued:jobs.filter(job=>job.status==="pending"&&job.ready_at).length,processing:jobs.filter(job=>job.status==="processing").length,completed:jobs.filter(job=>job.status==="completed").length,failed:jobs.filter(job=>job.status==="failed").length}),[jobs]);

  if(access!=="ready")return <section className="admin-access"><LockKeyhole/><span className="eyebrow">ADMIN ONLY</span><h1>{access==="denied"?"Access denied":access==="error"?"Admin data unavailable":"Administrator sign-in required"}</h1><p>{access==="denied"?"This account is signed in but is not configured as an administrator.":access==="error"?error:"Sign in with an email listed in ADMIN_EMAILS."}</p>{access==="loading"?<LoaderCircle className="spin"/>:access==="signed-out"?<button data-testid="admin-sign-in" className="primary-button" onClick={openAuthDialog}>Sign in</button>:<button data-testid="admin-retry" className="secondary-button" onClick={()=>void load()}><RefreshCw size={16}/>Retry</button>}</section>;

  return <section className="admin-dashboard"><header className="admin-heading"><div><span className="eyebrow">OPERATIONS</span><h1>FreeAIPPT admin</h1><p>Live task queue and trial candidates. Data refreshes every 15 seconds.</p></div><button data-testid="admin-refresh" className="secondary-button" onClick={()=>void load()}><RefreshCw size={16}/>Refresh</button></header>
    <div className="feature-flags"><strong>Feature flags</strong><span className={features?.task_submission?"enabled":"disabled"}>Task submission · {features?.task_submission?"ON":"OFF"}</span><span className={features?.waitlist?"enabled":"disabled"}>Trial waitlist · {features?.waitlist?"ON":"OFF"}</span></div>
    <div className="admin-stats"><article><ClipboardList/><span>Total tasks</span><strong>{jobs.length}</strong></article><article><Clock3/><span>Queued / active</span><strong>{counts.queued} / {counts.processing}</strong></article><article><span className="status-dot ready"/><span>Completed / failed</span><strong>{counts.completed} / {counts.failed}</strong></article><article><Users/><span>Trial candidates</span><strong>{candidates.length}</strong></article></div>
    <section className="admin-panel"><div className="admin-panel-title"><div><span className="eyebrow">TASK QUEUE</span><h2>Latest tasks</h2></div><span>{jobs.length} shown</span></div>{jobs.length===0?<p className="admin-empty">No tasks have been submitted.</p>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Created</th><th>User / prompt</th><th>Template</th><th>Status</th><th>Files</th><th>Attempts</th><th>Agent</th></tr></thead><tbody>{jobs.map(job=><tr key={job.id}><td>{new Date(job.created_at).toLocaleString()}</td><td><strong>{job.user_email||"Legacy / anonymous"}</strong><span title={job.prompt}>{job.prompt}</span>{job.error&&<em>{job.error}</em>}</td><td>{job.template_slug||"—"}</td><td><span className={`admin-status ${job.status}`}>{job.status==="pending"&&!job.ready_at?"uploading":job.status}</span></td><td>{job.input_count}</td><td>{job.attempts}/{job.max_attempts}</td><td>{job.agent_id||"—"}</td></tr>)}</tbody></table></div>}</section>
    <section className="admin-panel"><div className="admin-panel-title"><div><span className="eyebrow">EARLY ACCESS</span><h2>Trial candidates</h2></div><span>{candidates.length} shown</span></div>{candidates.length===0?<p className="admin-empty">No candidates have registered.</p>:<div className="admin-table-wrap"><table className="admin-table candidates"><thead><tr><th>Registered</th><th>Email</th><th>Source</th><th>Locale</th></tr></thead><tbody>{candidates.map(entry=><tr key={entry.id}><td>{new Date(entry.created_at).toLocaleString()}</td><td><strong>{entry.email}</strong></td><td>{entry.source}</td><td>{entry.locale}</td></tr>)}</tbody></table></div>}</section>
  </section>;
}
