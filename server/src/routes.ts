import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { checkPassword, clearSession, hashPassword, hashToken, requireUser, setSession } from "./auth.js";
import { AID_NOTE } from "./data/aid.js";
import { DISCLAIMER } from "./data/knowledge.js";
import { STATES } from "./data/states.js";
import { notify, now, sql, ROOT } from "./db.js";
import { analyzeScenario, assessUrgency, assistantAnswer, draftNotice, planFromCategory } from "./services/engine.js";
import { renderPdf } from "./services/pdf.js";

function uid(req: { userId?: number }) {
  return req.userId ?? 0;
}
function pid(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export const api = Router();

const uploadDir = path.join(ROOT, "data", "uploads");
const storage = multer.diskStorage({
  destination(req, _file, cb) {
    const dir = path.join(uploadDir, String(uid(req) || "anon"));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 8);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = ["application/pdf", "image/png", "image/jpeg", "image/webp", "text/plain"].includes(file.mimetype);
    cb(null, ok);
  },
});

function profileFor(userId: number) {
  return sql(`SELECT u.id, u.email, u.created_at, p.full_name, p.mobile, p.age_group, p.state, p.district,
    p.language, p.onboarding_complete, p.text_size, p.voice_assist, p.interests
    FROM users u JOIN user_profiles p ON p.user_id = u.id WHERE u.id = ?`).get(userId);
}

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  mobile: z.string().trim().regex(/^$|^[6-9]\d{9}$/, "Enter a 10-digit mobile number or leave it blank."),
  password: z.string().min(8).regex(/[A-Za-z]/, "Use at least one letter.").regex(/\d/, "Use at least one number."),
  confirmPassword: z.string(),
  ageGroup: z.enum(["under_18", "18_25", "26_40", "41_60", "60_plus"]),
  state: z.string().trim().min(2),
  district: z.string().trim().min(2).max(80),
  language: z.enum(["en", "hi", "te"]),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent to the privacy note and terms is required." }) }),
}).refine((value) => value.password === value.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

api.get("/health", (_req, res) => res.json({ ok: true }));

api.get("/meta", (_req, res) => {
  res.json({
    disclaimer: DISCLAIMER,
    integrations: {
      database: { live: true, detail: "Local SQLite database on this computer. Supabase is not connected because no Supabase credentials were provided." },
      auth: { live: true, detail: "Passwords are hashed with bcrypt. The session is an httpOnly cookie, not localStorage." },
      ai: {
        live: true,
        detail: process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY
          ? "Retrieval knowledge base is live. A model key is set and may only simplify wording."
          : "Retrieval knowledge base is live. No external model key is set, so NyayaMarg does not call a generative API.",
      },
      maps: {
        live: Boolean(process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY),
        detail: process.env.GOOGLE_MAPS_API_KEY
          ? "Google Geocoding key is set."
          : "Google Maps key is not set. Office addresses open in Google Maps search, with an embed of the published address.",
      },
      ecourts: { live: false, detail: "No authorised eCourts case-status API is configured. Saved cases store only what you type, plus a link to the official portal." },
      email: { live: Boolean(process.env.SMTP_HOST), detail: process.env.SMTP_HOST ? "SMTP is configured." : "SMTP is not configured. In development, a reset link can be shown once." },
      storage: { live: true, detail: "Uploads stay on this server and download only for the signed-in owner." },
    },
  });
});

api.get("/states", (_req, res) => res.json({ states: STATES }));

api.post("/auth/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || "Check the form." });
  const data = parsed.data;
  const existing = sql("SELECT id FROM users WHERE email = ?").get(data.email.toLowerCase());
  if (existing) return res.status(409).json({ error: "An account with this email already exists." });
  const created = now();
  const result = sql("INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)").run(data.email.toLowerCase(), hashPassword(data.password), created);
  const userId = Number(result.lastInsertRowid);
  sql(`INSERT INTO user_profiles
    (user_id, full_name, mobile, age_group, state, district, language, consent_at, interests)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]')`).run(userId, data.fullName, data.mobile || null, data.ageGroup, data.state, data.district, data.language, created);
  notify(userId, "Welcome to NyayaMarg", "Your account is ready. Finish the short onboarding to set language, location, and accessibility.", "welcome");
  setSession(res, userId);
  res.status(201).json({ profile: profileFor(userId) });
});

api.post("/auth/login", (req, res) => {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter your email and password." });
  const user = sql("SELECT id, password_hash FROM users WHERE email = ?").get(parsed.data.email.toLowerCase()) as { id: number; password_hash: string } | undefined;
  if (!user || !checkPassword(parsed.data.password, user.password_hash)) {
    return res.status(401).json({ error: "The email or password is not correct." });
  }
  setSession(res, user.id);
  res.json({ profile: profileFor(user.id) });
});

api.post("/auth/logout", (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

api.get("/auth/me", requireUser, (req, res) => {
  res.json({ profile: profileFor(uid(req)) });
});

api.post("/auth/forgot", async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter the email on the account." });
  const user = sql("SELECT id FROM users WHERE email = ?").get(parsed.data.email.toLowerCase()) as { id: number } | undefined;
  let devResetUrl: string | undefined;
  if (user) {
    const token = crypto.randomBytes(24).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    sql("INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)").run(user.id, hashToken(token), expires);
    const url = `${process.env.APP_URL || "http://localhost:5173"}/reset?token=${token}`;
    const outbox = path.join(ROOT, "data", "outbox.log");
    fs.appendFileSync(outbox, `${new Date().toISOString()} reset ${parsed.data.email} ${url}\n`);
    if (process.env.SMTP_HOST) {
      try {
        const nodemailer = await import("nodemailer") as { createTransport: (options: object) => { sendMail: (mail: object) => Promise<unknown> } };
        const transport = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        });
        await transport.sendMail({
          from: process.env.SMTP_FROM || "noreply@localhost",
          to: parsed.data.email,
          subject: "Reset your NyayaMarg password",
          text: `Open this link within one hour to choose a new password:\n${url}\nIf you did not ask for this, ignore it.`,
        });
      } catch (error) {
        console.error("SMTP send failed", error);
      }
    } else if (process.env.ALLOW_DEV_RESET_LINK !== "false" && process.env.NODE_ENV !== "production") {
      devResetUrl = url;
    }
  }
  res.json({
    message: "If that email has an account, a reset link has been prepared. With SMTP configured it is emailed. Without SMTP, development can show the link once.",
    devResetUrl,
  });
});

api.post("/auth/reset", (req, res) => {
  const parsed = z.object({
    token: z.string().min(10),
    password: z.string().min(8).regex(/[A-Za-z]/).regex(/\d/),
    confirmPassword: z.string(),
  }).refine((value) => value.password === value.confirmPassword, { message: "Passwords do not match." }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || "Check the new password." });
  const row = sql("SELECT id, user_id, expires_at, used_at FROM password_resets WHERE token_hash = ?").get(hashToken(parsed.data.token)) as { id: number; user_id: number; expires_at: string; used_at: string | null } | undefined;
  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ error: "This reset link is invalid or has expired." });
  }
  sql("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(parsed.data.password), row.user_id);
  sql("UPDATE password_resets SET used_at = ? WHERE id = ?").run(now(), row.id);
  res.json({ ok: true });
});

api.patch("/profile", requireUser, (req, res) => {
  const parsed = z.object({
    fullName: z.string().trim().min(2).max(120).optional(),
    mobile: z.string().trim().regex(/^$|^[6-9]\d{9}$/).optional(),
    ageGroup: z.enum(["under_18", "18_25", "26_40", "41_60", "60_plus"]).optional(),
    state: z.string().trim().min(2).optional(),
    district: z.string().trim().min(2).optional(),
    language: z.enum(["en", "hi", "te"]).optional(),
    textSize: z.enum(["sm", "md", "lg", "xl"]).optional(),
    voiceAssist: z.boolean().optional(),
    interests: z.array(z.string()).max(12).optional(),
    onboardingComplete: z.boolean().optional(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || "Check the profile fields." });
  const current = profileFor(uid(req)) as Record<string, unknown>;
  const data = parsed.data;
  const textOf = (value: unknown) => (value == null ? "" : String(value));
  sql(`UPDATE user_profiles SET full_name=?, mobile=?, age_group=?, state=?, district=?, language=?, text_size=?, voice_assist=?, interests=?, onboarding_complete=? WHERE user_id=?`).run(
    textOf(data.fullName ?? current.full_name),
    data.mobile === undefined ? current.mobile == null ? null : String(current.mobile) : data.mobile || null,
    textOf(data.ageGroup ?? current.age_group),
    textOf(data.state ?? current.state),
    textOf(data.district ?? current.district),
    textOf(data.language ?? current.language),
    textOf(data.textSize ?? current.text_size),
    data.voiceAssist === undefined ? Number(current.voice_assist) : data.voiceAssist ? 1 : 0,
    JSON.stringify(data.interests ?? JSON.parse(String(current.interests || "[]"))),
    data.onboardingComplete === undefined ? Number(current.onboarding_complete) : data.onboardingComplete ? 1 : 0,
    uid(req),
  );
  res.json({ profile: profileFor(uid(req)) });
});

api.get("/dashboard", requireUser, (req, res) => {
  const userId = uid(req);
  const scenarios = sql("SELECT id, title, category_hint, created_at FROM legal_scenarios WHERE user_id = ? ORDER BY id DESC LIMIT 5").all(userId);
  const saved = sql("SELECT target_id, created_at FROM bookmarks WHERE user_id = ? AND target_type = 'provision' ORDER BY id DESC LIMIT 6").all(userId);
  const steps = sql("SELECT COUNT(*) AS n FROM action_steps WHERE user_id = ? AND completed = 0").get(userId) as { n: number };
  const evidence = sql(`SELECT
      SUM(CASE WHEN available = 1 THEN 1 ELSE 0 END) AS done,
      COUNT(*) AS total
    FROM evidence_items WHERE user_id = ? AND origin = 'ai'`).get(userId) as { done: number | null; total: number | null };
  const cases = sql("SELECT id, cnr, case_number, court, updated_at FROM saved_cases WHERE user_id = ? ORDER BY id DESC LIMIT 4").all(userId);
  const updates = sql("SELECT id, title, published_on, category, status FROM legal_updates ORDER BY published_on DESC LIMIT 3").all();
  const notifications = sql("SELECT id, title, body, kind, read_at, created_at FROM user_notifications WHERE user_id = ? ORDER BY id DESC LIMIT 8").all(userId);
  res.json({ scenarios, saved, pendingSteps: steps.n, evidence, cases, updates, notifications });
});

api.get("/notifications", requireUser, (req, res) => {
  res.json({ notifications: sql("SELECT * FROM user_notifications WHERE user_id = ? ORDER BY id DESC LIMIT 30").all(uid(req)) });
});

api.post("/notifications/:id/read", requireUser, (req, res) => {
  sql("UPDATE user_notifications SET read_at = ? WHERE id = ? AND user_id = ?").run(now(), pid(req.params.id), uid(req));
  res.json({ ok: true });
});

api.post("/uploads", requireUser, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Choose a PDF, image, or text file under 8 MB." });
  const result = sql(`INSERT INTO uploaded_documents
    (user_id, original_name, stored_name, mime, size, created_at) VALUES (?, ?, ?, ?, ?, ?)`).run(
    uid(req), req.file.originalname, req.file.filename, req.file.mimetype, req.file.size, now(),
  );
  let extracted = "";
  if (req.file.mimetype === "text/plain") extracted = fs.readFileSync(req.file.path, "utf8").slice(0, 4000);
  res.status(201).json({
    id: Number(result.lastInsertRowid),
    name: req.file.originalname,
    extracted,
    note: req.file.mimetype === "text/plain"
      ? "Text from the file was read."
      : "The file is stored. Image and PDF text extraction is not configured, so add a short description of what the document says.",
  });
});

api.get("/uploads/:id", requireUser, (req, res) => {
  const row = sql("SELECT * FROM uploaded_documents WHERE id = ? AND user_id = ?").get(pid(req.params.id), uid(req)) as { stored_name: string; original_name: string; mime: string } | undefined;
  if (!row) return res.status(404).json({ error: "That file was not found." });
  const full = path.join(uploadDir, String(uid(req)), row.stored_name);
  if (!full.startsWith(path.join(uploadDir, String(uid(req))))) return res.status(400).end();
  res.setHeader("Content-Type", row.mime);
  res.setHeader("Content-Disposition", `attachment; filename="${row.original_name.replace(/"/g, "")}"`);
  res.sendFile(full);
});

api.post("/scenarios/analyze", requireUser, (req, res) => {
  const parsed = z.object({
    text: z.string().trim().min(8, "Describe the situation in a sentence or more.").max(8000),
    categoryHint: z.string().optional().nullable(),
    documentIds: z.array(z.number()).max(8).optional(),
    language: z.enum(["en", "hi", "te"]).optional(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || "Describe the situation." });
  const profile = profileFor(uid(req)) as { language: "en" | "hi" | "te" };
  const docs = (parsed.data.documentIds || []).map((id) => sql("SELECT id, original_name FROM uploaded_documents WHERE id = ? AND user_id = ?").get(id, uid(req)) as { id: number; original_name: string } | undefined).filter(Boolean) as { id: number; original_name: string }[];
  const textBits = docs.map((doc) => {
    const full = sql("SELECT stored_name, mime FROM uploaded_documents WHERE id = ?").get(doc.id) as { stored_name: string; mime: string };
    if (full.mime === "text/plain") {
      const body = fs.readFileSync(path.join(uploadDir, String(uid(req)), full.stored_name), "utf8").slice(0, 4000);
      return `${doc.original_name}: ${body}`;
    }
    return `Attached file: ${doc.original_name}`;
  });
  const analysis = analyzeScenario({
    text: [parsed.data.text, ...textBits].join("\n"),
    categoryHint: parsed.data.categoryHint,
    documentNames: docs.map((doc) => doc.original_name),
    language: parsed.data.language || profile.language,
  });
  const title = analysis.categoryLabel;
  const scenario = sql("INSERT INTO legal_scenarios (user_id, title, input_text, category_hint, created_at) VALUES (?, ?, ?, ?, ?)").run(
    uid(req), title, parsed.data.text, parsed.data.categoryHint || null, now(),
  );
  const scenarioId = Number(scenario.lastInsertRowid);
  const saved = sql("INSERT INTO scenario_analysis (scenario_id, user_id, category_id, result_json, created_at) VALUES (?, ?, ?, ?, ?)").run(
    scenarioId, uid(req), analysis.categoryId, JSON.stringify(analysis), now(),
  );
  const analysisId = Number(saved.lastInsertRowid);
  for (const provision of analysis.provisions) {
    sql("INSERT INTO scenario_sections (analysis_id, user_id, section_id) VALUES (?, ?, ?)").run(analysisId, uid(req), provision.id);
  }
  for (const doc of docs) sql("UPDATE uploaded_documents SET scenario_id = ? WHERE id = ? AND user_id = ?").run(scenarioId, doc.id, uid(req));
  const checklist = sql("INSERT INTO evidence_checklists (user_id, scenario_id, created_at) VALUES (?, ?, ?)").run(uid(req), scenarioId, now());
  const checklistId = Number(checklist.lastInsertRowid);
  for (const item of analysis.documents) {
    sql("INSERT INTO evidence_items (checklist_id, user_id, name, why, origin, available) VALUES (?, ?, ?, ?, 'ai', 0)").run(checklistId, uid(req), item.name, item.why);
  }
  notify(uid(req), "Analysis saved", `${title} is on your dashboard.`, "analysis");
  res.status(201).json({ scenarioId, analysisId, checklistId, analysis });
});

api.get("/scenarios", requireUser, (req, res) => {
  const rows = sql(`SELECT s.id, s.title, s.input_text, s.created_at, a.category_id, a.result_json
    FROM legal_scenarios s LEFT JOIN scenario_analysis a ON a.scenario_id = s.id
    WHERE s.user_id = ? ORDER BY s.id DESC`).all(uid(req)) as Array<Record<string, unknown>>;
  res.json({
    scenarios: rows.map((row) => ({
      id: row.id,
      title: row.title,
      inputText: row.input_text,
      createdAt: row.created_at,
      categoryId: row.category_id,
      summary: row.result_json ? JSON.parse(String(row.result_json)).problemSummary : "",
    })),
  });
});

api.get("/scenarios/:id", requireUser, (req, res) => {
  const row = sql(`SELECT s.*, a.id AS analysis_id, a.result_json FROM legal_scenarios s
    LEFT JOIN scenario_analysis a ON a.scenario_id = s.id WHERE s.id = ? AND s.user_id = ?`).get(pid(req.params.id), uid(req)) as { result_json: string; analysis_id: number } | undefined;
  if (!row) return res.status(404).json({ error: "That analysis was not found." });
  res.json({ scenario: row, analysis: JSON.parse(row.result_json) });
});

api.post("/scenarios/:id/plan", requireUser, (req, res) => {
  const scenario = sql(`SELECT s.id, a.category_id FROM legal_scenarios s
    JOIN scenario_analysis a ON a.scenario_id = s.id WHERE s.id = ? AND s.user_id = ?`).get(pid(req.params.id), uid(req)) as { id: number; category_id: string | null } | undefined;
  if (!scenario) return res.status(404).json({ error: "Analyse a situation before creating a plan." });
  if (!scenario.category_id) return res.status(400).json({ error: "The analysis did not identify a category, so a plan was not invented. Add facts and analyse again." });
  const existing = sql("SELECT id FROM action_plans WHERE scenario_id = ? AND user_id = ?").get(scenario.id, uid(req)) as { id: number } | undefined;
  if (existing) return res.json({ planId: existing.id, existing: true });
  const profile = profileFor(uid(req)) as { language: "en" | "hi" | "te" };
  const plan = planFromCategory(scenario.category_id, profile.language);
  if (!plan) return res.status(400).json({ error: "No verified plan template exists for this category." });
  const inserted = sql("INSERT INTO action_plans (user_id, scenario_id, category_id, title, flow_json, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
    uid(req), scenario.id, plan.categoryId, plan.label, JSON.stringify(plan.flow), now(),
  );
  const planId = Number(inserted.lastInsertRowid);
  for (const step of plan.steps) {
    sql(`INSERT INTO action_steps
      (plan_id, user_id, step_number, title, explanation, documents_json, place, url, url_label, timing)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(planId, uid(req), step.number, step.title, step.explanation, JSON.stringify(step.documents), step.where, step.url, step.urlLabel, step.timing);
  }
  notify(uid(req), "Action plan saved", plan.label, "plan");
  res.status(201).json({ planId });
});

function planPayload(planId: number, userId: number) {
  const plan = sql("SELECT * FROM action_plans WHERE id = ? AND user_id = ?").get(planId, userId) as Record<string, unknown> | undefined;
  if (!plan) return null;
  const steps = sql("SELECT * FROM action_steps WHERE plan_id = ? AND user_id = ? ORDER BY step_number").all(planId, userId) as Array<Record<string, unknown>>;
  return {
    id: plan.id,
    title: plan.title,
    scenarioId: plan.scenario_id,
    categoryId: plan.category_id,
    flow: JSON.parse(String(plan.flow_json)),
    steps: steps.map((step) => ({
      id: step.id,
      number: step.step_number,
      title: step.title,
      explanation: step.explanation,
      documents: JSON.parse(String(step.documents_json)),
      where: step.place,
      url: step.url,
      urlLabel: step.url_label,
      timing: step.timing,
      completed: Boolean(step.completed),
    })),
  };
}

api.get("/plans", requireUser, (req, res) => {
  const plans = sql("SELECT id FROM action_plans WHERE user_id = ? ORDER BY id DESC").all(uid(req)) as { id: number }[];
  res.json({ plans: plans.map((plan) => planPayload(plan.id, uid(req))) });
});

api.patch("/plans/:planId/steps/:stepId", requireUser, (req, res) => {
  const parsed = z.object({ completed: z.boolean() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose completed or open." });
  const result = sql("UPDATE action_steps SET completed = ? WHERE id = ? AND plan_id = ? AND user_id = ?").run(parsed.data.completed ? 1 : 0, pid(req.params.stepId), pid(req.params.planId), uid(req));
  if (!result.changes) return res.status(404).json({ error: "That step was not found." });
  res.json({ plan: planPayload(Number(pid(req.params.planId)), uid(req)) });
});

api.get("/plans/:id/pdf", requireUser, async (req, res) => {
  const plan = planPayload(Number(pid(req.params.id)), uid(req));
  if (!plan) return res.status(404).json({ error: "That plan was not found." });
  const lines = [String(plan.title), ""];
  for (const step of plan.steps) {
    const docs = Array.isArray(step.documents) ? step.documents.join(", ") : "";
    lines.push(`Step ${step.number}: ${step.title} [${step.completed ? "done" : "open"}]`, String(step.explanation), `Where: ${step.where}`, step.url ? `Link: ${step.url}` : "No single official form link for this step.", step.timing ? `Timing: ${step.timing}` : "No statutory timing is attached to this step.", `Documents: ${docs || "None listed"}`, "");
  }
  const pdf = await renderPdf("Legal action plan", lines);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=nyayamarg-action-plan.pdf");
  res.send(pdf);
});

api.get("/legal-aid", requireUser, async (req, res) => {
  const state = String(req.query.state || "");
  const kind = String(req.query.kind || "all");
  const q = String(req.query.q || "").trim();
  if (kind === "dlsa" || kind === "taluk" || kind === "clinic") {
    return res.json({
      offices: [],
      note: `${AID_NOTE} District, taluk, and clinic addresses are listed by each State Legal Services Authority. Open the state directory instead of relying on an unverified pin.`,
      maps: mapsStatus(),
    });
  }
  let rows = sql("SELECT * FROM legal_aid_locations").all() as Array<Record<string, string | null>>;
  if (state) rows = rows.filter((row) => row.state === state || row.kind === "nalsa");
  if (kind === "slsa") rows = rows.filter((row) => row.kind === "slsa");
  if (kind === "free" || kind === "other") rows = rows.filter((row) => kind === "other" ? row.kind === "sclsc" : true);
  if (q && !/^\d{6}$/.test(q)) {
    const needle = q.toLowerCase();
    rows = rows.filter((row) => `${row.name} ${row.address} ${row.state}`.toLowerCase().includes(needle));
  }
  let geocodeNote: string | null = null;
  if (/^\d{6}$/.test(q)) {
    geocodeNote = process.env.GOOGLE_MAPS_API_KEY
      ? "A PIN was sent to Google Geocoding."
      : "PIN-code matching needs GOOGLE_MAPS_API_KEY. Choose a state to see the published State Legal Services Authority.";
    if (process.env.GOOGLE_MAPS_API_KEY) {
      const located = await geocode(`${q}, India`);
      geocodeNote = located ? `Geocoder placed this PIN near ${located.formatted}. Match the state yourself; distance to an office is not invented.` : "The geocoder did not return a place for that PIN.";
    }
  }
  res.json({
    offices: rows.map((row) => ({
      ...row,
      services: "Legal services under the Legal Services Authorities Act, 1987, for eligible persons, and Lok Adalats. Eligibility is decided by the authority.",
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.name} ${row.address}`)}`,
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(String(row.address))}&z=14&output=embed`,
    })),
    note: AID_NOTE,
    geocodeNote,
    maps: mapsStatus(),
  });
});

api.get("/evidence", requireUser, (req, res) => {
  const lists = sql("SELECT * FROM evidence_checklists WHERE user_id = ? ORDER BY id DESC").all(uid(req)) as Array<{ id: number; scenario_id: number }>;
  res.json({
    checklists: lists.map((list) => ({
      ...list,
      items: sql("SELECT * FROM evidence_items WHERE checklist_id = ? AND user_id = ?").all(list.id, uid(req)),
      files: sql("SELECT id, original_name, item_id, created_at FROM uploaded_documents WHERE user_id = ? AND (scenario_id = ? OR item_id IN (SELECT id FROM evidence_items WHERE checklist_id = ?))").all(uid(req), list.scenario_id, list.id),
    })),
  });
});

api.post("/evidence/:checklistId/items", requireUser, (req, res) => {
  const parsed = z.object({ name: z.string().trim().min(2).max(160) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Name the document." });
  const list = sql("SELECT id FROM evidence_checklists WHERE id = ? AND user_id = ?").get(pid(req.params.checklistId), uid(req));
  if (!list) return res.status(404).json({ error: "That checklist was not found." });
  sql("INSERT INTO evidence_items (checklist_id, user_id, name, why, origin, available) VALUES (?, ?, ?, ?, 'user', 0)").run(pid(req.params.checklistId), uid(req), parsed.data.name, "Added by you.");
  res.status(201).json({ ok: true });
});

api.patch("/evidence/items/:id", requireUser, (req, res) => {
  const parsed = z.object({ available: z.boolean() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Mark the document available or missing." });
  const result = sql("UPDATE evidence_items SET available = ? WHERE id = ? AND user_id = ?").run(parsed.data.available ? 1 : 0, pid(req.params.id), uid(req));
  if (!result.changes) return res.status(404).json({ error: "That item was not found." });
  res.json({ ok: true });
});

api.post("/evidence/items/:id/upload", requireUser, upload.single("file"), (req, res) => {
  const item = sql("SELECT id, checklist_id FROM evidence_items WHERE id = ? AND user_id = ?").get(pid(req.params.id), uid(req)) as { id: number; checklist_id: number } | undefined;
  if (!item || !req.file) return res.status(400).json({ error: "Choose a file for a document you own." });
  const list = sql("SELECT scenario_id FROM evidence_checklists WHERE id = ?").get(item.checklist_id) as { scenario_id: number };
  sql(`INSERT INTO uploaded_documents (user_id, item_id, scenario_id, original_name, stored_name, mime, size, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(uid(req), item.id, list.scenario_id, req.file.originalname, req.file.filename, req.file.mimetype, req.file.size, now());
  sql("UPDATE evidence_items SET available = 1 WHERE id = ?").run(item.id);
  res.status(201).json({ ok: true });
});

api.get("/evidence/:id/pdf", requireUser, async (req, res) => {
  const items = sql("SELECT name, why, origin, available FROM evidence_items WHERE checklist_id = ? AND user_id = ?").all(pid(req.params.id), uid(req)) as Array<{ name: string; why: string; origin: string; available: number }>;
  if (!items.length) return res.status(404).json({ error: "That checklist was not found." });
  const lines = items.map((item) => `${item.available ? "[Have]" : "[Missing]"} ${item.name} (${item.origin === "ai" ? "suggested" : "added by you"}) — ${item.why}`);
  const pdf = await renderPdf("Evidence checklist", lines);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=nyayamarg-checklist.pdf");
  res.send(pdf);
});

api.get("/cases", requireUser, (req, res) => {
  const cases = sql("SELECT * FROM saved_cases WHERE user_id = ? ORDER BY id DESC").all(uid(req)) as Array<{ id: number }>;
  res.json({
    cases: cases.map((item) => ({
      ...item,
      records: sql("SELECT * FROM case_tracking_records WHERE case_id = ? AND user_id = ? ORDER BY id DESC").all(item.id, uid(req)),
    })),
    official: {
      portal: "https://ecourts.gov.in/",
      status: "https://services.ecourts.gov.in/ecourtindia_v6/",
      note: "NyayaMarg does not receive live case status. Anything shown as a hearing or status is text you saved.",
    },
  });
});

api.post("/cases", requireUser, (req, res) => {
  const parsed = z.object({
    cnr: z.string().trim().max(40).optional().or(z.literal("")),
    caseNumber: z.string().trim().max(80).optional().or(z.literal("")),
    court: z.string().trim().max(160).optional().or(z.literal("")),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Check the case reference." });
  if (!parsed.data.cnr && !parsed.data.caseNumber) return res.status(400).json({ error: "Enter a CNR number or a case number." });
  const stamp = now();
  const result = sql("INSERT INTO saved_cases (user_id, cnr, case_number, court, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").run(
    uid(req), parsed.data.cnr || null, parsed.data.caseNumber || null, parsed.data.court || null, stamp, stamp,
  );
  res.status(201).json({ id: Number(result.lastInsertRowid) });
});

api.post("/cases/:id/notes", requireUser, (req, res) => {
  const parsed = z.object({
    note: z.string().trim().min(2).max(2000),
    hearingNote: z.string().trim().max(200).optional().or(z.literal("")),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Write a note about what you saw on the official portal." });
  const owned = sql("SELECT id FROM saved_cases WHERE id = ? AND user_id = ?").get(pid(req.params.id), uid(req));
  if (!owned) return res.status(404).json({ error: "That case was not found." });
  sql("INSERT INTO case_tracking_records (case_id, user_id, note, hearing_note, created_at) VALUES (?, ?, ?, ?, ?)").run(
    pid(req.params.id), uid(req), parsed.data.note, parsed.data.hearingNote || null, now(),
  );
  sql("UPDATE saved_cases SET updated_at = ? WHERE id = ?").run(now(), pid(req.params.id));
  res.status(201).json({ ok: true });
});

api.get("/updates", requireUser, (req, res) => {
  const category = String(req.query.category || "");
  const rows = sql("SELECT * FROM legal_updates ORDER BY published_on DESC").all() as Array<{ id: string; category: string }>;
  const bookmarks = new Set((sql("SELECT target_id FROM bookmarks WHERE user_id = ? AND target_type = 'update'").all(uid(req)) as { target_id: string }[]).map((row) => row.target_id));
  res.json({
    updates: rows.filter((row) => !category || row.category === category).map((row) => ({ ...row, bookmarked: bookmarks.has(row.id) })),
    note: "These entries were copied from official notifications and India Code. A live gazette feed is not connected.",
  });
});

api.post("/bookmarks", requireUser, (req, res) => {
  const parsed = z.object({ targetType: z.enum(["update", "provision"]), targetId: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose something to save." });
  sql("INSERT OR IGNORE INTO bookmarks (user_id, target_type, target_id, created_at) VALUES (?, ?, ?, ?)").run(uid(req), parsed.data.targetType, parsed.data.targetId, now());
  if (parsed.data.targetType === "update") {
    notify(uid(req), "Update bookmarked", "You will see it under saved items. Email alerts need SMTP.", "update");
  }
  res.json({ ok: true });
});

api.delete("/bookmarks", requireUser, (req, res) => {
  const parsed = z.object({ targetType: z.enum(["update", "provision"]), targetId: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose a saved item." });
  sql("DELETE FROM bookmarks WHERE user_id = ? AND target_type = ? AND target_id = ?").run(uid(req), parsed.data.targetType, parsed.data.targetId);
  res.json({ ok: true });
});

api.post("/notices", requireUser, (req, res) => {
  const parsed = z.object({
    disputeType: z.string().trim().min(2).max(160),
    recipientName: z.string().trim().min(2).max(160),
    recipientAddress: z.string().trim().max(400).optional().or(z.literal("")),
    dates: z.string().trim().max(500).optional().or(z.literal("")),
    events: z.string().trim().min(10).max(5000),
    relief: z.string().trim().min(2).max(1000),
    evidence: z.string().trim().max(2000).optional().or(z.literal("")),
    categoryId: z.string().optional().nullable(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || "Complete the notice fields." });
  const profile = profileFor(uid(req)) as { full_name: string; state: string; district: string; email: string };
  const draft = draftNotice({
    ...parsed.data,
    senderName: profile.full_name,
    senderAddress: `${profile.district}, ${profile.state}. Email on account: ${profile.email}. Add a postal address before sending.`,
    recipientAddress: parsed.data.recipientAddress || "",
    dates: parsed.data.dates || "",
    evidence: parsed.data.evidence || "",
  });
  const stamp = now();
  const result = sql("INSERT INTO legal_notice_drafts (user_id, input_json, draft_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run(
    uid(req), JSON.stringify(parsed.data), JSON.stringify(draft), stamp, stamp,
  );
  res.status(201).json({ id: Number(result.lastInsertRowid), draft });
});

api.get("/notices", requireUser, (req, res) => {
  const rows = sql("SELECT id, draft_json, created_at, updated_at FROM legal_notice_drafts WHERE user_id = ? ORDER BY id DESC").all(uid(req)) as Array<{ id: number; draft_json: string; created_at: string }>;
  res.json({ notices: rows.map((row) => ({ id: row.id, createdAt: row.created_at, draft: JSON.parse(row.draft_json) })) });
});

api.patch("/notices/:id", requireUser, (req, res) => {
  const parsed = z.object({ section: z.string(), text: z.string().max(5000) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose a section to edit." });
  const row = sql("SELECT draft_json FROM legal_notice_drafts WHERE id = ? AND user_id = ?").get(pid(req.params.id), uid(req)) as { draft_json: string } | undefined;
  if (!row) return res.status(404).json({ error: "That draft was not found." });
  const draft = JSON.parse(row.draft_json);
  if (!(parsed.data.section in draft.sections)) return res.status(400).json({ error: "That section is not in the draft." });
  draft.sections[parsed.data.section] = parsed.data.text;
  sql("UPDATE legal_notice_drafts SET draft_json = ?, updated_at = ? WHERE id = ?").run(JSON.stringify(draft), now(), pid(req.params.id));
  res.json({ draft });
});

api.post("/notices/:id/regenerate", requireUser, (req, res) => {
  const parsed = z.object({ section: z.enum(["sender", "recipient", "subject", "facts", "dates", "provisions", "grievance", "relief", "response", "evidence", "closing"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose a section to regenerate." });
  const row = sql("SELECT input_json, draft_json FROM legal_notice_drafts WHERE id = ? AND user_id = ?").get(pid(req.params.id), uid(req)) as { input_json: string; draft_json: string } | undefined;
  if (!row) return res.status(404).json({ error: "That draft was not found." });
  const profile = profileFor(uid(req)) as { full_name: string; state: string; district: string; email: string };
  const input = JSON.parse(row.input_json);
  const fresh = draftNotice({
    ...input,
    senderName: profile.full_name,
    senderAddress: `${profile.district}, ${profile.state}. Email on account: ${profile.email}.`,
  });
  const draft = JSON.parse(row.draft_json);
  draft.sections[parsed.data.section] = fresh.sections[parsed.data.section as keyof typeof fresh.sections];
  sql("UPDATE legal_notice_drafts SET draft_json = ?, updated_at = ? WHERE id = ?").run(JSON.stringify(draft), now(), pid(req.params.id));
  res.json({ draft });
});

api.get("/notices/:id/pdf", requireUser, async (req, res) => {
  const row = sql("SELECT draft_json FROM legal_notice_drafts WHERE id = ? AND user_id = ?").get(pid(req.params.id), uid(req)) as { draft_json: string } | undefined;
  if (!row) return res.status(404).json({ error: "That draft was not found." });
  const draft = JSON.parse(row.draft_json);
  const lines = [draft.watermark, "", ...Object.entries(draft.sections).flatMap(([key, value]) => [`${key.toUpperCase()}`, String(value), ""])];
  const pdf = await renderPdf("Draft legal notice", lines);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=nyayamarg-draft-notice.pdf");
  res.send(pdf);
});

api.post("/urgency", requireUser, (req, res) => {
  const parsed = z.object({
    text: z.string().trim().min(3).max(4000),
    answers: z.record(z.string()).optional(),
    scenarioId: z.number().optional(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Describe the situation briefly." });
  const result = assessUrgency(parsed.data);
  sql("INSERT INTO urgency_assessments (user_id, scenario_id, level, result_json, created_at) VALUES (?, ?, ?, ?, ?)").run(
    uid(req), parsed.data.scenarioId || null, result.level, JSON.stringify(result), now(),
  );
  if (result.level !== "normal") notify(uid(req), `Urgency: ${result.level}`, result.title, "urgency");
  res.json({ assessment: result });
});

api.get("/quiz", requireUser, (req, res) => {
  const category = String(req.query.category || "");
  const level = String(req.query.level || "");
  let rows = sql("SELECT id, category, level, prompt, options_json FROM quiz_questions").all() as Array<Record<string, string>>;
  if (category) rows = rows.filter((row) => row.category === category);
  if (level) rows = rows.filter((row) => row.level === level);
  res.json({
    questions: rows.map((row) => ({ id: row.id, category: row.category, level: row.level, prompt: row.prompt, options: JSON.parse(row.options_json) })),
  });
});

api.get("/quiz/daily", requireUser, (_req, res) => {
  const rows = sql("SELECT id, category, level, prompt, options_json FROM quiz_questions").all() as Array<Record<string, string>>;
  const day = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
  let seed = [...day].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const pool = [...rows];
  const picked = [];
  while (picked.length < 5 && pool.length) {
    seed = (seed * 17 + 3) % pool.length;
    picked.push(pool.splice(seed, 1)[0]);
  }
  res.json({
    date: day,
    questions: picked.map((row) => ({ id: row.id, category: row.category, level: row.level, prompt: row.prompt, options: JSON.parse(row.options_json) })),
  });
});

api.post("/quiz/answer", requireUser, (req, res) => {
  const parsed = z.object({ id: z.string(), choice: z.number().int().min(0).max(5) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose an answer." });
  const row = sql("SELECT correct_index, explanation, source_name, source_url FROM quiz_questions WHERE id = ?").get(parsed.data.id) as { correct_index: number; explanation: string; source_name: string; source_url: string } | undefined;
  if (!row) return res.status(404).json({ error: "That question was not found." });
  res.json({ correct: row.correct_index === parsed.data.choice, correctIndex: row.correct_index, explanation: row.explanation, sourceName: row.source_name, sourceUrl: row.source_url });
});

api.post("/quiz/results", requireUser, (req, res) => {
  const parsed = z.object({
    category: z.string(),
    level: z.string(),
    score: z.number().int().min(0),
    total: z.number().int().min(1),
    mode: z.enum(["practice", "daily"]),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "The score could not be saved." });
  sql("INSERT INTO quiz_results (user_id, category, level, score, total, mode, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    uid(req), parsed.data.category, parsed.data.level, parsed.data.score, parsed.data.total, parsed.data.mode, now(),
  );
  res.status(201).json({ progress: quizProgress(uid(req)) });
});

api.get("/quiz/progress", requireUser, (req, res) => res.json(quizProgress(uid(req))));

api.post("/assistant", requireUser, (req, res) => {
  const parsed = z.object({ message: z.string().trim().min(2).max(4000), language: z.enum(["en", "hi", "te"]).optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Ask a question in a few words." });
  const profile = profileFor(uid(req)) as { language: "en" | "hi" | "te" };
  res.json(assistantAnswer(parsed.data.message, parsed.data.language || profile.language));
});

api.get("/search", requireUser, (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();
  if (q.length < 2) return res.json({ sections: [], scenarios: [] });
  const sections = sql("SELECT id, act_name, section, title, source_url FROM legal_sections").all() as Array<Record<string, string>>;
  const scenarios = sql("SELECT id, title, input_text FROM legal_scenarios WHERE user_id = ?").all(uid(req)) as Array<Record<string, string>>;
  res.json({
    sections: sections.filter((row) => `${row.act_name} ${row.section} ${row.title}`.toLowerCase().includes(q)).slice(0, 8),
    scenarios: scenarios.filter((row) => `${row.title} ${row.input_text}`.toLowerCase().includes(q)).slice(0, 6),
  });
});

function quizProgress(userId: number) {
  const results = sql("SELECT * FROM quiz_results WHERE user_id = ? ORDER BY id DESC").all(userId) as Array<{ score: number; total: number; category: string }>;
  const categories = new Set(results.map((row) => row.category));
  const badges = [];
  if (results.length >= 1) badges.push({ id: "first", label: "First step" });
  if (results.length >= 5) badges.push({ id: "steady", label: "Steady learner" });
  if (results.some((row) => row.score / row.total >= 0.8)) badges.push({ id: "clear", label: "Clear understanding" });
  if (categories.size >= 4) badges.push({ id: "explorer", label: "Rights explorer" });
  return { results, badges };
}

function mapsStatus() {
  return {
    googleConfigured: Boolean(process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY),
    browserKey: Boolean(process.env.VITE_GOOGLE_MAPS_API_KEY),
  };
}

async function geocode(address: string): Promise<{ formatted: string } | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`);
  const data = await response.json() as { results?: Array<{ formatted_address: string }> };
  const formatted = data.results?.[0]?.formatted_address;
  return formatted ? { formatted } : null;
}
