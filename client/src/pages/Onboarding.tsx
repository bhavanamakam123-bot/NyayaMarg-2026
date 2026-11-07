import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Button, Field, inputClass } from "../components/Ui";
import { useAuth } from "../context/Auth";
import { api, type Profile } from "../lib/api";

const steps = ["Language", "Location", "Age", "Services", "Accessibility"];

export function Onboarding() {
  const { profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [states, setStates] = useState<Array<{ name: string; districts: string[] }>>([]);
  const [language, setLanguage] = useState(profile?.language || "en");
  const [stateName, setStateName] = useState(profile?.state || "");
  const [district, setDistrict] = useState(profile?.district || "");
  const [ageGroup, setAgeGroup] = useState(profile?.age_group || "26_40");
  const [textSize, setTextSize] = useState(profile?.text_size || "md");
  const [voice, setVoice] = useState(Boolean(profile?.voice_assist));

  useEffect(() => {
    void api<{ states: typeof states }>("/api/states").then((data) => setStates(data.states));
  }, []);

  async function finish() {
    const data = await api<{ profile: Profile }>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ language, state: stateName, district, ageGroup, textSize, voiceAssist: voice, onboardingComplete: true }),
    });
    setProfile(data.profile);
    navigate("/dashboard");
  }

  const districts = states.find((item) => item.name === stateName)?.districts || [];

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Logo />
      <p className="mt-8 text-sm text-gold">Step {step + 1} of {steps.length}: {steps[step]}</p>
      <div className="mt-3 h-2 rounded-full bg-white">
        <div className="h-2 rounded-full bg-royal" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        {step === 0 && (
          <Field label="Which language should NyayaMarg use?">
            <select className={inputClass} value={language} onChange={(event) => setLanguage(event.target.value as Profile["language"])}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
            </select>
          </Field>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <Field label="State, for legal aid">
              <select className={inputClass} value={stateName} onChange={(event) => setStateName(event.target.value)}>
                {states.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
            </Field>
            <Field label="District">
              <input className={inputClass} list="districts" value={district} onChange={(event) => setDistrict(event.target.value)} />
              <datalist id="districts">{districts.map((item) => <option key={item} value={item} />)}</datalist>
            </Field>
          </div>
        )}
        {step === 2 && (
          <div>
            <Field label="Age group">
              <select className={inputClass} value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
                <option value="under_18">Under 18</option>
                <option value="18_25">18–25</option>
                <option value="26_40">26–40</option>
                <option value="41_60">41–60</option>
                <option value="60_plus">60 and above</option>
              </select>
            </Field>
            {ageGroup === "under_18" && <p className="mt-4 rounded-xl bg-[#fbf7ef] p-3 text-sm text-navy">A child should use NyayaMarg with a parent or guardian. Childline is 1098. A child is a category for legal services under section 12 of the Legal Services Authorities Act, 1987. This app does not decide eligibility.</p>}
          </div>
        )}
        {step === 3 && (
          <ul className="space-y-2 text-sm leading-6">
            <li>Describe a problem and see provisions from the checked library, with India Code or gazette links.</li>
            <li>Build an action plan that changes with the category.</li>
            <li>Find a State Legal Services Authority from the NALSA directory.</li>
            <li>Keep a private evidence checklist, a case reference, and a draft notice.</li>
            <li>NyayaMarg does not file cases and does not predict a result.</li>
          </ul>
        )}
        {step === 4 && (
          <div className="space-y-3">
            <Field label="Text size">
              <select className={inputClass} value={textSize} onChange={(event) => setTextSize(event.target.value as Profile["text_size"])}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra large</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={voice} onChange={(event) => setVoice(event.target.checked)} /> Show listen buttons for voice assistance</label>
          </div>
        )}
        <div className="mt-6 flex gap-2">
          {step > 0 && <Button kind="ghost" type="button" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 4 ? <Button type="button" onClick={() => setStep(step + 1)}>Continue</Button> : <Button type="button" onClick={() => void finish()}>Open dashboard</Button>}
        </div>
      </section>
    </main>
  );
}
