import SupplierPanel from "@/app/components/supplier-panel";
import {signOut} from "@/app/actions/auth";
import {requirePortal} from "@/lib/auth/authorization";
import {isSupplier} from "@/lib/portal/config";

export default async function DepartmentPortal({searchParams}:{searchParams:Promise<{error?:string;notice?:string}>}){
 const identity=await requirePortal();
 const {user,account}=identity;
 const kind=account.account_type;
 if(isSupplier(kind)){
  const p=await searchParams;
  return <SupplierPanel identity={identity} description={kind==="licensor"?"Work with the Anime team on your catalog and streaming rights application.":"Work with the Anime team on your company application and studio coordination questions."}
   submitted={p.notice==="submitted"} failed={!!p.error}/>;
 }
 return <main className="an-customer-portal"><div className="an-portal-wrap">
  <header className="an-portal-head"><strong>LOXADA / ANIME</strong><form action={signOut}><button type="submit">Sign out</button></form></header>
  <section className="an-portal-hero"><span className="an-console-overline">SUBSCRIBER PORTAL</span>
   <h1>Welcome, {account.display_name}</h1>
   <p>Your subscriber profile is ready. Streaming plans, billing and a rights-cleared catalog are separate services that are not available on this temporary account page.</p>
  </section>
  <div className="an-portal-grid">
   <section className="an-portal-panel"><h2>Your subscriber profile</h2><p>Your account is active and separate from Manga readers and Merchandise buyers.</p>
    <p>No subscription plan has been purchased or activated by creating this account.</p></section>
   <aside className="an-portal-panel an-portal-meta"><span className="an-console-overline">ACCOUNT</span>
    <h2>{account.display_name}</h2><p>Subscriber</p><p>{user.email}</p>
    <p>You can use this account to sign in. Subscription billing and playback will be added when available.</p>
   </aside>
  </div>
 </div></main>;
}
