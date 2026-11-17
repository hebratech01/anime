import Link from "next/link";
import InviteForm from "./invite-form";
import {inviteErrors} from "@/lib/supplier-invite";
export default async function InviteSupplierPage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const p=await searchParams;
 return <main className="an-console">
  <Link className="an-rail-link" href="/admin/relations">← Back to Supplier Invitations &amp; Messages</Link>
  <header className="an-console-intro" style={{marginTop:18}}><div>
   <span className="an-console-overline">ANIME / EMAIL INVITATION</span>
   <h1>Invite a supplier</h1><p>Email an invitation and an opening message to an anime rights supplier or a lead production company.</p>
  </div></header>
  {p.error&&<p className="an-console-message" role="alert">{p.error==="profile"?inviteErrors.setup:inviteErrors.unavailable}</p>}
  <section className="an-people-stage admin-work-detail" style={{marginTop:22}}>
   <h2>Invitation details</h2><p>The recipient can reply privately before deciding whether to accept. They submit a separate supplier application after setting up their account.</p>
    <InviteForm/>
  </section>
 </main>;
}
