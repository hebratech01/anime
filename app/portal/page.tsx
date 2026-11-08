import {signOut} from "@/app/actions/auth";
import {submitSupplierApplication} from "@/app/actions/onboarding";
import {requirePortal} from "@/lib/auth/authorization";
import {isSupplier} from "@/lib/portal/config";

const states:Record<string,string>={pending:"Submitted for review",needs_info:"More information requested",verified:"Applicant verified",rejected:"Application declined",suspended:"Application suspended"};
const errors:Record<string,string>={unauthorized:"This account cannot apply as a partner.",invalid:"Please check the application details.",database:"Could not save the application.",locked:"This application is already under review."};
export default async function AnimePortal({searchParams}:{searchParams:Promise<{error?:string;notice?:string}>}){
 const {user,account,db}=await requirePortal();
 const p=await searchParams;
 const type=account.account_type;
 const supplier=isSupplier(type);
 const {data:app,error:appError}=supplier
  ? await db.from("supplier_applications").select("status,legal_name,organization_name,contact_email,capability_statement,reviewer_feedback").eq("user_id",user.id).maybeSingle()
  : {data:null,error:null};
 const editable=supplier&&(!app||app.status==="needs_info");
 const role=type==="licensor"?"Anime licensing partner":type==="prime_producer"?"Lead production company":"Subscriber";
 return <main className="an-customer-portal"><div className="an-portal-wrap">
  <header className="an-portal-head"><strong>LOXADA / ANIME</strong><form action={signOut}><button type="submit">Sign out</button></form></header>
  <section className="an-portal-hero"><span className="an-console-overline">{supplier?"PRODUCTION & RIGHTS / PARTNER PORTAL":"SUBSCRIBER PORTAL"}</span>
   <h1>{supplier?"Partner account":"Welcome, "+account.display_name}</h1>
   <p>{supplier?"Provide your company details for review. A verified application alone does not grant streaming rights or authorize any production work.":"Your subscriber profile is ready. Streaming plans, billing and a rights-cleared catalog are separate services that are not available on this temporary account page."}</p>
  </section>
  {p.error&&<p className="an-console-message" role="alert">{errors[p.error]??"Unable to complete request."}</p>}
  {p.notice==="submitted"&&<p className="an-console-message" role="status">Application sent for partner review.</p>}
  {appError&&<p className="an-console-message" role="alert">Could not load the partner application.</p>}
  <div className="an-portal-grid">
   <section className="an-portal-panel">
    {supplier
     ? <><h2>{type==="licensor"?"Streaming license application":"Lead producer application"}</h2>
       <p>{type==="licensor"?"For organizations offering licensed anime and streaming distribution rights.":"For lead production companies coordinating studios and delivering commissioned anime."}</p>
       {app&&<p className="an-status-note">Status: {states[app.status]??app.status}</p>}
       {app?.reviewer_feedback&&<p>Reviewer feedback: {app.reviewer_feedback}</p>}
       {editable
        ? <form action={submitSupplierApplication}>
          <label>Authorized contact name<input name="legal_name" minLength={2} maxLength={160} defaultValue={app?.legal_name??""} required/></label>
          <label>Company name (if applicable)<input name="organization_name" minLength={2} maxLength={160} defaultValue={app?.organization_name??""}/></label>
          <label>Contact email<input name="contact_email" type="email" maxLength={254} defaultValue={app?.contact_email??user.email??""} required/></label>
          <label>{type==="licensor"?"Describe the anime rights or catalog your company represents":"Describe the production services and coordination your company offers"}
           <textarea name="capability_statement" rows={5} minLength={20} maxLength={3000} defaultValue={app?.capability_statement??""} required/></label>
          <label className="an-portal-check"><input type="checkbox" name="affirmed" required/> These details are accurate. I understand that supporting evidence may be requested.</label>
          <button type="submit">{app?"Resubmit details":"Submit partner application"}</button>
         </form>
        : <p>Your application is not editable at its current review stage.</p>}
       </>
     : <><h2>Your subscriber profile</h2><p>Your account is active and separate from Manga readers and Merchandise buyers.</p>
        <p>No subscription plan has been purchased or activated by creating this account.</p></>}
   </section>
   <aside className="an-portal-panel an-portal-meta"><span className="an-console-overline">ACCOUNT</span>
    <h2>{account.display_name}</h2><p>{role}</p><p>{user.email}</p>
    <p>{supplier?"Partner verification comes first. Rights clearance, signed contracts and content acceptance are separate.":"You can use this account to sign in. Subscription billing and playback will be added when available."}</p>
   </aside>
  </div>
 </div></main>;
}
