import Link from "next/link";
import InviteForm from "./invite-form";
import {inviteErrors} from "@/lib/supplier-invite";
export default async function InvitePartner({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const p=await searchParams;
 return <main className="an-console">
  <Link className="an-rail-link" href="/admin/onboarding">← Back to applications</Link>
  <header className="an-console-intro" style={{marginTop:18}}><div>
   <span className="an-console-overline">ANIME / NEW PARTNER</span>
   <h1>Invite an anime partner</h1><p>Licensing partners and lead production companies are invited by the Anime team.</p>
  </div></header>
  {p.error&&<p className="an-console-message" role="alert">{p.error==="profile"?inviteErrors.setup:inviteErrors.unavailable}</p>}
  <section className="an-people-stage admin-work-detail" style={{marginTop:22}}>
   <h2>Invitation details</h2><p>The partner receives an email to set up their own account and complete their application.</p>
    <InviteForm/>
  </section>
 </main>;
}
