import Link from "next/link";
import {requireAdmin} from "@/lib/auth/authorization";
export default async function AdminHome(){
 await requireAdmin();
 return <main className="an-console"><header className="an-console-intro"><div><span className="an-console-overline">LOXADA ANIME / CONTROL ROOM</span><h1>Anime control room</h1><p>Support subscribers, review streaming licensing partners and coordinate with lead production companies.</p></div></header>
 <section className="an-people-stage"><h2>Audience &amp; partners</h2><p>Manage subscriber sign-in and review partner applications. Streaming-rights clearance and production approvals remain separate.</p><Link className="an-rail-link" href="/admin/accounts">Open audience and partner accounts →</Link></section></main>;
}
