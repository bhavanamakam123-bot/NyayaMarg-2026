import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/Auth";
import { Shell } from "./components/Shell";
import { Welcome } from "./pages/Welcome";
import { Reset } from "./pages/Reset";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { Analyzer } from "./pages/Analyzer";
import { Planner } from "./pages/Planner";
import { LegalAid } from "./pages/LegalAid";
import { Evidence } from "./pages/Evidence";
import { Cases } from "./pages/Cases";
import { Updates } from "./pages/Updates";
import { Notice } from "./pages/Notice";
import { Urgency } from "./pages/Urgency";
import { Quiz } from "./pages/Quiz";
import { Assistant } from "./pages/Assistant";
import { Profile } from "./pages/Profile";

function Gate({ children, onboarded }: { children: ReactNode; onboarded?: boolean }) {
  const { profile, loading } = useAuth();
  if (loading) return <p className="p-8">Loading NyayaMarg…</p>;
  if (!profile) return <Navigate to="/" replace />;
  if (onboarded && !profile.onboarding_complete) return <Navigate to="/onboarding" replace />;
  if (onboarded === false && profile.onboarding_complete) return <Navigate to="/dashboard" replace />;
  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/onboarding" element={<Gate onboarded={false}><Onboarding /></Gate>} />
      <Route element={<Gate onboarded><Shell /></Gate>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/aid" element={<LegalAid />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/urgency" element={<Urgency />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
