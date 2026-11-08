import Link from "next/link";
import {register} from "@/app/actions/auth";
import NewPasswordFields from "./password-fields";

const errors:Record<string,string>={invalid:"Check the form and use matching passwords of at least 12 characters.",failed:"We could not create the account. Check the details and try again.",configuration:"Registration is unavailable."};
export default async function SubscribeRegistration({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {error}=await searchParams;
 return <main className="an-register">
  <section className="an-register-feature"><span className="an-console-overline">LOXADA / ANIME</span>
   <h1>Your anime space.</h1>
   <p>Create a subscriber account for our future streaming service. Subscription plans and access to individual titles will be handled separately once available.</p>
   <p className="an-feature-caption">Subscriber signup · Production partners join by invitation</p>
  </section>
  <section className="an-register-form">
   <span className="an-console-overline">AUDIENCE ACCESS</span><h2>Create subscriber account</h2>
   <p>A few details to get started. You may need to confirm your email before signing in.</p>
   {error&&<p className="an-console-message" role="alert">{errors[error]??errors.failed}</p>}
   <form action={register}>
    <input type="hidden" name="account_type" value="subscriber"/>
    <label htmlFor="an-name">Your display name<input id="an-name" name="display_name" autoComplete="name" minLength={2} maxLength={80} required/></label>
    <label htmlFor="an-email">Email address<input id="an-email" name="email" type="email" autoComplete="email" maxLength={254} required/></label>
    <NewPasswordFields/>
    <button type="submit">Create subscriber account</button>
   </form>
   <p>Creating an account does not start a paid subscription.</p>
   <Link href="/login">Already have an account? Sign in</Link>
  </section>
 </main>;
}
