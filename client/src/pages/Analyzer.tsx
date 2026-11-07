import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bar, Button, Card, Disclaimer, Ring } from "../components/Ui";
import { useAuth } from "../context/Auth";
import { api, ApiError } from "../lib/api";
import { listen } from "../lib/speech";

const stages = [
  "Understanding your situation...",
  "Identifying the legal category...",
  "Examining relevant facts...",
  "Searching applicable legal provisions...",
  "Checking relevant documents...",
  "Preparing your legal guidance...",
];

const hints = [
  ["", "Let the description decide"],
  ["consumer", "Consumer"],
  ["cyber", "Cyber"],
  ["cheque", "Cheque"],
  ["criminal", "Criminal"],
  ["civil", "Civil / tenancy"],
  ["traffic", "Traffic"],
  ["labour", "Labour"],
];

type Analysis = {
  disclaimer: string;
  problemSummary: string;
  categoryId: string | null;
  categoryLabel: string;
  uncertain: boolean;
  facts: Array<{ id: string; label: string; present: boolean }>;
  missing: string[];
  questions: string[];
  provisions: Array<{ id: string; act: string; section: string; title: string; jurisdiction: string; effectiveNote: string; lastVerified: string; sourceName: string; sourceUrl: string; relevance: string; simple: Record<string, string>; match: number }>;
  remedies: string[];
  documents: Array<{ name: string; why: string }>;
  nextActions: string[];
  flow: Array<{ title: string; detail: string }>;
  authorities: Array<{ name: string; url: string; phone: string | null; note: Record<string, string> | string }>;
  confidence: { category: number; provisions: number; completeness: number; evidence: number; explanation: string[] };
  transitionNote: string | null;
  couldChange: string[];
  engine: string;
};

export function Analyzer() {
  const { lang } = useAuth();
  const [params] = useSearchParams();
  const [text, setText] = useState(params.get("q") || "");
  const [hint, setHint] = useState("");
  const [files, setFiles] = useState<Array<{ id: number; name: string; note: string }>>([]);
  const [stage, setStage] = useState(-1);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ scenarioId: number; analysis: Analysis } | null>(null);
  const [follow, setFollow] = useState("");

  useEffect(() => {
    const id = params.get("scenario");
    if (!id) return;
    void api<{ analysis: Analysis; scenario: { id: number } }>(`/api/scenarios/${id}`).then((data) => setResult({ scenarioId: data.scenario.id, analysis: data.analysis })).catch(() => undefined);
  }, [params]);

  async function onFiles(list: FileList | null) {
    if (!list) return;
    for (const file of Array.from(list)) {
      const body = new FormData();
      body.append("file", file);
      const saved = await api<{ id: number; name: string; note: string }>("/api/uploads", { method: "POST", body });
      setFiles((current) => [...current, saved]);
    }
  }

  async function run(extra = "") {
    setError("");
    setStage(0);
    const timer = window.setInterval(() => setStage((value) => Math.min(stages.length - 1, value + 1)), 700);
    const started = Date.now();
    try {
      const data = await api<{ scenarioId: number; analysis: Analysis }>("/api/scenarios/analyze", {
        method: "POST",
        body: JSON.stringify({ text: `${text}\n${extra}`.trim(), categoryHint: hint || null, documentIds: files.map((file) => file.id), language: lang }),
      });
      const wait = Math.max(0, 2800 - (Date.now() - started));
      await new Promise((resolve) => setTimeout(resolve, wait));
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The analysis could not be saved.");
    } finally {
      window.clearInterval(timer);
      setStage(-1);
    }
  }

  const analysis = result?.analysis;
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">AI-Powered Legal Scenario Analyzer</h1>
      <p className="mt-2 max-w-3xl text-sm">The live engine retrieves provisions from NyayaMarg’s checked library. It does not call a generative model unless a key is configured, and it never turns a confidence score into a chance of winning.</p>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <label className="text-sm font-semibold text-navy" htmlFor="scenario">Describe what happened</label>
          <textarea id="scenario" className="mt-2 min-h-40 w-full rounded-xl border border-line p-3" value={text} onChange={(event) => setText(event.target.value)} placeholder="Example: My online shopping company took my money but never delivered my product." />
          <div className="mt-3 flex flex-wrap gap-2">
            {hints.map(([value, label]) => <button key={label} type="button" className={`rounded-full border px-3 py-1 text-sm ${hint === value ? "border-royal bg-royal text-white" : "border-line"}`} onClick={() => setHint(value)}>{label}</button>)}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" kind="ghost" onClick={() => listen((said) => setText((current) => `${current} ${said}`.trim()), setError)}>Speak</Button>
            <label className="inline-flex cursor-pointer items-center rounded-xl border border-line px-4 py-2 text-sm font-semibold">
              Upload document
              <input className="sr-only" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt" multiple onChange={(event) => void onFiles(event.target.files)} />
            </label>
            <Button type="button" onClick={() => void run()}>Analyse</Button>
          </div>
          <ul className="mt-3 text-sm">{files.map((file) => <li key={file.id}>{file.name} — {file.note}</li>)}</ul>
          {error && <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>}
          {stage >= 0 && (
            <ol className="mt-4 space-y-2" aria-live="polite">
              {stages.map((item, index) => <li key={item} className={index === stage ? "font-semibold text-royal" : index < stage ? "text-navy" : "text-ink/40"}>{item}</li>)}
            </ol>
          )}
        </Card>
        {analysis && (
          <div className="space-y-4">
            <Card>
              <h2 className="font-serif text-2xl text-navy">{analysis.categoryLabel}</h2>
              <p className="mt-2 text-sm">{analysis.problemSummary}</p>
              {analysis.uncertain && <p className="mt-3 rounded-xl bg-[#fbf7ef] p-3 text-sm">No provision is shown because the description is not specific enough.</p>}
              {analysis.transitionNote && <p className="mt-3 rounded-xl bg-paper p-3 text-sm">{analysis.transitionNote}</p>}
            </Card>
            <Card>
              <h2 className="font-serif text-xl">Retrieval confidence</h2>
              <p className="mt-1 text-sm">These scores are not a prediction of winning a case or receiving compensation.</p>
              <div className="mt-4 flex flex-wrap justify-between gap-2">
                <Ring value={analysis.confidence.category} label="Category match" />
                <Ring value={analysis.confidence.provisions} label="Provision match" />
                <Ring value={analysis.confidence.completeness} label="Information completeness" />
                <Ring value={analysis.confidence.evidence} label="Document presence" />
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {[["Category", analysis.confidence.category], ["Provisions", analysis.confidence.provisions], ["Completeness", analysis.confidence.completeness], ["Documents", analysis.confidence.evidence]].map(([label, value]) => (
                  <div key={String(label)}><div className="mb-1 flex justify-between"><span>{label}</span><span>{value}</span></div><Bar value={Number(value)} /></div>
                ))}
              </div>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">{analysis.confidence.explanation.map((line) => <li key={line}>{line}</li>)}</ul>
            </Card>
            <Card>
              <h2 className="font-serif text-xl">How the reasoning connects</h2>
              <ol className="mt-4 space-y-3">
                {["Your scenario", analysis.categoryLabel, "Potentially applicable provisions", "Evidence assessment", "Possible remedies", "Step-by-step action plan"].map((item, index) => (
                  <li key={item}>
                    <div className="rounded-xl border border-line px-3 py-2">{index + 1}. {item}</div>
                    {index < 5 && <div className="py-1 text-center text-royal" aria-hidden="true">↓</div>}
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        )}
      </div>
      {analysis && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Card><h2 className="font-serif text-xl">Important facts</h2><ul className="mt-2 text-sm">{analysis.facts.map((fact) => <li key={fact.id}>{fact.present ? "Found" : "Not found"}: {fact.label}</li>)}</ul></Card>
          <Card><h2 className="font-serif text-xl">Missing information</h2><ul className="mt-2 list-disc pl-5 text-sm">{analysis.missing.map((item) => <li key={item}>{item}</li>)}</ul></Card>
          <Card>
            <h2 className="font-serif text-xl">Clarifying questions</h2>
            <ul className="mt-2 list-disc pl-5 text-sm">{analysis.questions.map((item) => <li key={item}>{item}</li>)}</ul>
            <textarea className="mt-3 min-h-20 w-full rounded-xl border border-line p-3" value={follow} onChange={(event) => setFollow(event.target.value)} placeholder="Answer any of these questions" />
            <Button className="mt-2" type="button" onClick={() => void run(follow)}>Update analysis</Button>
          </Card>
          <Card><h2 className="font-serif text-xl">What could change this</h2><ul className="mt-2 list-disc pl-5 text-sm">{analysis.couldChange.map((item) => <li key={item}>{item}</li>)}</ul></Card>
          <Card className="lg:col-span-2">
            <h2 className="font-serif text-xl">Potentially applicable provisions</h2>
            <div className="mt-3 space-y-4">
              {analysis.provisions.map((item) => (
                <article key={item.id} className="rounded-xl border border-line p-3">
                  <h3 className="font-semibold text-navy">{item.act} — {item.section}</h3>
                  <p className="text-sm">{item.title}</p>
                  <p className="mt-2 text-sm"><strong>Why it may apply: </strong>{item.relevance}</p>
                  <p className="mt-2 text-sm"><strong>Simplified: </strong>{item.simple[lang] || item.simple.en}</p>
                  <p className="mt-2 text-xs text-ink/70">Jurisdiction: {item.jurisdiction}. Last verified: {item.lastVerified}. {item.effectiveNote}</p>
                  <a className="mt-2 inline-block text-sm text-royal" href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceName}</a>
                  <button className="ml-4 text-sm text-gold" type="button" onClick={() => void api("/api/bookmarks", { method: "POST", body: JSON.stringify({ targetType: "provision", targetId: item.id }) })}>Save provision</button>
                </article>
              ))}
              {!analysis.provisions.length && <p className="text-sm">No provision is listed.</p>}
            </div>
          </Card>
          <Card><h2 className="font-serif text-xl">Possible rights and remedies</h2><ul className="mt-2 list-disc pl-5 text-sm">{analysis.remedies.map((item) => <li key={item}>{item}</li>)}</ul></Card>
          <Card><h2 className="font-serif text-xl">Documents and evidence</h2><ul className="mt-2 text-sm">{analysis.documents.map((item) => <li key={item.name}><strong>{item.name}.</strong> {item.why}</li>)}</ul></Card>
          <Card><h2 className="font-serif text-xl">Suggested next actions</h2><ol className="mt-2 list-decimal pl-5 text-sm">{analysis.nextActions.map((item) => <li key={item}>{item}</li>)}</ol>{result && analysis.categoryId && <Link className="mt-4 inline-block" to={`/planner?scenario=${result.scenarioId}`}><Button type="button">Generate My Legal Action Plan</Button></Link>}</Card>
          <Card>
            <h2 className="font-serif text-xl">From problem to a public service</h2>
            <ol className="mt-3 space-y-2">{analysis.flow.map((node, index) => <li key={node.title}><div className="rounded-xl bg-paper px-3 py-2"><strong>{index + 1}. {node.title}</strong><span className="mt-1 block text-sm">{node.detail}</span></div>{index < analysis.flow.length - 1 && <div className="text-center text-royal">↓</div>}</li>)}</ol>
            <ul className="mt-3 text-sm">{analysis.authorities.map((item) => <li key={item.name}><a className="text-royal" href={item.url} target="_blank" rel="noreferrer">{item.name}</a>{item.phone ? ` · ${item.phone}` : ""}</li>)}</ul>
          </Card>
        </div>
      )}
      <Disclaimer />
    </div>
  );
}
