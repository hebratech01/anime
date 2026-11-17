import SubmitButton from "@/app/admin/components/submit-button";
import Form from "next/form";
import Link from "next/link";
import {accountLabels} from "@/lib/portal/config";
import {loadDirectory,directoryUrl} from "@/lib/admin/directory";

const notices:Record<string,string>={invited:"Supplier invitation sent.",reviewed:"Supplier application updated."};
const errors:Record<string,string>={invalid:"Check the information entered.",configuration:"Supplier invitations are not configured.",invite:"Could not send the invitation.",profile:"Invitation sent, but account setup needs attention.",database:"Could not save the review.",protected:"Staff accounts are managed separately.",missing:"Account not found."};
const types=[["all","All people"],["subscriber","Subscribers"],["licensor","Anime rights suppliers"],["prime_producer","Lead production companies"]];
const copy:Record<string,string>={subscriber:"Subscriber",licensor:"Anime rights supplier",prime_producer:"Lead production company"};
export default async function AnimePeople({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const p=await searchParams;
 const d=await loadDirectory(p);
 return <main className="an-console">
  <header className="an-console-intro">
   <div><span className="an-console-overline">LOXADA ANIME · ADMIN</span><h1>Account Access</h1>
    <p>Find subscribers, anime rights suppliers, and lead production companies. Manage sign-in access and password recovery.</p></div>
   <div className="an-console-counter"><strong>{d.total}</strong><span>accounts in this view</span></div>
  </header>
  <div className="ac-account-filter"><Link className="sr-link" href="/admin/supplier-activity/accounts">Account Analysis →</Link>
   {d.period||d.roles.length?<><span>Cube filters: {[d.period&&("Registered "+d.period),d.roles.map(role=>accountLabels[role]??role).join(", ")].filter(Boolean).join(" · ")}</span>
    <Link className="sr-link" href={directoryUrl({...d,period:"",roles:[]},1)}>Clear cube filters</Link></>:null}
  </div>
  {d.error&&<p role="alert" className="an-console-message">{d.error}</p>}
  {p.error&&<p role="alert" className="an-console-message">{errors[p.error]??"Could not finish that request."}</p>}
  {p.notice&&<p role="status" className="an-console-message">{notices[p.notice]??""}</p>}
  <div className="an-console-tabs" role="navigation" aria-label="Choose account category">
   {types.map(([key,label])=><Link key={key} href={directoryUrl({...d,role:key,roles:[]},1)} aria-current={d.role===key&&!d.roles.length?"page":undefined}>{label}</Link>)}
  </div>
  <div className="an-console-grid an-account-only">
   <section className="an-people-stage">
    <header><h2>Accounts</h2><span>Showing page {d.page} of {d.pages}</span></header>
    <Form className="an-controls" action="/admin/accounts">
     <input type="hidden" name="role" value={d.role}/>
     {d.roles.length?<input type="hidden" name="roles" value={d.roles.join(",")}/>:null}
     {d.period?<input type="hidden" name="period" value={d.period}/>:null}
     <label>Search by name<input type="search" name="q" defaultValue={d.q} placeholder="Find an account" maxLength={60}/></label>
     <label>Sign-in access<select name="status" defaultValue={d.status}>
      <option value="all">All accounts</option><option value="active">Allowed</option><option value="suspended">Suspended</option>
     </select></label>
     <SubmitButton label="Search" pendingLabel="Searching..."/>
    </Form>
    <div className="an-person-list">{d.people.map(person=><article className="an-person" key={person.user_id}>
     <div className="an-person-mark" aria-hidden="true">{person.display_name.slice(0,1).toUpperCase()}</div>
     <div className="an-person-info"><strong>{person.display_name}</strong><small>{copy[person.account_type]??person.account_type} · Joined {new Date(person.created_at).toLocaleDateString("en-PH")}</small></div>
     <div className="an-person-actions"><span className={person.status==="active"?"an-access-ok":"an-access-off"}>{person.status==="active"?"Sign-in allowed":"Suspended"}</span>
      <Link href={"/admin/accounts/"+person.user_id}>Manage account</Link></div>
    </article>)}</div>
    {!d.people.length&&!d.error&&<p className="an-console-empty">No matching accounts.</p>}
    <nav aria-label="Account pages" className="an-console-pager">
     {d.page>1?<Link href={directoryUrl(d,d.page-1)}>← Previous</Link>:<span/>}
     <span>Page {d.page} / {d.pages}</span>
     {d.page<d.pages?<Link href={directoryUrl(d,d.page+1)}>Next →</Link>:<span/>}
    </nav>
   </section>
   
  </div>
 </main>;
}
