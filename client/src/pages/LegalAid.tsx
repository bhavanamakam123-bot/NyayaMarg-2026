import { useEffect, useState } from "react";
import { Card, Disclaimer, Button, inputClass } from "../components/Ui";
import { useAuth } from "../context/Auth";
import { api } from "../lib/api";

type Office = { id: string; kind: string; state: string; name: string; address: string; phone: string | null; website: string | null; verified_on: string; services: string; mapsUrl: string; embedUrl: string; source_url: string };
type StateRow = { name: string };

export function LegalAid() {
  const { profile } = useAuth();
  const [states, setStates] = useState<StateRow[]>([]);
  const [stateName, setStateName] = useState(profile?.state || "");
  const [kind, setKind] = useState("all");
  const [q, setQ] = useState("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [note, setNote] = useState("");
  const [geo, setGeo] = useState("");
  const [selected, setSelected] = useState<Office | null>(null);
  const [locNote, setLocNote] = useState("");

  useEffect(() => { void api<{ states: StateRow[] }>("/api/states").then((data) => setStates(data.states)); }, []);

  async function search(nextState = stateName) {
    const data = await api<{ offices: Office[]; note: string; geocodeNote: string | null }>(`/api/legal-aid?state=${encodeURIComponent(nextState)}&kind=${kind}&q=${encodeURIComponent(q)}`);
    setOffices(data.offices);
    setNote(data.note);
    setGeo(data.geocodeNote || "");
    setSelected(data.offices[0] || null);
  }
  useEffect(() => { if (stateName) void search(); }, [stateName, kind]);

  function locate() {
    if (!navigator.geolocation) return setLocNote("Location is unavailable. Choose a state instead.");
    navigator.geolocation.getCurrentPosition(() => {
      setLocNote("Location permission was received. NyayaMarg still asks you to confirm the state, because office coordinates are not invented from a GPS point.");
    }, () => setLocNote("Permission was not granted. Search by state instead."));
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Find Free Legal Assistance</h1>
      <p className="mt-2 max-w-3xl text-sm">Offices below are copied from the NALSA directory. Free legal services are for eligible persons. District and taluk addresses are opened from the state authority’s own site.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <select className={inputClass + " max-w-xs"} value={stateName} aria-label="State" onChange={(event) => setStateName(event.target.value)}>{states.map((item) => <option key={item.name}>{item.name}</option>)}</select>
        <input className={inputClass + " max-w-xs"} placeholder="City or PIN code" value={q} onChange={(event) => setQ(event.target.value)} aria-label="City or PIN" />
        <Button type="button" onClick={() => void search()}>Search</Button>
        <Button kind="ghost" type="button" onClick={locate}>Use my location</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {[["all", "All published authorities"], ["free", "Free legal aid"], ["slsa", "SLSA"], ["dlsa", "DLSA"], ["taluk", "Taluk committee"], ["clinic", "Legal aid clinic"], ["other", "Other verified"]].map(([value, label]) => (
          <button key={value} className={`rounded-full border px-3 py-1 ${kind === value ? "bg-navy text-white" : "border-line"}`} type="button" onClick={() => setKind(value)}>{label}</button>
        ))}
      </div>
      {locNote && <p className="mt-3 text-sm">{locNote}</p>}
      {geo && <p className="mt-2 text-sm">{geo}</p>}
      <p className="mt-3 text-sm">{note}</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {offices.map((office) => (
            <button key={office.id} className="block w-full rounded-2xl border border-line bg-white p-4 text-left" type="button" onClick={() => setSelected(office)}>
              <strong className="text-navy">{office.name}</strong>
              <span className="mt-1 block text-sm">{office.state} · {office.kind.toUpperCase()}</span>
            </button>
          ))}
          {!offices.length && <Card>No office is listed for this filter. For a district or taluk office, open the state authority website rather than a guessed address.</Card>}
        </div>
        {selected && (
          <Card>
            <h2 className="font-serif text-2xl text-navy">{selected.name}</h2>
            <p className="mt-2 text-sm">{selected.address}</p>
            <p className="mt-2 text-sm">{selected.phone ? `Phone: ${selected.phone}` : "No phone was published in the directory row that was copied."}</p>
            <p className="mt-2 text-sm">{selected.services}</p>
            <p className="mt-2 text-xs">Directory verified on {selected.verified_on}. Source: NALSA.</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {selected.website && <a className="text-royal" href={selected.website} target="_blank" rel="noreferrer">Official website</a>}
              <a className="text-royal" href={selected.mapsUrl} target="_blank" rel="noreferrer">Directions</a>
              <a className="text-royal" href={selected.source_url} target="_blank" rel="noreferrer">NALSA directory</a>
            </div>
            <iframe className="mt-4 h-72 w-full rounded-xl border border-line" title={`Map of ${selected.name}`} src={selected.embedUrl} />
            <p className="mt-2 text-xs">The map searches the published address. It is not a surveyed GPS pin. A Google Maps JavaScript key is optional and not required for this link.</p>
          </Card>
        )}
      </div>
      <Disclaimer />
    </div>
  );
}
