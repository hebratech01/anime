import { signIn } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const messages: Record<string, string> = {
 invalid: "The email or password could not be verified.",
 unauthorized: "This account does not have permission to enter the admin area.",
 configuration: "Sign-in is not configured for this environment.",
};

export default async function Login({ searchParams }: { searchParams: Promise<{error?: string}> }) {
  const params = await searchParams;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: record } = await supabase.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
      if (record?.role === "dept_admin" && user.email_confirmed_at) redirect("/admin");
    }
  }
  const error = params.error ? messages[params.error] ?? messages.invalid : null;
  return (<div className="an-shell"><div className="an-orbit" aria-hidden="true"/><div className="an-ray" aria-hidden="true"/><section className="an-aside"><div className="an-brand">LOXADA — ANIME</div><div><h2>Beyond<br/><em>the</em><br/>frame.</h2></div><span className="an-small">STUDIO OPERATIONS / PRIVATE SCREENING</span></section><section className="an-card-wrap"><div className="an-card"><span>✦ STAFF ACCESS ONLY</span><h1>Enter the studio.</h1><p>A private production space for authorized Anime administrators. Your account must be approved before entering.</p>{error && <div className="an-alert" role="alert">{error}</div>}<form action={signIn}><label htmlFor="email">Studio email</label><input type="email" name="email" id="email" autoComplete="username" required placeholder="staff@example.com"/><label htmlFor="password">Password</label><input name="password" id="password" type="password" autoComplete="current-password" required/><button type="submit">START SESSION ▶</button></form></div></section></div>);
}
