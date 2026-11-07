import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, Disclaimer, Field, inputClass } from "../components/Ui";
import { api, download } from "../lib/api";

type Draft = { watermark: string; sections: Record<string, string>; disclaimer: string };

export function Notice() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [section, setSection] = useState("facts");
  const [edit, setEdit] = useState("");

  useEffect(() => { if (draft) setEdit(draft.sections[section] || ""); }, [section, draft]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = await api<{ id: number; draft: Draft }>("/api/notices", {
      method: "POST",
      body: JSON.stringify({
        disputeType: form.get("disputeType"),
        recipientName: form.get("recipientName"),
        recipientAddress: form.get("recipientAddress"),
        dates: form.get("dates"),
        events: form.get("events"),
        relief: form.get("relief"),
        evidence: form.get("evidence"),
        categoryId: form.get("categoryId") || null,
      }),
    });
    setId(data.id);
    setDraft(data.draft);
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Legal Notice Draft Generator</h1>
      <p className="mt-2 max-w-3xl rounded-xl bg-[#fbf7ef] p-3 text-sm">Every notice is a draft. Have a qualified lawyer or legal aid professional read it before it is sent. Dates and sections are not invented beyond what you type and what the library matched.</p>
      <form className="mt-4 grid gap-3" onSubmit={submit}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Type of dispute"><input className={inputClass} name="disputeType" required /></Field>
          <Field label="Category, if you know it">
            <select className={inputClass} name="categoryId" defaultValue="">
              <option value="">Do not attach a provision</option>
              <option value="consumer">Consumer</option>
              <option value="cyber">Cyber</option>
              <option value="cheque">Cheque</option>
              <option value="labour">Labour</option>
              <option value="tenancy">Tenancy</option>
            </select>
          </Field>
          <Field label="Recipient"><input className={inputClass} name="recipientName" required /></Field>
          <Field label="Recipient address"><input className={inputClass} name="recipientAddress" /></Field>
          <Field label="Important dates"><input className={inputClass} name="dates" /></Field>
          <Field label="Evidence you actually have"><input className={inputClass} name="evidence" /></Field>
        </div>
        <Field label="What happened"><textarea className={inputClass + " min-h-28"} name="events" required minLength={10} /></Field>
        <Field label="Relief you are asking for"><textarea className={inputClass} name="relief" required /></Field>
        <Button type="submit">Generate draft</Button>
      </form>
      {draft && id && (
        <Card className="mt-5">
          <p className="text-sm font-semibold text-gold">{draft.watermark}</p>
          {Object.entries(draft.sections).map(([key, value]) => <section key={key} className="mt-4"><h2 className="text-sm uppercase tracking-wide text-navy">{key}</h2><p className="whitespace-pre-wrap text-sm">{value}</p></section>)}
          <div className="mt-4 flex flex-wrap gap-2">
            <select className={inputClass + " max-w-xs"} value={section} onChange={(event) => setSection(event.target.value)} aria-label="Section">{Object.keys(draft.sections).map((key) => <option key={key}>{key}</option>)}</select>
            <Button kind="ghost" type="button" onClick={() => void api<{ draft: Draft }>(`/api/notices/${id}/regenerate`, { method: "POST", body: JSON.stringify({ section }) }).then((data) => setDraft(data.draft))}>Regenerate section</Button>
            <Button kind="ghost" type="button" onClick={() => void download(`/api/notices/${id}/pdf`, "nyayamarg-draft-notice.pdf")}>Download PDF</Button>
          </div>
          <textarea className="mt-3 min-h-24 w-full rounded-xl border border-line p-3" value={edit} onChange={(event) => setEdit(event.target.value)} />
          <Button className="mt-2" type="button" onClick={() => void api<{ draft: Draft }>(`/api/notices/${id}`, { method: "PATCH", body: JSON.stringify({ section, text: edit }) }).then((data) => setDraft(data.draft))}>Save edit</Button>
        </Card>
      )}
      <Disclaimer />
    </div>
  );
}
