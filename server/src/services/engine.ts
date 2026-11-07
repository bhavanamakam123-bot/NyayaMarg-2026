import {
  ALL_PLAYBOOKS,
  DISCLAIMER,
  EMERGENCY,
  PROVISIONS,
  type CategoryPlaybook,
  type Lang,
  type Provision,
} from "../data/knowledge.js";

export type Analysis = {
  disclaimer: string;
  engine: "retrieval";
  llm: "not_configured" | "used_for_wording_only";
  problemSummary: string;
  categoryId: string | null;
  categoryLabel: string;
  group: string | null;
  uncertain: boolean;
  facts: { id: string; label: string; present: boolean }[];
  missing: string[];
  questions: string[];
  provisions: Array<Provision & { relevance: string; match: number }>;
  remedies: string[];
  documents: { name: string; why: string }[];
  nextActions: string[];
  flow: { title: string; detail: string }[];
  authorities: CategoryPlaybook["authorities"];
  confidence: {
    category: number;
    provisions: number;
    completeness: number;
    evidence: number;
    explanation: string[];
  };
  transitionNote: string | null;
  couldChange: string[];
  supportingFacts: string[];
};

const t = (value: { en: string; hi: string; te: string }, lang: Lang) => value[lang] || value.en;

function hits(text: string, keywords: string[]) {
  const found: string[] = [];
  for (const keyword of keywords) {
    const escaped = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i").test(text)) found.push(keyword);
  }
  return found;
}

function dateBeforeNewCriminalLaw(text: string) {
  const matches = text.match(/\b(19|20)\d{2}\b/g) || [];
  return matches.some((year) => Number(year) < 2024 && /offence|stole|theft|cheat|assault|fir|police/.test(text));
}

export function analyzeScenario(input: {
  text: string;
  categoryHint?: string | null;
  documentNames?: string[];
  language?: Lang;
}): Analysis {
  const lang: Lang = input.language || "en";
  const text = `${input.text || ""}`.trim();
  const lower = text.toLowerCase();
  const docs = input.documentNames || [];

  const scored = ALL_PLAYBOOKS.map((book) => {
    const found = hits(lower, book.keywords);
    let score = found.length * 12;
    if (input.categoryHint && (input.categoryHint === book.id || input.categoryHint === book.group)) score += 18;
    return { book, found, score };
  }).sort((a, b) => b.score - a.score);

  const top = scored[0];
  const second = scored[1];
  const uncertain = !text || top.score < 12;
  const book = uncertain ? null : top.book;

  const facts = (book?.facts || []).map((fact) => ({
    id: fact.id,
    label: t(fact.label, lang),
    present: fact.test.test(text),
  }));
  const presentFacts = facts.filter((fact) => fact.present);
  const missing = facts.filter((fact) => !fact.present).map((fact) => fact.label);

  const provisions = PROVISIONS.map((provision) => {
    const found = hits(lower, provision.keywords);
    let match = found.length * 22;
    if (book && found.length > 0 && provision.categories.includes(book.id)) match += 12;
    if (provision.id === "bns-318" && book?.id === "consumer" && !/cheat|fraud|scam|dishonest/.test(lower)) match -= 25;
    if (provision.id === "bns-316" && !/entrust|trust|agent|kept/.test(lower)) match -= 20;
    if (provision.id === "bns-303" && !/theft|stolen|stole/.test(lower)) match -= 30;
    return { provision, match: Math.max(0, Math.min(100, match)), found };
  })
    .filter((item) => item.match >= 20)
    .sort((a, b) => b.match - a.match)
    .slice(0, 5);

  const categoryScore = uncertain ? Math.min(40, top?.score || 0) : Math.min(92, 38 + top.score + (top.found.length > 2 ? 8 : 0) - (second && top.score - second.score < 8 ? 12 : 0));
  const provisionScore = provisions.length ? Math.min(90, Math.round(provisions.reduce((sum, item) => sum + item.match, 0) / provisions.length)) : 22;
  const completeness = facts.length ? Math.round((presentFacts.length / facts.length) * 100) : text.length > 80 ? 55 : text.length > 20 ? 35 : 15;
  const evidenceBase = book?.documents.length || 4;
  const evidence = Math.min(90, Math.round((docs.length / evidenceBase) * 100));

  const transition = book && ["cyber", "criminal", "rights"].includes(book.group) && dateBeforeNewCriminalLaw(lower)
    ? "A year before 2024 appears with criminal wording. Offences before 1 July 2024 may continue under the earlier law, subject to transitional provisions. The BNS sections below are for matters governed by the new law. Ask a legal aid lawyer which statute applies before relying on a section."
    : null;

  const summary = text
    ? text.length > 420 ? `${text.slice(0, 400).trim()}…` : text
    : "No situation was described.";

  const couldChange = [
    "A date of the incident, especially before or after 1 July 2024 for criminal provisions.",
    "Whether money was paid, and whether there is a written contract or receipt.",
    "Your state, because tenancy, labour coverage, and the correct forum can differ.",
    "Documents that confirm or contradict the description.",
  ];
  if (book?.id === "cheque") {
    couldChange.unshift("Whether the cheque was for a legally enforceable debt, and the date the bank informed you of the return.");
  }

  return {
    disclaimer: DISCLAIMER,
    engine: "retrieval",
    llm: "not_configured",
    problemSummary: summary,
    categoryId: book?.id || null,
    categoryLabel: book ? t(book.label, lang) : "Not identified with enough confidence",
    group: book?.group || null,
    uncertain,
    facts,
    missing: uncertain ? ["A clearer description of what happened, who was involved, and when."] : missing,
    questions: book ? book.questions.map((item) => t(item, lang)) : [
      lang === "hi" ? "क्या यह उपभोक्ता, साइबर, चेक, वेतन, किराया या यातायात का मामला है?" : lang === "te" ? "ఇది వినియోగదారు, సైబర్, చెక్కు, జీతం, అద్దె లేదా ట్రాఫిక్ విషయమా?" : "Is this about a purchase, a cyber payment, a cheque, wages, a tenancy, or traffic?",
    ],
    provisions: uncertain ? [] : provisions.map((item) => ({
      ...item.provision,
      match: item.match,
      relevance: t(item.provision.why, lang),
    })),
    remedies: book ? book.remedies.map((item) => t(item, lang)) : [],
    documents: book ? book.documents.map((item) => ({ name: item.name, why: t(item.why, lang) })) : [],
    nextActions: book ? book.steps.slice(0, 3).map((step) => t(step.title, lang)) : ["Add a fuller description and run the analysis again."],
    flow: book ? book.flow.map((node) => ({ title: t(node.title, lang), detail: t(node.detail, lang) })) : [],
    authorities: book?.authorities || [],
    confidence: {
      category: categoryScore,
      provisions: uncertain ? 0 : provisionScore,
      completeness,
      evidence,
      explanation: [
        book
          ? `The category follows words in your description${top.found.length ? ` (${top.found.slice(0, 6).join(", ")})` : ""}.`
          : "Too few recognised facts were found, so no Act is being matched yet.",
        presentFacts.length ? `Facts that support it: ${presentFacts.map((fact) => fact.label).join("; ")}.` : "Few concrete facts were detected.",
        missing.length ? `Still missing: ${missing.join("; ")}.` : "The expected fact checklist for this category is covered by the text. Documents can still be missing.",
        "These scores measure retrieval and completeness only. They are not the probability of winning a case or getting compensation.",
      ],
    },
    transitionNote: transition,
    couldChange,
    supportingFacts: presentFacts.map((fact) => fact.label),
  };
}

export function planFromCategory(categoryId: string, lang: Lang = "en") {
  const book = ALL_PLAYBOOKS.find((item) => item.id === categoryId);
  if (!book) return null;
  return {
    categoryId: book.id,
    label: t(book.label, lang),
    steps: book.steps.map((step, index) => ({
      number: index + 1,
      title: t(step.title, lang),
      explanation: t(step.explanation, lang),
      documents: step.documents,
      where: t(step.where, lang),
      url: step.url,
      urlLabel: step.urlLabel,
      timing: step.timing ? t(step.timing, lang) : null,
    })),
    flow: book.flow.map((node) => ({ title: t(node.title, lang), detail: t(node.detail, lang) })),
    disclaimer: DISCLAIMER,
  };
}

const DANGER = /rape|sexual assault|kidnapp|kidnap|acid|suicide|kill me|murder|being beaten|beating me|weapon|stab|unlawful detention|detained and|cannot leave|domestic violence now|child abuse|traffick/i;

export function assessUrgency(input: { text: string; answers?: Record<string, string> }) {
  const text = `${input.text || ""} ${Object.values(input.answers || {}).join(" ")}`;
  if (DANGER.test(text) || input.answers?.danger === "yes") {
    return {
      level: "critical" as const,
      title: "Critical — immediate assistance may be needed",
      explanation: "The description suggests danger, violence, sexual violence, or someone who cannot safely leave. Contact the emergency numbers below before continuing with a questionnaire. This screen is not a police complaint and it is not a finding that an offence is proved.",
      contacts: EMERGENCY,
      skipLongForm: true,
    };
  }
  const financial = /unauthori[sz]ed|without permission|otp|ongoing|still being debited|more payments/i.test(text);
  const evidence = /deleting|destroy|will erase|tomorrow is the last|deadline today/i.test(text);
  const hearing = /hearing tomorrow|notice period|within 15 days|within thirty days|court date/i.test(text);
  const threat = /threat|harass|blackmail/i.test(text);
  let level: "critical" | "high" | "normal" = "normal";
  const reasons: string[] = [];
  if (financial) {
    level = "high";
    reasons.push("Continuing or unauthorised financial loss is described. Tell the bank and use 1930 / cybercrime.gov.in if it is a cyber fraud.");
  }
  if (evidence) {
    level = "high";
    reasons.push("There is a risk that messages or records will be lost. Save copies now.");
  }
  if (hearing) {
    level = "high";
    reasons.push("A date or a statutory cheque-notice period may be running. Confirm the exact date with the paper you received or with a lawyer. This app does not calculate your last day.");
  }
  if (threat) {
    level = "high";
    reasons.push("Threats or harassment are mentioned. If you are unsafe now, call 112. The women's helpline is 181.");
  }
  if (!reasons.length) {
    reasons.push("Nothing in the description shows immediate danger, a running statutory deadline, or continuing loss. You can follow the action plan and keep your papers. If that changes, use the emergency numbers.");
  }
  return {
    level,
    title: level === "high" ? "High — prompt action recommended" : "Normal — general guidance and planned follow-up",
    explanation: "This is a screening aid. It does not replace a lawyer's judgment or a limitation period printed in a statute or a court notice.",
    reasons,
    contacts: level === "high" ? EMERGENCY.filter((item) => ["112", "181", "1930", "1098"].includes(item.phone)) : [],
    skipLongForm: false,
    questions: [
      { id: "danger", prompt: "Is anyone in immediate physical danger, or being held and unable to leave?" },
      { id: "loss", prompt: "Is money still being taken, or did an unauthorised transfer just happen?" },
      { id: "evidence", prompt: "Are chats, CCTV, or papers about to be deleted or lost?" },
      { id: "deadline", prompt: "Do you have a court date, a cheque-return memo, or a notice that states a deadline?" },
    ],
  };
}

export function draftNotice(input: {
  disputeType: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  dates: string;
  events: string;
  relief: string;
  evidence: string;
  categoryId?: string | null;
}) {
  const book = ALL_PLAYBOOKS.find((item) => item.id === input.categoryId);
  const provisions = book
    ? PROVISIONS.filter((item) => item.categories.includes(book.id)).slice(0, 3)
    : [];
  const cheque = input.categoryId === "cheque" || /cheque|check/i.test(input.disputeType);
  const response = cheque
    ? "If section 138 of the Negotiable Instruments Act, 1881 applies, the drawer has fifteen days from receipt of a valid demand notice to pay. Whether section 138 applies, and whether this draft meets it, must be checked by a lawyer against the bank memo and the dates."
    : "Please reply within 15 days of receiving this draft. That period is a request in this draft. It is not, by itself, a statutory deadline.";
  return {
    watermark: "DRAFT — review with a qualified advocate or legal aid professional before sending. Facts below are only what was entered.",
    sections: {
      sender: `${input.senderName}\n${input.senderAddress || "Address not provided"}`,
      recipient: `${input.recipientName || "Recipient name not provided"}\n${input.recipientAddress || "Address not provided"}`,
      subject: `Draft notice regarding ${input.disputeType || "the dispute described below"}`,
      facts: input.events?.trim() || "The sender has not entered a description of events. Do not send a notice until the facts are written by the sender.",
      dates: input.dates?.trim() || "No dates were entered.",
      provisions: provisions.length
        ? provisions.map((item) => `${item.act}, ${item.section} (${item.title}). Source: ${item.sourceUrl}. This is a pointer, not a finding that the section is proved.`).join("\n")
        : "No verified provision was matched. None is inserted.",
      grievance: input.events?.trim() || "Not stated.",
      relief: input.relief?.trim() || "The relief requested was not stated.",
      response,
      evidence: input.evidence?.trim() || "No supporting evidence was listed.",
      closing: "This communication is a draft prepared with NyayaMarg for information. It is not a filed pleading and it is not legal advice.",
    },
    disclaimer: DISCLAIMER,
  };
}

export function assistantAnswer(message: string, lang: Lang) {
  const analysis = analyzeScenario({ text: message, language: lang });
  const glossary: Record<string, { en: string; hi: string; te: string }> = {
    "dlsa": { en: "A District Legal Services Authority. Find it through your State Legal Services Authority directory, not from an invented address.", hi: "जिला विधिक सेवा प्राधिकरण। पता राज्य प्राधिकरण की निर्देशिका से लें।", te: "జిల్లా లీగల్ సర్వీసెస్ అథారిటీ. చిరునామా రాష్ట్ర అథారిటీ డైరెక్టరీ నుండి తీసుకోండి." },
    "slsa": { en: "A State Legal Services Authority constituted under the Legal Services Authorities Act, 1987.", hi: "विधिक सेवा प्राधिकरण अधिनियम, 1987 के तहत राज्य विधिक सेवा प्राधिकरण।", te: "లీగల్ సర్వీసెస్ అథారిటీస్ చట్టం, 1987 కింద రాష్ట్ర లీగల్ సర్వీసెస్ అథారిటీ." },
    "cnr": { en: "A Case Number Record used on the eCourts portal to look up a case. NyayaMarg does not fetch live status.", hi: "ई-कोर्ट्स पर केस देखने का केस नंबर रिकॉर्ड। न्यायमार्ग स्थिति स्वयं नहीं लाता।", te: "ఈకోర్ట్స్‌లో కేసు చూడటానికి కేసు నంబర్ రికార్డ్. న్యాయమార్గ్ స్థితిని తెచ్చుకోదు." },
    "bns": { en: "The Bharatiya Nyaya Sanhita, 2023, in force from 1 July 2024 except section 106(2).", hi: "भारतीय न्याय संहिता, 2023, 1 जुलाई 2024 से प्रवृत्त, धारा 106(2) को छोड़कर।", te: "భారతీయ న్యాయ సంహిత, 2023, 1 జూలై 2024 నుండి అమలు, సెక్షన్ 106(2) మినహా." },
    "deficiency": { en: "In the Consumer Protection Act, 2019, section 2(11): a fault or inadequacy in a service someone was bound to perform.", hi: "उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 2(11): सेवा में कमी।", te: "వినియోగదారు రక్షణ చట్టం, 2019 సెక్షన్ 2(11): సేవలో లోపం." },
  };
  const key = Object.keys(glossary).find((item) => message.toLowerCase().includes(item));
  const lead = key ? glossary[key][lang] : analysis.uncertain
    ? (lang === "hi" ? "मैं अभी कोई अधिनियम नहीं जोड़ रहा, क्योंकि विवरण पर्याप्त स्पष्ट नहीं है।" : lang === "te" ? "వివరణ స్పష్టంగా లేనందున నేను ఇప్పుడు ఏ చట్టాన్ని జోడించడం లేదు." : "I am not attaching an Act yet, because the description is not specific enough.")
    : (lang === "hi" ? `यह ${analysis.categoryLabel} जैसा दिखता है। नीचे केवल सत्यापित प्रावधान हैं।` : lang === "te" ? `ఇది ${analysis.categoryLabel} లాగా ఉంది. కింద ధృవీకరించిన నిబంధనలు మాత్రమే.` : `This reads as ${analysis.categoryLabel}. Only verified provisions are listed below.`);
  return { lead, analysis, disclaimer: DISCLAIMER };
}

export { DISCLAIMER, EMERGENCY };
