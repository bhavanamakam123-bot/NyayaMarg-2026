import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type Profile } from "../lib/api";
import type { Lang } from "../lib/i18n";

type AuthValue = {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
  lang: Lang;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await api<{ profile: Profile }>("/api/auth/me");
      setProfile(data.profile);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const lang = profile?.language || "en";
  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : lang === "te" ? "te" : "en";
    document.documentElement.dataset.text = profile?.text_size || "md";
  }, [lang, profile?.text_size]);

  const value = useMemo(() => ({ profile, loading, refresh, setProfile, lang }), [profile, loading, lang]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("Auth missing");
  return value;
}
