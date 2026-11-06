import { signIn } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
const messages:Record<string,string>={invalid:"Invalid account or password.",unauthorized:"You do not have production staff access.",configuration:"Login is not configured."};
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
 const params=await searchParams;
 if(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(user?.email_confirmed_at){const {data:r}=await supabase.from("staff_roles").select("role").eq("user_id",user.id).maybeSingle();if(r?.role==="dept_admin")redirect("/admin")}
 }
 const error=params.error?messages[params.error]??messages.invalid:null;
 return <main className="an-theater"><header className="an-marquee"><b><span>●</span> LOXADA / ANIME</b><span>PRODUCTION OPERATIONS</span><span>TAKE 001</span></header><section className="an-stage"><div className="an-moon"/><div className="an-ring"/><div className="an-story"><small>SCENE 01 · PRIVATE SCREENING</small><h1>ENTER<br/>THE <em>SCENE.</em></h1><p>Build a world behind every frame.</p></div><div className="an-login"><div className="an-take">01:00:24:16 <span>● REC</span></div>{error&&<p className="an-error" role="alert">{error}</p>}<form action={signIn}><div><label htmlFor="identity">STAFF EMAIL / USERNAME</label><input name="email" id="identity" type="text" required autoComplete="username" placeholder="admin"/></div><div><label htmlFor="pass">PASSWORD</label><input name="password" id="pass" type="password" autoComplete="current-password" required/></div><button type="submit">▶ START SESSION</button></form><small>ONLY APPROVED PRODUCTION ADMINISTRATORS</small></div></section><footer className="an-timeline"><span>▶ 00:00</span><div className="an-progress"><span/></div><span>24 FPS</span><span>LOXADA ORIGINAL</span></footer></main>;
}