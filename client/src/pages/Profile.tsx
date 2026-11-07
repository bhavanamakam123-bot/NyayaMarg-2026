import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, Disclaimer, Field, inputClass } from "../components/Ui";
import { useAuth } from "../context/Auth";
import { api, type Profile } from "../lib/api";

export function Profile() {
  const { profile, setProfile } = useAuth();
  const [states, setStates] = useState<Array<{ name: string; districts: string[] }>>([]);
  const [message, setMessage] = useState("");
  useEffect(() => { void api<{ states: typeof states }>("/api/states").then((data) => setStates(data.states)); }, []);
  if (!profile) return null;
  const districts = states.find((item) => item.name === profile.state)?.districts || [];
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = await api<{ profile: Profile }>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        fullName: form.get("fullName"),
        mobile: form.get("mobile") || "",
        state: form.get("state"),
        district: form.get("district"),
        language: form.get("language"),
        textSize: form.get("textSize"),
        voiceAssist: form.get("voiceAssist") === "on",
        ageGroup: form.get("ageGroup"),
      }),
    });
    setProfile(data.profile);
    setMessage("Profile updated.");
  }
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Profile</h1>
      <Card className="mt-4 max-w-xl">
        <form className="space-y-3" onSubmit={save}>
          <Field label="Full name"><input className={inputClass} name="fullName" defaultValue={profile.full_name} required /></Field>
          <Field label="Email"><input className={inputClass} value={profile.email} disabled /></Field>
          <Field label="Mobile"><input className={inputClass} name="mobile" defaultValue={profile.mobile || ""} /></Field>
          <Field label="Age group">
            <select className={inputClass} name="ageGroup" defaultValue={profile.age_group}>
              <option value="under_18">Under 18</option>
              <option value="18_25">18–25</option>
              <option value="26_40">26–40</option>
              <option value="41_60">41–60</option>
              <option value="60_plus">60 and above</option>
            </select>
          </Field>
          <Field label="State"><select className={inputClass} name="state" defaultValue={profile.state}>{states.map((item) => <option key={item.name}>{item.name}</option>)}</select></Field>
          <Field label="District"><input className={inputClass} name="district" list="districts" defaultValue={profile.district} /><datalist id="districts">{districts.map((item) => <option key={item} value={item} />)}</datalist></Field>
          <Field label="Language">
            <select className={inputClass} name="language" defaultValue={profile.language}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
            </select>
          </Field>
          <Field label="Text size">
            <select className={inputClass} name="textSize" defaultValue={profile.text_size}>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra large</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm"><input name="voiceAssist" type="checkbox" defaultChecked={Boolean(profile.voice_assist)} /> Voice assistance buttons</label>
          {message && <p className="text-sm text-royal">{message}</p>}
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
      <Disclaimer />
    </div>
  );
}
