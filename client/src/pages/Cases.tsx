import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, Disclaimer, inputClass } from "../components/Ui";
import { api } from "../lib/api";

type RecordNote = { id: number; note: string; hearing_note: string | null; created_at: string };
type CaseRow = { id: number; cnr: string | null; case_number: string | null; court: string | null; records: RecordNote[] };

export function Cases() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [official, setOfficial] = useState({ portal: "", status: "", note: "" });
  async function load() {
    const data = await api<{ cases: CaseRow[]; official: typeof official }>("/api/cases");
    setCases(data.cases);
    setOfficial(data.official);
  }
  useEffect(() => { void load(); }, []);
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api("/api/cases", { method: "POST", body: JSON.stringify({ cnr: form.get("cnr"), caseNumber: form.get("caseNumber"), court: form.get("court") }) });
    event.currentTarget.reset();
    await load();
  }
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Know Your Case – Court Case Tracker</h1>
      <p className="mt-2 max-w-3xl text-sm">{official.note}</p>
      <p className="mt-2 text-sm"><a className="text-royal" href={official.portal} target="_blank" rel="noreferrer">eCourts</a> · <a className="text-royal" href={official.status} target="_blank" rel="noreferrer">Case status search</a></p>
      <Card className="mt-4">
        <form className="grid gap-3 md:grid-cols-4" onSubmit={add}>
          <input className={inputClass} name="cnr" placeholder="CNR number" aria-label="CNR number" />
          <input className={inputClass} name="caseNumber" placeholder="Case number" aria-label="Case number" />
          <input className={inputClass} name="court" placeholder="Court, if you know it" aria-label="Court" />
          <Button type="submit">Save reference</Button>
        </form>
      </Card>
      <div className="mt-4 space-y-4">
        {cases.map((item) => <CaseCard key={item.id} item={item} onSaved={load} statusUrl={official.status} />)}
      </div>
      <Disclaimer />
    </div>
  );
}

function CaseCard({ item, onSaved, statusUrl }: { item: CaseRow; onSaved: () => Promise<void>; statusUrl: string }) {
  const [note, setNote] = useState("");
  const [hearing, setHearing] = useState("");
  return (
    <Card>
      <h2 className="font-semibold text-navy">{item.cnr || item.case_number}</h2>
      <p className="text-sm">{item.court || "Court not entered"}</p>
      <p className="mt-2 text-sm">No live status is shown. Open the official search and copy what you see.</p>
      <a className="text-sm text-royal" href={statusUrl} target="_blank" rel="noreferrer">Open official case-status search</a>
      <form className="mt-3 space-y-2" onSubmit={(event) => { event.preventDefault(); void api(`/api/cases/${item.id}/notes`, { method: "POST", body: JSON.stringify({ note, hearingNote: hearing }) }).then(() => { setNote(""); setHearing(""); return onSaved(); }); }}>
        <textarea className="min-h-20 w-full rounded-xl border border-line p-3" value={note} onChange={(event) => setNote(event.target.value)} placeholder="What the official portal showed" required />
        <input className={inputClass} value={hearing} onChange={(event) => setHearing(event.target.value)} placeholder="Hearing date only if the portal showed one" aria-label="Hearing note" />
        <Button type="submit">Save my note</Button>
      </form>
      <ul className="mt-3 space-y-2 text-sm">{item.records.map((record) => <li key={record.id} className="rounded-xl bg-paper p-3"><strong>Your note:</strong> {record.note}{record.hearing_note ? ` Hearing you recorded: ${record.hearing_note}` : ""}</li>)}</ul>
    </Card>
  );
}
