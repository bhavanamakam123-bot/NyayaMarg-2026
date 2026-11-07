import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disclaimer, Card } from "../components/Ui";
import { useAuth } from "../context/Auth";
import { api } from "../lib/api";
import { t } from "../lib/i18n";

type Dash = {
  scenarios: Array<{ id: number; title: string; created_at: string }>;
  saved: Array<{ target_id: string }>;
  pendingSteps: number;
  evidence: { done: number | null; total: number | null };
  cases: Array<{ id: number; cnr: string | null; case_number: string | null; court: string | null }>;
  updates: Array<{ id: string; title: string; published_on: string; status: string }>;
  notifications: Array<{ id: number; title: string }>;
};

export function Dashboard() {
  const { profile, lang } = useAuth();
  const copy = t(lang);
  const navigate = useNavigate();
  const [data, setData] = useState<Dash | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => { void api<Dash>("/api/dashboard").then(setData); }, []);
  const done = data?.evidence.done || 0;
  const total = data?.evidence.total || 0;
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.14em] text-gold">NyayaMarg</p>
      <h1 className="mt-1 font-serif text-3xl text-navy">Welcome, {profile?.full_name}</h1>
      {profile?.age_group === "under_18" && <p className="mt-3 rounded-xl bg-[#fbf7ef] p-3 text-sm">You marked an age under 18. Please continue with a parent or guardian. Childline: 1098. Legal aid for a child is decided by the Legal Services Authority.</p>}
      <form className="mt-5" onSubmit={(event) => { event.preventDefault(); navigate(`/analyzer?q=${encodeURIComponent(query)}`); }}>
        <label className="sr-only" htmlFor="dash-search">{copy.search}</label>
        <input id="dash-search" className="w-full rounded-2xl border border-line bg-white px-4 py-3" placeholder={copy.search} value={query} onChange={(event) => setQuery(event.target.value)} />
      </form>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {copy.nav.map(([label, href]) => <Link key={href} className="rounded-2xl border border-line bg-white p-4 text-sm font-semibold text-navy shadow-sm hover:border-royal" to={href}>{label}</Link>)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-serif text-xl text-navy">Recently analysed scenarios</h2>
          <ul className="mt-3 space-y-2 text-sm">{data?.scenarios.length ? data.scenarios.map((item) => <li key={item.id}><Link className="text-royal" to={`/analyzer?scenario=${item.id}`}>{item.title}</Link></li>) : <li>None yet. Start with the scenario analyser.</li>}</ul>
        </Card>
        <Card>
          <h2 className="font-serif text-xl text-navy">Saved legal provisions</h2>
          <ul className="mt-3 space-y-2 text-sm">{data?.saved.length ? data.saved.map((item) => <li key={item.target_id}>{item.target_id}</li>) : <li>Save a provision from an analysis when you want it here.</li>}</ul>
        </Card>
        <Card>
          <h2 className="font-serif text-xl text-navy">Pending action-plan steps</h2>
          <p className="mt-3 text-3xl text-royal">{data?.pendingSteps ?? "–"}</p>
          <Link className="text-sm text-royal" to="/planner">Open the planner</Link>
        </Card>
        <Card>
          <h2 className="font-serif text-xl text-navy">Evidence checklist</h2>
          <p className="mt-3 text-sm">{total ? `${done} of ${total} suggested documents marked available` : "A checklist appears after an analysis."}</p>
          <div className="mt-3 h-2 rounded-full bg-paper"><div className="h-2 rounded-full bg-gold" style={{ width: total ? `${(done / total) * 100}%` : "0%" }} /></div>
        </Card>
        <Card>
          <h2 className="font-serif text-xl text-navy">Case tracking</h2>
          <ul className="mt-3 space-y-2 text-sm">{data?.cases.length ? data.cases.map((item) => <li key={item.id}>{item.cnr || item.case_number} {item.court ? `· ${item.court}` : ""}</li>) : <li>No saved case reference. Status is not fetched from eCourts.</li>}</ul>
        </Card>
        <Card>
          <h2 className="font-serif text-xl text-navy">Latest legal updates</h2>
          <ul className="mt-3 space-y-2 text-sm">{data?.updates.map((item) => <li key={item.id}><span className="text-gold">{item.status.replaceAll("_", " ")}</span> · {item.title}</li>)}</ul>
        </Card>
      </div>
      <Disclaimer />
    </div>
  );
}
