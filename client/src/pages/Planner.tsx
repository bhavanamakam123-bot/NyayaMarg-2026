import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Card, Disclaimer } from "../components/Ui";
import { api, download } from "../lib/api";

type Step = { id: number; number: number; title: string; explanation: string; documents: string[]; where: string; url: string | null; urlLabel: string | null; timing: string | null; completed: boolean };
type Plan = { id: number; title: string; scenarioId: number; flow: Array<{ title: string; detail: string }>; steps: Step[] };

export function Planner() {
  const [params] = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const data = await api<{ plans: Plan[] }>("/api/plans");
    setPlans(data.plans);
  }
  useEffect(() => {
    const scenario = params.get("scenario");
    void (async () => {
      if (scenario) {
        const created = await api<{ planId: number }>(`/api/scenarios/${scenario}/plan`, { method: "POST" });
        setMessage(`Plan ${created.planId} is saved on your dashboard.`);
      }
      await load();
    })();
  }, [params]);

  async function toggle(planId: number, step: Step) {
    const data = await api<{ plan: Plan }>(`/api/plans/${planId}/steps/${step.id}`, { method: "PATCH", body: JSON.stringify({ completed: !step.completed }) });
    setPlans(plans.map((plan) => plan.id === planId ? data.plan : plan));
  }

  const current = plans[0];
  const next = current?.steps.find((step) => !step.completed);
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Step-by-Step Legal Action Planner</h1>
      <p className="mt-2 max-w-3xl text-sm">Plans are built from the category identified in your analysis. The path for a cheque is not the path for a consumer order.</p>
      {message && <p className="mt-3 text-sm text-royal">{message}</p>}
      {!current && <Card className="mt-5">Analyse a situation first, then choose Generate My Legal Action Plan.</Card>}
      {current && (
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            {next && <p className="mb-3 rounded-xl bg-navy px-4 py-3 text-white">Next recommended action: {next.title}</p>}
            <ol className="space-y-3">
              {current.steps.map((step, index) => (
                <li key={step.id}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold text-navy">Step {step.number}. {step.title}</h2>
                      <label className="text-sm"><input type="checkbox" checked={step.completed} onChange={() => void toggle(current.id, step)} /> Done</label>
                    </div>
                    <p className="mt-2 text-sm">{step.explanation}</p>
                    <p className="mt-2 text-sm"><strong>Documents: </strong>{step.documents.join(", ") || "None listed"}</p>
                    <p className="text-sm"><strong>Where: </strong>{step.where}</p>
                    {step.url && <a className="text-sm text-royal" href={step.url} target="_blank" rel="noreferrer">{step.urlLabel || step.url}</a>}
                    <p className="mt-1 text-sm">{step.timing || "No statutory timing is attached to this preparatory step."}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gold">{step.completed ? "Completed" : "Pending"}</p>
                  </Card>
                  {index < current.steps.length - 1 && <div className="py-1 text-center text-xl text-royal" aria-hidden="true">↓</div>}
                </li>
              ))}
            </ol>
            <Button className="mt-4" type="button" onClick={() => void download(`/api/plans/${current.id}/pdf`, "nyayamarg-action-plan.pdf")}>Download PDF</Button>
          </div>
          <Card>
            <h2 className="font-serif text-xl">Real-world path for this issue</h2>
            <ol className="mt-4 space-y-2">
              {current.flow.map((node, index) => (
                <li key={node.title}>
                  <div className="rounded-xl border border-line px-3 py-2"><strong>{node.title}</strong><span className="mt-1 block text-sm">{node.detail}</span></div>
                  {index < current.flow.length - 1 && <div className="text-center text-royal">↓</div>}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}
      <Disclaimer />
    </div>
  );
}
