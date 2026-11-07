import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Field, inputClass } from "../components/Ui";
import { api, ApiError } from "../lib/api";

export function Reset() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/auth/reset", { method: "POST", body: JSON.stringify({ token: params.get("token"), password: form.get("password"), confirmPassword: form.get("confirmPassword") }) });
      setMessage("Password updated. You can log in.");
      setError("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Try again.");
    }
  }
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-serif text-3xl text-navy">Choose a new password</h1>
      <form className="mt-6 space-y-3" onSubmit={submit}>
        <Field label="New password"><input className={inputClass} name="password" type="password" minLength={8} required /></Field>
        <Field label="Confirm password"><input className={inputClass} name="confirmPassword" type="password" minLength={8} required /></Field>
        {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
        {message && <p className="text-sm text-navy">{message} <Link className="text-royal" to="/">Login</Link></p>}
        <Button type="submit">Update password</Button>
      </form>
    </main>
  );
}
