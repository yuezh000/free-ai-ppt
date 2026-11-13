"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, ClipboardList, Clock3, FileText, Globe2, Layers3, LoaderCircle, LockKeyhole, RefreshCw, Tags, Users } from "lucide-react";
import { openAuthDialog, readAuthSession } from "@/lib/client-auth";
import { getFeatureFlags, type FeatureFlags } from "@/lib/features";
import type { ResourcePageStats } from "@/lib/resource-page-stats";

type AdminJob = { id:string; prompt:string; status:string; ready_at:string|null; agent_id:string|null; lease_until:string|null; attempts:number; max_attempts:number; error:string|null; created_at:string; updated_at:string; completed_at:string|null; user_email:string|null; input_count:number; template_slug:string|null };
type Candidate = { id:string; email:string; source:string; locale:string; created_at:string; updated_at:string };
type AdminUser = { id:string; email:string; created_at:string; granted:number; used:number };
type Access = "loading"|"signed-out"|"denied"|"ready"|"error";

export function AdminDashboard({resourceStats}:{resourceStats:ResourcePageStats}) {
  const [jobs,setJobs]=useState<AdminJob[]>([]),[candidates,setCandidates]=useState<Candidate[]>([]),[users,setUsers]=useState<AdminUser[]>([]),[userTotal,setUserTotal]=useState(0),[features,setFeatures]=useState<FeatureFlags|null>(null),[access,setAccess]=useState<Access>("loading"),[error,setError]=useState("");
  const [userSearch,setUserSearch]=useState(""),[query,setQuery]=useState(""),[userPage,setUserPage]=useState(1);
  const [grantUser,setGrantUser]=useState<AdminUser|null>(null),[grantPages,setGrantPages]=useState(10),[grantNote,setGrantNote]=useState(""),[grantBusy,setGrantBusy]=useState(false),[grantMessage,setGrantMessage]=useState("");
  const load=useCallback(async()=>{
    const session=readAuthSession();
    if(!session){setAccess("signed-out");return;}
    setError("");
    try{
      const headers={Authorization:`Bearer ${session.token}`};
      const [jobResponse,candidateResponse,userResponse,flags]=await Promise.all([
        fetch("/api/v1/admin/jobs",{headers,cache:"no-store"}),
        fetch("/api/v1/admin/waitlist",{headers,cache:"no-store"}),
        fetch(`/api/v1/admin/users?q=${encodeURIComponent(query)}&page=${userPage}`,{headers,cache:"no-store"}),
        getFeatureFlags(),
      ]);
      if(jobResponse.status===401||candidateResponse.status===401||userResponse.status===401){setAccess("signed-out");return;}
      if(jobResponse.status===403||candidateResponse.status===403||userResponse.status===403){setAccess("denied");return;}
      const [jobData,candidateData,userData]=await Promise.all([jobResponse.json().catch(()=>({})),candidateResponse.json().catch(()=>({})),userResponse.json().catch(()=>({}))]);
      if(!jobResponse.ok||!candidateResponse.ok||!userResponse.ok)throw new Error(jobData.error||candidateData.error||userData.error||"Could not load admin data");
      setJobs(Array.isArray(jobData.jobs)?jobData.jobs:[]);setCandidates(Array.isArray(candidateData.entries)?candidateData.entries:[]);setUsers(Array.isArray(userData.users)?userData.users:[]);setUserTotal(Number(userData.total)||0);setFeatures(flags);setAccess("ready");
    }catch(cause){setError(cause instanceof Error?cause.message:"Could not load admin data");setAccess("error");}
  },[query,userPage]);
  useEffect(()=>{void load();const timer=window.setInterval(()=>void load(),15000);return()=>window.clearInterval(timer);},[load]);
  const counts=useMemo(()=>({queued:jobs.filter(job=>job.status==="pending"&&job.ready_at).length,processing:jobs.filter(job=>job.status==="processing").length,completed:jobs.filter(job=>job.status==="completed").length,failed:jobs.filter(job=>job.status==="failed").length}),[jobs]);
  const submitGrant=async(event:React.FormEvent)=>{event.preventDefault();if(!grantUser||!Number.isInteger(grantPages)||grantPages<1||grantPages>1000)return;const session=readAuthSession();if(!session)return;setGrantBusy(true);setGrantMessage("");try{const response=await fetch(`/api/v1/admin/users/${encodeURIComponent(grantUser.id)}/page-grants`,{method:"POST",headers:{Authorization:`Bearer ${session.token}`,"Content-Type":"application/json"},body:JSON.stringify({pages:grantPages,note:grantNote.trim()||null})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||"Could not add pages");setGrantMessage(`Added ${grantPages} pages to ${grantUser.email}.`);setGrantUser(null);setGrantNote("");await load();}catch(cause){setGrantMessage(cause instanceof Error?cause.message:"Could not add pages");}finally{setGrantBusy(false);}};

  if(access!=="ready")return <section className="admin-access"><LockKeyhole/><span className="eyebrow">ADMIN ONLY</span><h1>{access==="denied"?"Access denied":access==="error"?"Admin data unavailable":"Administrator sign-in required"}</h1><p>{access==="denied"?"This account is signed in but is not configured as an administrator.":access==="error"?error:"Sign in with an email listed in ADMIN_EMAILS."}</p>{access==="loading"?<LoaderCircle className="spin"/>:access==="signed-out"?<button data-testid="admin-sign-in" className="primary-button" onClick={openAuthDialog}>Sign in</button>:<button data-testid="admin-retry" className="secondary-button" onClick={()=>void load()}><RefreshCw size={16}/>Retry</button>}</section>;

  return <section className="admin-dashboard"><header className="admin-heading"><div><span className="eyebrow">OPERATIONS</span><h1>FreeAIPPT admin</h1><p>Registered users, task queue, trial candidates, and published resources. Operational data refreshes every 15 seconds.</p></div><button data-testid="admin-refresh" className="secondary-button" onClick={()=>void load()}><RefreshCw size={16}/>Refresh</button></header>
    <div className="feature-flags"><strong>Feature flags</strong><span className={features?.task_submission?"enabled":"disabled"}>Task submission · {features?.task_submission?"ON":"OFF"}</span><span className={features?.waitlist?"enabled":"disabled"}>Trial waitlist · {features?.waitlist?"ON":"OFF"}</span></div>
    <div className="admin-stats"><article><ClipboardList/><span>Total tasks</span><strong>{jobs.length}</strong></article><article><Clock3/><span>Queued / active</span><strong>{counts.queued} / {counts.processing}</strong></article><article><span className="status-dot ready"/><span>Completed / failed</span><strong>{counts.completed} / {counts.failed}</strong></article><article><Users/><span>Trial candidates</span><strong>{candidates.length}</strong></article></div>
    <section className="admin-panel admin-resource-panel" data-testid="admin-resource-stats"><div className="admin-panel-title"><div><span className="eyebrow">SEO CONTENT</span><h2>Resource page inventory</h2></div><span>Build-time count</span></div>
      <div className="admin-resource-stats">
        <article data-testid="admin-resource-primary"><FileText/><span>Primary resource pages</span><strong>{resourceStats.primaryResourcePages}</strong><small>Canonical English pages</small></article>
        <article data-testid="admin-resource-indexed"><Globe2/><span>Indexable resource urls</span><strong>{resourceStats.indexedResourceUrls}</strong><small>Across {resourceStats.languageCount} languages</small></article>
        <article data-testid="admin-resource-templates"><Layers3/><span>Original templates</span><strong>{resourceStats.templateCount}</strong><small>Editable PPTX resources</small></article>
        <article data-testid="admin-resource-categories"><Tags/><span>Template categories</span><strong>{resourceStats.categoryCount}</strong><small>Focused search intents</small></article>
        <article data-testid="admin-resource-guides"><BookOpen/><span>Published guides</span><strong>{resourceStats.guideCount}</strong><small>Plus the resource hub</small></article>
      </div>
      <div className="admin-table-wrap"><table className="admin-table resource-breakdown-table"><thead><tr><th>Resource type</th><th>Primary pages</th><th>Localized pages</th><th>Indexed URLs</th></tr></thead><tbody>{resourceStats.breakdown.map(item=><tr data-testid={`admin-resource-row-${item.key}`} key={item.key}><td><strong>{item.label}</strong></td><td>{item.primary}</td><td>{item.localized}</td><td><strong>{item.indexed}</strong></td></tr>)}</tbody><tfoot><tr><td><strong>All resource pages</strong></td><td>{resourceStats.primaryResourcePages}</td><td>{resourceStats.localizedResourcePages}</td><td><strong>{resourceStats.indexedResourceUrls}</strong></td></tr></tfoot></table></div>
      <p className="admin-resource-note"><Globe2/> Sitemap total: <strong>{resourceStats.sitemapUrls}</strong> URLs — {resourceStats.indexedResourceUrls} resource URLs and {resourceStats.utilityUrls} home/pricing URLs.</p>
    </section>
    <section className="admin-panel" data-testid="admin-users-panel"><div className="admin-panel-title"><div><span className="eyebrow">ACCOUNTS</span><h2>Registered users</h2></div><span data-testid="admin-users-total">{userTotal} total</span></div>
      <form className="admin-user-search" onSubmit={event=>{event.preventDefault();setUserPage(1);setQuery(userSearch.trim());}}><input data-testid="admin-user-search" value={userSearch} onChange={event=>setUserSearch(event.target.value)} placeholder="Search by email" aria-label="Search users by email" maxLength={120}/><button data-testid="admin-user-search-submit" type="submit" className="secondary-button">Search</button></form>
      {users.length===0?<p className="admin-empty">No registered users match this search.</p>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Registered</th><th>Email</th><th>Used</th><th>Granted</th><th>Remaining</th><th>Action</th></tr></thead><tbody>{users.map(user=><tr key={user.id} data-testid={`admin-user-${user.id}`}><td>{new Date(user.created_at).toLocaleString()}</td><td><strong>{user.email}</strong></td><td>{user.used}</td><td>{user.granted}</td><td>{Math.max(0,10+user.granted-user.used)}</td><td><button data-testid={`admin-user-${user.id}-grant`} type="button" className="secondary-button" onClick={()=>{setGrantUser(user);setGrantPages(10);setGrantNote("");setGrantMessage("");}}>Add pages</button></td></tr>)}</tbody></table></div>}
      <div className="admin-user-pagination"><button data-testid="admin-users-previous" type="button" disabled={userPage===1} onClick={()=>setUserPage(page=>page-1)}>Previous</button><span>Page {userPage} of {Math.max(1,Math.ceil(userTotal/50))}</span><button data-testid="admin-users-next" type="button" disabled={userPage*50>=userTotal} onClick={()=>setUserPage(page=>page+1)}>Next</button></div>
      {grantUser&&<form className="admin-grant-form" onSubmit={submitGrant}><strong>Add pages for {grantUser.email}</strong><label>Pages<input data-testid="admin-grant-pages" type="number" min="1" max="1000" step="1" required value={grantPages} onChange={event=>setGrantPages(Number(event.target.value))}/></label><label>Reason (optional)<input data-testid="admin-grant-note" maxLength={500} value={grantNote} onChange={event=>setGrantNote(event.target.value)}/></label><div><button data-testid="admin-grant-submit" type="submit" className="primary-button" disabled={grantBusy}>Confirm pages</button><button data-testid="admin-grant-cancel" type="button" className="secondary-button" onClick={()=>setGrantUser(null)}>Cancel</button></div></form>}
      {grantMessage&&<p data-testid="admin-grant-message" role="status">{grantMessage}</p>}
    </section>
    <section className="admin-panel"><div className="admin-panel-title"><div><span className="eyebrow">TASK QUEUE</span><h2>Latest tasks</h2></div><span>{jobs.length} shown</span></div>{jobs.length===0?<p className="admin-empty">No tasks have been submitted.</p>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Created</th><th>User / prompt</th><th>Template</th><th>Status</th><th>Files</th><th>Attempts</th><th>Agent</th></tr></thead><tbody>{jobs.map(job=><tr key={job.id}><td>{new Date(job.created_at).toLocaleString()}</td><td><strong>{job.user_email||"Legacy / anonymous"}</strong><span title={job.prompt}>{job.prompt}</span>{job.error&&<em>{job.error}</em>}</td><td>{job.template_slug||"—"}</td><td><span className={`admin-status ${job.status}`}>{job.status==="pending"&&!job.ready_at?"uploading":job.status}</span></td><td>{job.input_count}</td><td>{job.attempts}/{job.max_attempts}</td><td>{job.agent_id||"—"}</td></tr>)}</tbody></table></div>}</section>
    <section className="admin-panel"><div className="admin-panel-title"><div><span className="eyebrow">EARLY ACCESS</span><h2>Trial candidates</h2></div><span>{candidates.length} shown</span></div>{candidates.length===0?<p className="admin-empty">No candidates have registered.</p>:<div className="admin-table-wrap"><table className="admin-table candidates"><thead><tr><th>Registered</th><th>Email</th><th>Source</th><th>Locale</th></tr></thead><tbody>{candidates.map(entry=><tr key={entry.id}><td>{new Date(entry.created_at).toLocaleString()}</td><td><strong>{entry.email}</strong></td><td>{entry.source}</td><td>{entry.locale}</td></tr>)}</tbody></table></div>}</section>
  </section>;
}
