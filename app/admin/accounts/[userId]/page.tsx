import Link from "next/link";
import {loadAccount} from "@/lib/admin/account-detail";
import {renameAccount,setAccountStatus,sendRecoveryEmail} from "@/app/actions/admin-account-controls";

const roles:Record<string,string>={subscriber:"Subscriber",licensor:"Anime licensing partner",prime_producer:"Lead production company"};
const messages:Record<string,string>={renamed:"Display name saved.",unchanged:"No changes made.",suspended:"Sign-in access suspended.",reactivated:"Sign-in access restored.",recovery:"Password recovery email requested.",recovery_unlogged:"Recovery email requested, but the activity record was not saved."};
const errors:Record<string,string>={invalid:"Check the display name.",changed:"Account changed. Refresh and review its current state.",reason:"Enter a reason of 8–500 characters and confirm.",configuration:"Email recovery is not configured.",database:"Could not save changes.",email:"Could not send recovery email.",cooldown:"A recovery email was sent recently."};
const reviews:Record<string,string>={pending:"Awaiting review",needs_info:"More information needed",verified:"Applicant verified",rejected:"Declined",suspended:"Application suspended"};
export default async function AnimeAccount({params,searchParams}:{params:Promise<{userId:string}>;searchParams:Promise<Record<string,string|undefined>>}){
 const {userId}=await params;
 const {account,authUser,history,application}=await loadAccount(userId);
 const p=await searchParams;
 return <main className="an-member">
  <Link className="an-back-link" href="/admin/accounts">← Audience &amp; partners</Link>
  <header className="an-member-hero"><div>
   <span className="an-console-overline">ANIME / ACCOUNT PROFILE</span>
   <h1>{account.display_name}</h1><p>{roles[account.account_type]??account.account_type}</p>
   <small>{authUser?.email??"Email unavailable"}</small></div>
   <span className={account.status==="active"?"an-access-ok":"an-access-off"}>{account.status==="active"?"Sign-in allowed":"Suspended"}</span>
  </header>
  {p.notice&&<p role="status" className="an-console-message">{messages[p.notice]??""}</p>}
  {p.error&&<p role="alert" className="an-console-message">{errors[p.error]??"Could not complete the action."}</p>}
  <div className="an-member-columns">
   <section className="an-member-main">
    <div className="an-member-panel"><h2>Account overview</h2>
     <dl className="an-member-stats"><div><dt>Joined</dt><dd>{new Date(account.created_at).toLocaleDateString("en-PH")}</dd></div>
      <div><dt>Email</dt><dd>{authUser?.email_confirmed_at?"Verified":"Not verified"}</dd></div>
      <div><dt>Last sign-in</dt><dd>{authUser?.last_sign_in_at?new Date(authUser.last_sign_in_at).toLocaleDateString("en-PH"):"Not recorded"}</dd></div>
     </dl>
     <form className="an-member-form" action={renameAccount}>
      <input type="hidden" name="user_id" value={userId}/>
      <label>Account display name<input name="display_name" defaultValue={account.display_name} minLength={2} maxLength={80} required/></label>
      <button type="submit">Save name</button>
     </form>
    </div>
    {application&&<div className="an-member-panel"><h2>Partner application</h2>
     <p>{application.legal_name} · {reviews[application.status]??application.status}</p>
     {application.reviewer_feedback&&<p>Review notes: {application.reviewer_feedback}</p>}
     <p className="an-member-muted">Partner verification does not approve streaming rights or authorize production work.</p>
     <Link href="/admin/accounts" className="an-rail-link">Open partner review queue</Link>
    </div>}
    <div className="an-member-panel"><h2>Account activity</h2>
     {!history.length&&<p>No account changes have been recorded.</p>}
     <ol className="an-member-timeline">{history.map(h=><li key={h.id}>
      <strong>{({account_suspended:"Account suspended",account_reactivated:"Account reactivated",display_name_changed:"Name updated",recovery_email_sent:"Recovery email requested"} as Record<string,string>)[h.action]??h.action}</strong>
      <small>{new Date(h.created_at).toLocaleString("en-PH")}</small>{h.note&&<p>{h.note}</p>}
     </li>)}</ol>
    </div>
   </section>
   <aside className="an-member-right">
    <section className="an-member-panel"><h2>Sign-in access</h2>
     <p>Only sign-in access is affected. Subscription billing and title licensing are separate processes.</p>
     {account.status==="suspended"&&<p><strong>Reason:</strong> {account.suspension_reason}</p>}
     <form className="an-member-form" action={setAccountStatus}>
      <input type="hidden" name="user_id" value={userId}/>
      <input type="hidden" name="expected_status" value={account.status}/>
      {account.status==="active"?<><input type="hidden" name="status" value="suspended"/>
       <label>Reason<textarea name="reason" rows={3} minLength={8} maxLength={500} required/></label>
       <label className="an-check"><input type="checkbox" name="confirm" required/> Suspend this account's sign-in access.</label>
       <button className="an-danger" type="submit">Suspend sign-in</button>
      </>:<><input type="hidden" name="status" value="active"/><button type="submit">Restore sign-in</button></>}
     </form>
    </section>
    <section className="an-member-panel"><h2>Password help</h2><p>Email the person a secure reset link. Their existing password is never shown.</p>
     <form action={sendRecoveryEmail}><input type="hidden" name="user_id" value={userId}/><button disabled={!authUser?.email} type="submit">Send password reset</button></form>
    </section>
   </aside>
  </div>
 </main>;
}
