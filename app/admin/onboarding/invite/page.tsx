import Link from "next/link";
import {accountLabels,invitationTypes} from "@/lib/portal/config";
import {inviteSupplier} from "@/app/actions/admin-accounts";
import SubmitButton from "@/app/admin/components/submit-button";
const errors:Record<string,string>={invalid:"Check the contact details and choose an eligible partner type.",configuration:"Email invitations are not configured.",invite:"The invitation failed. This address may already have an account.",profile:"Invitation was sent but account setup needs attention."};
export default async function InvitePartner({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const p=await searchParams;
 return <main className="an-console">
  <Link className="an-rail-link" href="/admin/onboarding">← Back to applications</Link>
  <header className="an-console-intro" style={{marginTop:18}}><div>
   <span className="an-console-overline">ANIME / NEW PARTNER</span>
   <h1>Invite an anime partner</h1><p>Licensing partners and lead production companies are invited by the Anime team.</p>
  </div></header>
  {p.error&&<p className="an-console-message" role="alert">{errors[p.error]??"Invitation could not be completed."}</p>}
  <section className="an-people-stage admin-work-detail" style={{marginTop:22}}>
   <h2>Invitation details</h2><p>The partner receives an email to set up their own account and complete their application.</p>
   <form action={inviteSupplier} className="admin-work-review">
    <label>Contact name<input name="display_name" minLength={2} maxLength={80} required/></label>
    <label>Contact email<input name="email" type="email" maxLength={254} required/></label>
    <label>Partner category<select name="account_type" required defaultValue="">
     <option value="" disabled>Choose a category</option>
     {invitationTypes.map(t=><option key={t} value={t}>{accountLabels[t]??t}</option>)}
    </select></label>
    <label>Initial partnership message<textarea name="message" rows={6} minLength={40} maxLength={3000} required
     placeholder="Introduce your team, explain the licensing or production proposal, and invite a discussion."/></label>
    <p className="sr-note">This becomes the first private message. The Supabase invitation email template determines whether the message also appears in email.</p>
    <SubmitButton label="Send invitation" pendingLabel="Sending invitation..."/>
   </form>
  </section>
 </main>;
}
