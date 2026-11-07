import { useState } from "react";
import { Button, Card, Disclaimer, inputClass } from "../components/Ui";
import { api } from "../lib/api";

type Assessment = {
  level: "critical" | "high" | "normal";
  title: string;
  explanation: string;
  reasons?: string[];
  contacts: Array<{ name: string; phone: string; note: string }>;
  questions?: Array<{ id: string; prompt: string }>;
  skipLongForm: boolean;
};

const tone = { critical: "bg-red-800 text-white", high: "bg-amber-800 text-white", normal: "bg-navy text-white" };

export function Urgency() {
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Assessment | null>(null);

  async function run(next = answers) {
    const data = await api<{ assessment: Assessment }>("/api/urgency", { method: "POST", body: JSON.stringify({ text, answers: next }) });
    setResult(data.assessment);
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Legal Urgency Assessment</h1>
      <p className="mt-2 max-w-3xl text-sm">If someone is in danger, call 112 before answering questions. This screen does not replace a court deadline or a lawyer’s judgment.</p>
      <Card className="mt-4">
        <label className="text-sm font-semibold" htmlFor="urgent">What is happening?</label>
        <textarea id="urgent" className={`${inputClass} mt-2 min-h-28`} value={text} onChange={(event) => setText(event.target.value)} />
        <Button className="mt-3" type="button" onClick={() => void run()}>Assess</Button>
      </Card>
      {result && (
        <Card className="mt-4">
          <p className={`inline-block rounded-full px-3 py-1 text-sm ${tone[result.level]}`}>{result.title}</p>
          <p className="mt-3 text-sm">{result.explanation}</p>
          {result.contacts.length > 0 && (
            <ul className="mt-3 space-y-2">
              {result.contacts.map((item) => <li key={item.phone} className="rounded-xl bg-paper p-3"><a className="text-lg font-semibold text-royal" href={`tel:${item.phone}`}>{item.name}: {item.phone}</a><span className="block text-sm">{item.note}</span></li>)}
            </ul>
          )}
          {result.reasons?.map((reason) => <p key={reason} className="mt-2 text-sm">{reason}</p>)}
          {!result.skipLongForm && result.questions && (
            <div className="mt-4 space-y-3">
              {result.questions.map((question) => (
                <fieldset key={question.id}>
                  <legend className="text-sm">{question.prompt}</legend>
                  <button className="mr-2 mt-1 rounded-full border px-3 py-1 text-sm" type="button" onClick={() => { const next = { ...answers, [question.id]: "yes" }; setAnswers(next); void run(next); }}>Yes</button>
                  <button className="rounded-full border px-3 py-1 text-sm" type="button" onClick={() => { const next = { ...answers, [question.id]: "no" }; setAnswers(next); void run(next); }}>No</button>
                </fieldset>
              ))}
            </div>
          )}
        </Card>
      )}
      <Disclaimer />
    </div>
  );
}
