import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { api } from "../lib/api";
import { t } from "../lib/i18n";
import { Logo } from "./Logo";

export function Shell() {
  const { profile, lang, setProfile } = useAuth();
  const copy = t(lang);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<Array<{ id: number; title: string; body: string; read_at: string | null }>>([]);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    void api<{ notifications: typeof notes }>("/api/notifications").then((data) => setNotes(data.notifications)).catch(() => undefined);
  }, []);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setProfile(null);
    navigate("/");
  }

  async function changeLanguage(language: "en" | "hi" | "te") {
    const data = await api<{ profile: NonNullable<typeof profile> }>("/api/profile", { method: "PATCH", body: JSON.stringify({ language }) });
    setProfile(data.profile);
  }

  const nav = (
    <nav aria-label="Primary" className="mt-8 space-y-1">
      {copy.nav.map(([label, href]) => (
        <NavLink key={href} to={href} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm leading-snug ${isActive ? "bg-white/12 text-gold-2" : "text-white/88 hover:bg-white/8"}`}>
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18.5rem_1fr]">
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-navy px-4 py-5 text-white lg:static lg:w-auto ${open ? "block" : "hidden lg:block"}`}>
        <Logo light />
        {nav}
        <button className="mt-8 text-sm text-gold-2" onClick={() => void logout()} type="button">{copy.logout}</button>
      </aside>
      {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-navy/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
          <button className="rounded-lg border border-line px-3 py-2 lg:hidden" onClick={() => setOpen(true)} type="button" aria-label="Open menu">Menu</button>
          <form className="min-w-[16rem] flex-1" onSubmit={(event) => { event.preventDefault(); navigate(`/analyzer?q=${encodeURIComponent(query)}`); }}>
            <label className="sr-only" htmlFor="global-search">{copy.search}</label>
            <input id="global-search" className="w-full rounded-xl border border-line bg-paper px-3 py-2" placeholder={copy.search} value={query} onChange={(event) => setQuery(event.target.value)} />
          </form>
          <label className="text-sm text-navy">
            <span className="sr-only">{copy.language}</span>
            <select className="rounded-xl border border-line bg-white px-2 py-2" value={lang} aria-label={copy.language} onChange={(event) => void changeLanguage(event.target.value as "en" | "hi" | "te")}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>
          </label>
          <div className="relative">
            <button className="rounded-xl border border-line px-3 py-2 text-sm" type="button" aria-expanded={showNotes} onClick={() => setShowNotes((value) => !value)}>{copy.notifications} ({notes.filter((note) => !note.read_at).length})</button>
            {showNotes && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-line bg-white p-3 shadow-lg">
                {notes.length === 0 && <p className="text-sm">No alerts yet.</p>}
                {notes.map((note) => (
                  <button key={note.id} className="block w-full border-b border-line py-2 text-left text-sm" type="button" onClick={() => void api(`/api/notifications/${note.id}/read`, { method: "POST" }).then(() => setNotes(notes.map((item) => item.id === note.id ? { ...item, read_at: new Date().toISOString() } : item)))}>
                    <strong>{note.title}</strong>
                    <span className="mt-1 block text-ink/80">{note.body}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="rounded-xl bg-navy px-3 py-2 text-sm text-white" type="button" onClick={() => navigate("/profile")}>{profile?.full_name?.split(" ")[0]}</button>
        </header>
        <main id="main" className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
