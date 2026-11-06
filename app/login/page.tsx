import { signIn } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PasswordField from "./password-field";
const messages:Record<string,string>={invalid:"Incorrect email or password.",unauthorized:"This account is not approved for Anime.",configuration:"Login is not configured."};
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
 const params=await searchParams;
 if(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(user?.email_confirmed_at){const {data:role}=await supabase.from("staff_roles").select("role").eq("user_id",user.id).maybeSingle();if(role?.role==="dept_admin")redirect("/admin");}
 }
 const error=params.error?messages[params.error]??messages.invalid:null;
 return <main className="an-entry"><header className="an-entry-head"><b>LOXADA / ANIME</b></header>
   <section className="an-entry-panel"><div className="an-mark">ANIME</div><h1>Sign in</h1><p>Production workspace</p>
   {error&&<p role="alert" className="an-alert">{error}</p>}
   <form action={signIn}><label htmlFor="an-email">Email or username</label><input id="an-email" name="email" type="text" autoComplete="username" required/><label htmlFor="an-password">Password</label><PasswordField/><button className="an-submit" type="submit">Sign in</button></form>
   </section>
 </main>;
}
