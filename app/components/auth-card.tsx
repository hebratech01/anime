import type { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
  <main className="an-entry">
    <header className="an-entry-head"><b>LOXADA / ANIME</b></header>
    <section className="an-entry-panel"><div className="an-mark">ANIME</div>
      {children}
    </section>
  </main>
  );
}
