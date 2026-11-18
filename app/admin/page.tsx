import Link from "next/link";
import {requireAdmin} from "@/lib/auth/authorization";
export default async function AdminHome(){
 await requireAdmin();
 return <main className="an-console"><header className="an-console-intro"><div><span className="an-console-overline">LOXADA ANIME / CONTROL ROOM</span><h1>Anime control room</h1><p>Support subscribers, review streaming licensing partners and coordinate with lead production companies.</p></div></header>
 <section className="an-people-stage" style={{marginTop:18}}><h2>Account Access</h2><p>Find subscribers, anime rights suppliers, and lead production companies. Manage sign-in, suspensions, and password recovery.</p><Link className="an-rail-link" href="/admin/accounts">Manage account access →</Link></section>
 <section className="an-people-stage" style={{marginTop:18}}><h2>Suppliers</h2><p>Send invitations, review applications, and check supplier activity.</p><Link className="an-rail-link" href="/admin/relations">Open Suppliers →</Link></section>
 </main>;
}
