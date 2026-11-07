# NyayaMarg

NyayaMarg is a citizen-facing legal information application for India. It helps a person describe a problem, see provisions from a checked library, and reach an official helpline, legal-aid office, or portal.

Tagline: **Know Your Rights. Understand the Law. Take the Right Action.**

NyayaMarg provides legal information and AI-assisted guidance for educational and informational purposes. It does not replace advice from a qualified advocate or legal aid professional.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. The API listens on http://localhost:4000 and the Vite app proxies `/api`.

Copy `.env.example` to `.env` if you want optional keys.

## What is live without keys

- Account registration, login, logout, and password reset.
- Passwords are hashed with bcrypt. The session is an httpOnly cookie. Passwords are not stored in the browser.
- SQLite database in `data/nyayamarg.sqlite`, created on first start, with the entities used by the app.
- Retrieval analysis for consumer, cyber, cheque, labour, tenancy, traffic, and rights questions. Provisions include an Act, section, source link, jurisdiction, and last-verified date.
- Action plans, evidence checklists, private uploads, draft notices, urgency screening, quiz, and English / Hindi / Telugu explanations.
- State Legal Services Authorities copied from the NALSA directory (page dated 6 November 2026). District offices are not invented.
- Maps open the published address in Google Maps. An embed shows that address search.
- Case tracking stores only what you type and links to eCourts. It does not invent a hearing date.

## What needs configuration

| Integration | Variable | Without it |
| --- | --- | --- |
| Email reset | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | The link is written to `data/outbox.log`. In development it can also be shown once. |
| Generative model | `OPENAI_API_KEY` or `GEMINI_API_KEY` | Not called. The retrieval library still answers. A future model must not add section numbers. |
| Google Geocoding | `GOOGLE_MAPS_API_KEY` | PIN search asks you to choose a state. Address search links still work. |
| Maps JavaScript | `VITE_GOOGLE_MAPS_API_KEY` | The address embed and directions link are the fallback. |
| eCourts live status | No public authorised API is wired | Use the official portal links. |
| Supabase | Not connected | Local SQLite and cookie sessions are the working backend. |

## Legal sources used in the library

- India Code for the Consumer Protection Act, 2019, Bharatiya Nyaya Sanhita, 2023, Negotiable Instruments Act, 1881, and Motor Vehicles Act, 1988.
- Ministry of Home Affairs commencement notifications for the BNS, BNSS, and BSA (1 July 2024, with the stated exception for BNS section 106(2)).
- NALSA directory, National Consumer Helpline, e-Jagriti, National Cyber Crime Reporting Portal, RBI Complaint Management System, and SAMADHAN.

Confidence figures describe how much of the description matched the library. They are not a chance of winning or of receiving compensation.
