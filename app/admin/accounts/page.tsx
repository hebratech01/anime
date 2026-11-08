import Link from "next/link";
import {loadDirectory,directoryUrl} from "@/lib/admin/directory";
import {inviteSupplier,reviewSupplier} from "@/app/actions/admin-accounts";

const notices:Record<string,string>={invited:"Partner invitation sent.",reviewed:"Partner application updated."};
const errors:Record<string,string>={invalid:"Check the information entered.",configuration:"Partner invitations are not configured.",invite:"Could not send the invitation.",profile:"Invitation sent, but account setup needs attention.",database:"Could not save the review.",protected:"Staff accounts are managed separately.",missing:"Account not found."};
const types=[["all","All people"],["subscriber","Subscribers"],["licensor","Licensing partners"],["prime_producer","Lead production companies"]];
const copy:Record<string,string>={subscriber:"Subscriber",licensor:"Licensing partner",prime_producer:"Lead production company"};
const states:Record<string,string>={pending:"Awaiting review",needs_info:"Needs more information",verified:"Applicant verified",rejected:"Declined",suspended:"Application suspended"};
export default async function AnimePeople({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const p=await searchParams;
 const d=await loadDirectory(p);
 return <main className="an-console">
  <header className="an-console-intro">
   <div><span className="an-console-overline">LOXADA ANIME · ADMIN</span><h1>Audience &amp; production partners</h1>
    <p>Manage subscriber access, streaming licensors, and companies coordinating original anime production.</p></div>
   <div className="an-console-counter"><strong>{d.total}</strong><span>accounts in this view</span></div>
  </header>
  {d.error&&<p role="alert" className="an-console-message">{d.error}</p>}
  {p.error&&<p role="alert" className="an-console-message">{errors[p.error]??"Could not finish that request."}</p>}
  {p.notice&&<p role="status" className="an-console-message">{notices[p.notice]??""}</p>}
  <div className="an-console-tabs" role="navigation" aria-label="Choose account category">
   {types.map(([key,label])=><Link key={key} href={directoryUrl({...d,role:key},1)} aria-current={d.role===key?"page":undefined}>{label}</Link>)}
  </div>
  <div className="an-console-grid">
   <section className="an-people-stage">
    <header><h2>People</h2><span>Showing page {d.page} of {d.pages}</span></header>
    <form className="an-controls" action="/admin/accounts" method="get">
     <input type="hidden" name="role" value={d.role}/>
     <label>Search by name<input type="search" name="q" defaultValue={d.q} placeholder="Find a subscriber or partner" maxLength={60}/></label>
     <label>Sign-in access<select name="status" defaultValue={d.status}>
      <option value="all">All accounts</option><option value="active">Allowed</option><option value="suspended">Suspended</option>
     </select></label>
     <button type="submit">Search</button>
    </form>
    <div className="an-person-list">{d.people.map(person=><article className="an-person" key={person.user_id}>
     <div className="an-person-mark" aria-hidden="true">{person.display_name.slice(0,1).toUpperCase()}</div>
     <div className="an-person-info"><strong>{person.display_name}</strong><small>{copy[person.account_type]??person.account_type} · Joined {new Date(person.created_at).toLocaleDateString("en-PH")}</small></div>
     <div className="an-person-actions"><span className={person.status==="active"?"an-access-ok":"an-access-off"}>{person.status==="active"?"Sign-in allowed":"Suspended"}</span>
      <Link href={"/admin/accounts/"+person.user_id}>View account</Link></div>
    </article>)}</div>
    {!d.people.length&&!d.error&&<p className="an-console-empty">No matching subscribers or partners.</p>}
    <nav aria-label="Account pages" className="an-console-pager">
     {d.page>1?<Link href={directoryUrl(d,d.page-1)}>← Previous</Link>:<span/>}
     <span>Page {d.page} / {d.pages}</span>
     {d.page<d.pages?<Link href={directoryUrl(d,d.page+1)}>Next →</Link>:<span/>}
    </nav>
   </section>
   <aside className="an-console-rail">
    <section className="an-rail-card">
     <span className="an-console-overline">PARTNER ACCESS</span><h2>Invite a company</h2>
     <p>Streaming-rights holders and lead production companies join by invitation.</p>
     <details><summary>New partner invitation</summary>
      <form className="an-rail-form" action={inviteSupplier}>
       <label>Contact name<input name="display_name" minLength={2} maxLength={80} required/></label>
       <label>Contact email<input name="email" type="email" maxLength={254} required/></label>
       <label>Partner type<select name="account_type" required>
        <option value="licensor">Anime licensing partner</option>
        <option value="prime_producer">Lead production company</option>
       </select></label>
       <button type="submit">Send invitation</button>
      </form>
     </details>
    </section>
    <section className="an-rail-card">
     <span className="an-console-overline">PARTNER REVIEW</span><h2>Applications</h2>
     <p>{d.pending} of the latest {d.requests.length} applications await a review or more information.</p>
     {!d.requests.length&&<p className="an-console-empty">No applications received.</p>}
     {d.requests.map(req=><details className="an-request" key={req.id}>
      <summary><span><strong>{req.legal_name}</strong><small>{states[req.status]??req.status}</small></span><span aria-hidden="true">+</span></summary>
      <p>{req.organization_name??"Independent applicant"} · {req.contact_email}</p>
      <p className="an-request-statement">{req.capability_statement}</p>
      {req.reviewer_feedback&&<p><strong>Last message:</strong> {req.reviewer_feedback}</p>}
      <Link href={"/admin/accounts/"+req.user_id} className="an-rail-link">View partner account</Link>
      <form className="an-rail-form" action={reviewSupplier}>
       <input type="hidden" name="application_id" value={req.id}/>
       <label>Review decision<select name="status" defaultValue="needs_info">
        <option value="verified">Verify applicant</option><option value="needs_info">Request more details</option>
        <option value="rejected">Decline application</option><option value="suspended">Suspend application</option>
       </select></label>
       <label>Feedback<input name="reviewer_feedback" maxLength={1000} placeholder="Required unless verified"/></label>
       <button type="submit">Save review</button>
      </form>
     </details>)}
    </section>
   </aside>
  </div>
 </main>;
}
