import SectionLinks from "@/app/admin/components/section-links";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/authorization";
import { signOut } from "@/app/actions/auth";
export default async function AnimeLayout({children}:{children:React.ReactNode}) {
 const user=await requireAdmin();
 const username=user.email?.split("@")[0]??"Staff";
 return <div className="an-app">
   <header className="an-app-top"><strong>LOXADA <span>/ ANIME</span></strong>
     <div className="an-user"><div><b title={user.email}>{username}</b><small>Department Admin</small></div><form action={signOut}><button type="submit">Log out</button></form></div>
   </header>
   <nav className="an-app-nav" aria-label="Anime navigation"><SectionLinks items={[{href:"/admin",label:"Control room"},{href:"/admin/accounts",label:"Audience accounts"},{href:"/admin/onboarding",label:"Partner onboarding"}]}/></nav>
   <section className="an-app-children">{children}</section>
 </div>;
}
