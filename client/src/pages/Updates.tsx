import { useEffect, useState } from "react";
import { Card, Disclaimer } from "../components/Ui";
import { api } from "../lib/api";

type Update = { id: string; title: string; summary: string; published_on: string; effective_on: string | null; status: string; status_note: string; act: string; category: string; source_name: string; source_url: string; bookmarked: boolean };

export function Updates() {
  const [category, setCategory] = useState("");
  const [rows, setRows] = useState<Update[]>([]);
  const [note, setNote] = useState("");
  async function load(next = category) {
    const data = await api<{ updates: Update[]; note: string }>(`/api/updates?category=${encodeURIComponent(next)}`);
    setRows(data.updates);
    setNote(data.note);
  }
  useEffect(() => { void load(); }, [category]);
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Law Amendment & Latest Update Alerts</h1>
      <p className="mt-2 max-w-3xl text-sm">{note} Published, passed, and in force are labelled separately.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["", "criminal", "consumer", "traffic"].map((item) => <button key={item || "all"} className={`rounded-full border px-3 py-1 text-sm ${category === item ? "bg-navy text-white" : "border-line"}`} type="button" onClick={() => setCategory(item)}>{item || "All"}</button>)}
      </div>
      <div className="mt-4 space-y-4">
        {rows.map((item) => (
          <Card key={item.id}>
            <p className="text-xs uppercase tracking-wide text-gold">{item.status.replaceAll("_", " ")} · {item.category}</p>
            <h2 className="mt-1 font-serif text-2xl text-navy">{item.title}</h2>
            <p className="mt-2 text-sm">{item.summary}</p>
            <p className="mt-2 text-sm">Published {item.published_on}{item.effective_on ? ` · Effective ${item.effective_on}` : ""}</p>
            <p className="text-sm">Affected: {item.act}</p>
            <p className="mt-2 text-sm">{item.status_note}</p>
            <a className="mt-2 inline-block text-sm text-royal" href={item.source_url} target="_blank" rel="noreferrer">{item.source_name}</a>
            <button className="ml-4 text-sm text-gold" type="button" onClick={() => void api(item.bookmarked ? "/api/bookmarks" : "/api/bookmarks", { method: item.bookmarked ? "DELETE" : "POST", body: JSON.stringify({ targetType: "update", targetId: item.id }) }).then(() => load())}>{item.bookmarked ? "Remove bookmark" : "Bookmark and alert in the app"}</button>
          </Card>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}
