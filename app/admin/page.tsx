import { requireAdmin } from "@/lib/auth/authorization";
export default async function AdminPage() {
 await requireAdmin();
 return <main className="an-overview"><h1>Anime dashboard</h1><p>No modules added yet.</p></main>;
}
