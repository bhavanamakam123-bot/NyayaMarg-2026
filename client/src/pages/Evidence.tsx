import { useEffect, useState } from "react";
import { Button, Card, Disclaimer } from "../components/Ui";
import { api, download } from "../lib/api";

type Item = { id: number; name: string; why: string; origin: string; available: number };
type List = { id: number; items: Item[]; files: Array<{ id: number; original_name: string; item_id: number | null }> };

export function Evidence() {
  const [lists, setLists] = useState<List[]>([]);
  const [name, setName] = useState("");
  async function load() {
    const data = await api<{ checklists: List[] }>("/api/evidence");
    setLists(data.checklists);
  }
  useEffect(() => { void load(); }, []);
  const current = lists[0];
  const suggested = current?.items.filter((item) => item.origin === "ai") || [];
  const own = current?.items.filter((item) => item.origin === "user") || [];
  const done = suggested.filter((item) => item.available).length;
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Legal Document & Evidence Checklist</h1>
      <p className="mt-2 text-sm">Suggestions come from the analysis. Uploaded files are separate and can be downloaded only by you.</p>
      {!current && <Card className="mt-4">Run a scenario analysis to create a checklist.</Card>}
      {current && (
        <Card className="mt-4">
          <p className="text-sm">{suggested.length ? `${Math.round((done / suggested.length) * 100)}% of suggested documents are marked available.` : "No suggested documents."}</p>
          <div className="mt-2 h-2 rounded-full bg-paper"><div className="h-2 rounded-full bg-royal" style={{ width: suggested.length ? `${(done / suggested.length) * 100}%` : "0%" }} /></div>
          <h2 className="mt-4 font-semibold">Suggested by the analysis</h2>
          <ul className="mt-2 space-y-3">
            {suggested.map((item) => <ItemRow key={item.id} item={item} onChange={load} />)}
          </ul>
          <h2 className="mt-5 font-semibold">Added by you</h2>
          <ul className="mt-2 space-y-3">{own.map((item) => <ItemRow key={item.id} item={item} onChange={load} />)}</ul>
          <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); void api(`/api/evidence/${current.id}/items`, { method: "POST", body: JSON.stringify({ name }) }).then(() => { setName(""); return load(); }); }}>
            <input className="flex-1 rounded-xl border border-line px-3" aria-label="Custom document" value={name} onChange={(event) => setName(event.target.value)} placeholder="Add a document" />
            <Button type="submit">Add</Button>
          </form>
          <h2 className="mt-5 font-semibold">Uploaded files</h2>
          <ul className="mt-2 text-sm">{current.files.map((file) => <li key={file.id}><a className="text-royal" href={`/api/uploads/${file.id}`} onClick={(event) => { event.preventDefault(); void download(`/api/uploads/${file.id}`, file.original_name); }}>{file.original_name}</a></li>)}</ul>
          <Button className="mt-4" type="button" onClick={() => void download(`/api/evidence/${current.id}/pdf`, "nyayamarg-checklist.pdf")}>Download checklist PDF</Button>
        </Card>
      )}
      <Disclaimer />
    </div>
  );
}

function ItemRow({ item, onChange }: { item: Item; onChange: () => Promise<void> }) {
  return (
    <li className="rounded-xl border border-line p-3 text-sm">
      <label className="flex items-start gap-2">
        <input type="checkbox" checked={Boolean(item.available)} onChange={(event) => void api(`/api/evidence/items/${item.id}`, { method: "PATCH", body: JSON.stringify({ available: event.target.checked }) }).then(onChange)} />
        <span><strong>{item.name}</strong><span className="block">{item.why}</span><span className="text-xs uppercase text-gold">{item.available ? "Available" : "Missing"} · {item.origin === "ai" ? "Suggested" : "Yours"}</span></span>
      </label>
      <label className="mt-2 inline-block text-royal">
        Upload
        <input className="sr-only" type="file" onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const body = new FormData();
          body.append("file", file);
          void api(`/api/evidence/items/${item.id}/upload`, { method: "POST", body }).then(onChange);
        }} />
      </label>
    </li>
  );
}
