import type { ReactNode } from "react";
import { useAuth } from "../context/Auth";
import { t } from "../lib/i18n";
import { speak } from "../lib/speech";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-white p-5 shadow-[0_10px_30px_rgba(11,31,58,0.05)] ${className}`}>{children}</section>;
}

export function Button({ children, kind = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: "primary" | "ghost" | "gold" }) {
  const styles = kind === "primary"
    ? "bg-royal text-white hover:bg-navy"
    : kind === "gold"
      ? "bg-gold text-white hover:bg-navy"
      : "border border-line bg-white text-navy hover:bg-paper";
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60 ${styles} ${props.className || ""}`}>{children}</button>;
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-navy">
      {label}
      <div className="mt-1">{children}</div>
      {error && <span role="alert" className="mt-1 block text-sm font-normal text-red-800">{error}</span>}
    </label>
  );
}

export const inputClass = "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink outline-none";

export function Disclaimer() {
  const { lang, profile } = useAuth();
  const text = t(lang).disclaimer;
  return (
    <p className="mt-8 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-gold/30 bg-[#fbf7ef] px-4 py-3 text-sm text-navy">
      <span>{text}</span>
      {profile?.voice_assist ? <button className="font-semibold text-royal" onClick={() => speak(text, lang)} type="button">Listen</button> : null}
    </p>
  );
}

export function Ring({ value, label }: { value: number; label: string }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  return (
    <div className="text-center">
      <svg width="100" height="100" viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value} out of 100`}>
        <circle cx="50" cy="50" r={radius} stroke="#d5deea" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r={radius} stroke="#1e4b8f" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (value / 100) * circ} transform="rotate(-90 50 50)" />
        <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#0b1f3a">{value}</text>
      </svg>
      <p className="max-w-36 text-sm text-navy">{label}</p>
    </div>
  );
}

export function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-paper" aria-hidden="true">
      <div className="h-2 rounded-full bg-royal" style={{ width: `${value}%` }} />
    </div>
  );
}
