import { useState } from "react";
import { Button, Card, Disclaimer, inputClass } from "../components/Ui";
import { useAuth } from "../context/Auth";
import { api } from "../lib/api";
import { listen, speak } from "../lib/speech";

type Reply = { lead: string; disclaimer: string; analysis: { categoryLabel: string; provisions: Array<{ id: string; act: string; section: string; simple: Record<string, string>; sourceUrl: string }>; uncertain: boolean } };

export function Assistant() {
  const { lang } = useAuth();
  const [message, setMessage] = useState("");
  const [log, setLog] = useState<Array<{ role: "you" | "nyayamarg"; text: string; reply?: Reply }>>([]);

  async function ask(text = message) {
    if (!text.trim()) return;
    setLog((current) => [...current, { role: "you", text }]);
    const reply = await api<Reply>("/api/assistant", { method: "POST", body: JSON.stringify({ message: text, language: lang }) });
    const provisions = reply.analysis.provisions.map((item) => `${item.act}, ${item.section}. ${item.simple[lang] || item.simple.en}`).join(" ");
    const spoken = `${reply.lead} ${provisions}`.trim();
    setLog((current) => [...current, { role: "nyayamarg", text: spoken, reply }]);
    setMessage("");
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Multilingual Legal Assistant</h1>
      <p className="mt-2 max-w-3xl text-sm">English, Hindi, and Telugu. The official Act and section names stay in their statutory form. The sentence beside them is a simplification, not an official translation.</p>
      <Card className="mt-4">
        <div className="space-y-3">
          {log.map((item, index) => (
            <article key={index} className={item.role === "you" ? "ml-8 rounded-2xl bg-paper p-3" : "mr-8 rounded-2xl border border-line p-3"}>
              <p className="text-sm whitespace-pre-wrap">{item.text}</p>
              {item.reply && !item.reply.analysis.uncertain && (
                <ul className="mt-2 text-sm">{item.reply.analysis.provisions.map((provision) => <li key={provision.id}><a className="text-royal" href={provision.sourceUrl} target="_blank" rel="noreferrer">{provision.act} {provision.section}</a></li>)}</ul>
              )}
              {item.role === "nyayamarg" && <button className="mt-2 text-sm text-royal" type="button" onClick={() => speak(item.text, lang)}>Speak</button>}
            </article>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <label className="sr-only" htmlFor="ask">Ask</label>
          <input id="ask" className={inputClass} value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void ask(); }} placeholder={lang === "hi" ? "अपना प्रश्न लिखें" : lang === "te" ? "మీ ప్రశ్న రాయండి" : "Ask a follow-up"} />
          <Button type="button" kind="ghost" onClick={() => listen((said) => void ask(said), () => undefined)}>Voice</Button>
          <Button type="button" onClick={() => void ask()}>Ask</Button>
        </div>
      </Card>
      <Disclaimer />
    </div>
  );
}
