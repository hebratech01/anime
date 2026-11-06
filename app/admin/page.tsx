import { signOut } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/auth/authorization";

export default async function AdminPage() {
  const user = await requireAdmin();
  return (<div className="an-admin"><header><strong className="an-brand">LOXADA — ANIME</strong><form action={signOut}><button className="an-exit" type="submit">END SESSION ⏹</button></form></header><section><span className="an-small">✦ AUTHORIZED ADMIN / PRODUCTION</span><h1>Your studio.<br/><em>Your space.</em></h1><div className="an-content"><strong>Session verified</strong><p>Welcome to the Anime administration room, {user.email}.</p><p>Production and licensing operations are not available yet; this is the protected starting screen.</p></div></section></div>);
}
