import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Button, Field, inputClass } from "../components/Ui";
import { useAuth } from "../context/Auth";
import { api, ApiError, type Profile } from "../lib/api";

const ages = [
  ["under_18", "Under 18"],
  ["18_25", "18–25"],
  ["26_40", "26–40"],
  ["41_60", "41–60"],
  ["60_plus", "60 and above"],
];

export function Welcome() {
  const { profile, loading, setProfile } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [states, setStates] = useState<Array<{ name: string; districts: string[] }>>([]);
  const [stateName, setStateName] = useState("Telangana");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void api<{ states: typeof states }>("/api/states").then((data) => setStates(data.states)).catch(() => undefined);
  }, []);

  if (!loading && profile) return <Navigate to={profile.onboarding_complete ? "/dashboard" : "/onboarding"} replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "login") {
        const data = await api<{ profile: Profile }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
        setProfile(data.profile);
        navigate(data.profile.onboarding_complete ? "/dashboard" : "/onboarding");
      } else if (mode === "forgot") {
        const data = await api<{ message: string; devResetUrl?: string }>("/api/auth/forgot", { method: "POST", body: JSON.stringify({ email: form.get("email") }) });
        setInfo(data.devResetUrl ? `${data.message} Development link: ${data.devResetUrl}` : data.message);
      } else {
        const data = await api<{ profile: Profile }>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            fullName: form.get("fullName"),
            email: form.get("email"),
            mobile: form.get("mobile") || "",
            password: form.get("password"),
            confirmPassword: form.get("confirmPassword"),
            ageGroup: form.get("ageGroup"),
            state: form.get("state"),
            district: form.get("district"),
            language: form.get("language"),
            consent: form.get("consent") === "on",
          }),
        });
        setProfile(data.profile);
        navigate("/onboarding");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Try again.");
    } finally {
      setBusy(false);
    }
  }

  const districts = states.find((item) => item.name === stateName)?.districts || [];

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden bg-navy px-8 py-10 text-white lg:px-14">
        <div className="absolute -right-8 top-16 h-56 w-56 rounded-full border border-gold-2/30" />
        <div className="absolute bottom-10 left-8 h-32 w-32 rounded-full border border-white/10" />
        <Logo light />
        <h1 className="mt-16 max-w-xl font-serif text-4xl leading-tight lg:text-5xl">Know Your Rights. Understand the Law. Take the Right Action.</h1>
        <p className="mt-6 max-w-lg text-lg text-white/85">NyayaMarg helps a person in India describe a problem, see provisions drawn from a checked knowledge base, and move toward a real helpline, legal aid office, or official portal.</p>
        <ul className="mt-10 grid max-w-lg gap-3 text-sm text-white/80">
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Scenario analysis with text, voice, and document upload.</li>
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Action plans linked to consumer, cyber, cheque, labour, tenancy, and traffic routes.</li>
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">State Legal Services Authorities from the NALSA directory, not invented offices.</li>
        </ul>
      </section>
      <section className="flex items-center px-6 py-10 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">NyayaMarg</p>
          <h2 className="mt-2 font-serif text-3xl text-navy">{mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset your password"}</h2>
          <p className="mt-2 text-sm text-ink/75">No identity document is asked for. Passwords are stored only as a hash.</p>
          <div className="mt-5 flex gap-2 text-sm">
            <button className={mode === "login" ? "font-semibold text-royal" : ""} type="button" onClick={() => setMode("login")}>Login</button>
            <button className={mode === "register" ? "font-semibold text-royal" : ""} type="button" onClick={() => setMode("register")}>Create account</button>
            <button className={mode === "forgot" ? "font-semibold text-royal" : ""} type="button" onClick={() => setMode("forgot")}>Forgot password</button>
          </div>
          <form className="mt-5 space-y-3" onSubmit={submit}>
            {mode === "register" && (
              <>
                <Field label="Full name"><input className={inputClass} name="fullName" required minLength={2} /></Field>
                <Field label="Mobile number, optional"><input className={inputClass} name="mobile" inputMode="numeric" placeholder="10 digits" /></Field>
                <Field label="Age group">
                  <select className={inputClass} name="ageGroup" defaultValue="26_40">{ages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                </Field>
                <Field label="State">
                  <select className={inputClass} name="state" value={stateName} onChange={(event) => setStateName(event.target.value)}>
                    {states.map((item) => <option key={item.name}>{item.name}</option>)}
                  </select>
                </Field>
                <Field label="District">
                  <input className={inputClass} name="district" list="districts" required />
                  <datalist id="districts">{districts.map((item) => <option key={item} value={item} />)}</datalist>
                </Field>
                <Field label="Preferred language">
                  <select className={inputClass} name="language" defaultValue="en">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                  </select>
                </Field>
              </>
            )}
            <Field label="Email"><input className={inputClass} name="email" type="email" required autoComplete="email" /></Field>
            {mode !== "forgot" && <Field label="Password"><input className={inputClass} name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} /></Field>}
            {mode === "register" && <Field label="Confirm password"><input className={inputClass} name="confirmPassword" type="password" required minLength={8} /></Field>}
            {mode === "register" && (
              <label className="flex items-start gap-2 text-sm">
                <input className="mt-1" name="consent" type="checkbox" required />
                <span>I agree to the privacy note and terms: NyayaMarg stores my profile to provide this service and does not ask for identity documents at signup.</span>
              </label>
            )}
            {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>}
            {info && <p className="rounded-xl bg-paper px-3 py-2 text-sm text-navy">{info}</p>}
            <Button disabled={busy} type="submit">{busy ? "Please wait…" : mode === "login" ? "Login" : mode === "register" ? "Create account" : "Prepare reset link"}</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
