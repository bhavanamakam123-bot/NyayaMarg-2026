import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { AID_OFFICES } from "./data/aid.js";
import { ALL_PLAYBOOKS, PROVISIONS } from "./data/knowledge.js";
import { QUIZ } from "./data/quiz.js";
import { UPDATES } from "./data/updates.js";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const dataDir = path.join(ROOT, "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(path.join(dataDir, "uploads"), { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, "nyayamarg.sqlite"));
db.exec("PRAGMA foreign_keys = ON");
db.exec("PRAGMA journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mobile TEXT,
  age_group TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  consent_at TEXT NOT NULL,
  onboarding_complete INTEGER NOT NULL DEFAULT 0,
  text_size TEXT NOT NULL DEFAULT 'md',
  voice_assist INTEGER NOT NULL DEFAULT 0,
  interests TEXT NOT NULL DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS password_resets (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT
);
CREATE TABLE IF NOT EXISTS legal_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  grp TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS acts (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS legal_sources (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS legal_sections (
  id TEXT PRIMARY KEY,
  act_name TEXT NOT NULL,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  effective_note TEXT NOT NULL,
  last_verified TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  body_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS legal_scenarios (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_text TEXT NOT NULL,
  category_hint TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS scenario_analysis (
  id INTEGER PRIMARY KEY,
  scenario_id INTEGER NOT NULL UNIQUE REFERENCES legal_scenarios(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id TEXT,
  result_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS scenario_sections (
  id INTEGER PRIMARY KEY,
  analysis_id INTEGER NOT NULL REFERENCES scenario_analysis(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS action_plans (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_id INTEGER NOT NULL REFERENCES legal_scenarios(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  flow_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS action_steps (
  id INTEGER PRIMARY KEY,
  plan_id INTEGER NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  documents_json TEXT NOT NULL,
  place TEXT NOT NULL,
  url TEXT,
  url_label TEXT,
  timing TEXT,
  completed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS evidence_checklists (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_id INTEGER REFERENCES legal_scenarios(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS evidence_items (
  id INTEGER PRIMARY KEY,
  checklist_id INTEGER NOT NULL REFERENCES evidence_checklists(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  why TEXT NOT NULL,
  origin TEXT NOT NULL,
  available INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS uploaded_documents (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES evidence_items(id) ON DELETE SET NULL,
  scenario_id INTEGER REFERENCES legal_scenarios(id) ON DELETE SET NULL,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS legal_aid_locations (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  state TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  source_url TEXT NOT NULL,
  verified_on TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS saved_cases (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cnr TEXT,
  case_number TEXT,
  court TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS case_tracking_records (
  id INTEGER PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES saved_cases(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  hearing_note TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS legal_updates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  published_on TEXT NOT NULL,
  effective_on TEXT,
  status TEXT NOT NULL,
  status_note TEXT NOT NULL,
  act TEXT NOT NULL,
  category TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS legal_notice_drafts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_json TEXT NOT NULL,
  draft_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS urgency_assessments (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_id INTEGER,
  level TEXT NOT NULL,
  result_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  prompt TEXT NOT NULL,
  options_json TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS quiz_results (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  mode TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(user_id, target_type, target_id)
);
CREATE TABLE IF NOT EXISTS user_notifications (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  kind TEXT NOT NULL,
  read_at TEXT,
  created_at TEXT NOT NULL
);
`);

const count = db.prepare("SELECT COUNT(*) AS n FROM legal_sections").get() as { n: number };
if (count.n === 0) {
  const insertSection = db.prepare(`INSERT INTO legal_sections
    (id, act_name, section, title, jurisdiction, effective_note, last_verified, source_name, source_url, body_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertAct = db.prepare("INSERT OR IGNORE INTO acts (name) VALUES (?)");
  const insertSource = db.prepare("INSERT INTO legal_sources (name, url) VALUES (?, ?)");
  const insertCategory = db.prepare("INSERT INTO legal_categories (id, label, grp) VALUES (?, ?, ?)");
  for (const book of ALL_PLAYBOOKS) insertCategory.run(book.id, book.label.en, book.group);
  for (const provision of PROVISIONS) {
    insertAct.run(provision.act);
    insertSource.run(provision.sourceName, provision.sourceUrl);
    insertSection.run(
      provision.id,
      provision.act,
      provision.section,
      provision.title,
      provision.jurisdiction,
      provision.effectiveNote,
      provision.lastVerified,
      provision.sourceName,
      provision.sourceUrl,
      JSON.stringify(provision),
    );
  }
  const insertAid = db.prepare(`INSERT INTO legal_aid_locations
    (id, kind, state, name, address, phone, website, source_url, verified_on)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const office of AID_OFFICES) {
    insertAid.run(office.id, office.kind, office.state, office.name, office.address, office.phone, office.website, office.sourceUrl, office.verifiedOn);
  }
  const insertUpdate = db.prepare(`INSERT INTO legal_updates
    (id, title, summary, published_on, effective_on, status, status_note, act, category, source_name, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const update of UPDATES) {
    insertUpdate.run(update.id, update.title, update.summary, update.publishedOn, update.effectiveOn, update.status, update.statusNote, update.act, update.category, update.sourceName, update.sourceUrl);
  }
  const insertQuiz = db.prepare(`INSERT INTO quiz_questions
    (id, category, level, prompt, options_json, correct_index, explanation, source_name, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const question of QUIZ) {
    insertQuiz.run(question.id, question.category, question.level, question.prompt, JSON.stringify(question.options), question.correct, question.explanation, question.sourceName, question.sourceUrl);
  }
}

export function sql(sqlText: string) {
  const statement = db.prepare(sqlText);
  return {
    run: (...args: unknown[]) => statement.run(...(args as never[])),
    get: (...args: unknown[]) => statement.get(...(args as never[])),
    all: (...args: unknown[]) => statement.all(...(args as never[])),
  };
}

export function now() {
  return new Date().toISOString();
}

export function notify(userId: number, title: string, body: string, kind: string) {
  db.prepare("INSERT INTO user_notifications (user_id, title, body, kind, created_at) VALUES (?, ?, ?, ?, ?)").run(userId, title, body, kind, now());
}
