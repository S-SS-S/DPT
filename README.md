# Neuro PT Clinical Companion

A local-first neurological physical therapy clinical decision-support web application for structured assessment planning, outcome-measure selection, score tracking, conservative interpretation, editable draft goals, and reassessment.

The initial deployment target is GitHub Pages and the codebase is intentionally a static, no-build application.

## Purpose

The application helps a PT, student, or clinician move through a structured workflow:

**Condition → Assessment → Select Measures → Enter Scores → Interpret → Generate Draft Goals → Reassess**

It is **not** autonomous diagnostic software. It does not clear red flags, prescribe treatment, or replace clinician judgment.

## Current features

- Polished responsive dashboard and instant hash-based navigation
- Searchable neurological condition directory with common and uncommon/rare conditions
- Broad neuro categories: cerebrovascular, acquired brain injury, movement disorders, demyelinating disease, SCI/myelopathy, ataxia, neuromuscular, peripheral nerve, pediatric neuro, and vestibular
- Reusable Core Neuro PT Assessment checklist
- Condition-specific assessment additions
- Curated outcome-measure library with purpose, domain, score direction, time/equipment, licensing notes, reassessment use, and references
- Essential / Recommended / Optional condition-to-measure mappings
- Score entry with validation
- 10MWT gait-speed calculation from exact timed distance and time
- Multiple dated score timepoints
- Deterministic Clinical Insight Engine
- Conservative change interpretation; no universal cutoff is applied across diagnoses
- Population-specific MDC/MCID data can be stored and is only surfaced when the case context matches
- Editable draft goal generator
- Local case saving, duplication, deletion, JSON backup/import, and clear-all controls
- Progress view with score history and goal status
- Light/dark theme
- PWA shell and offline cache
- GitHub Pages deployment workflow
- Future secure AI adapter stub without any public API secret

## Technology

- HTML5
- Modern CSS
- Vanilla JavaScript ES modules
- Browser `localStorage`
- Service Worker + Web App Manifest
- GitHub Actions for GitHub Pages

There is no frontend API key, token, analytics SDK, or backend requirement in v1.

## Privacy and case data

Case data stays in the browser in v1.

Allowed case information is intentionally limited to non-identifying context such as:

- Case ID / nickname
- Optional age band
- Neurological condition
- Phase / setting
- Assistive device
- Functional priority
- Assessment checklist state
- Outcome scores and dates
- Draft goals

**Do not enter patient name, MRN, phone number, national ID, exact address, or other identifying information.**

Local data can be deleted from the Saved Cases screen.

## Clinical safety

This software is a clinical education and decision-support aid only.

- A score does not automatically establish a diagnosis.
- A single fall-risk cutoff is not applied to every population.
- Population-specific MDC/MCID values must match the selected diagnosis/context before the engine labels meaningful change.
- When evidence is not stored for the exact context, the interface says that clinical significance is not inferred.
- Full item text is not reproduced for instruments where permissions/licensing may apply.
- Complex scoring such as ISNCSCI and MDS-UPDRS is not auto-calculated in v1; users can enter a final verified classification/score.
- Red-flag text prompts appropriate medical escalation rather than generating an “AI diagnosis.”

This project is **not clinically validated medical software**.

## Evidence approach

Measure metadata and references are kept separate from UI logic in:

- `js/data/measures.js`
- `js/data/references.js`

Core reference sources include:

- Shirley Ryan AbilityLab Rehabilitation Measures Database
- Academy of Neurologic Physical Therapy resources
- American Spinal Injury Association resources for ISNCSCI
- Movement Disorder Society permissions information for MDS clinical rating scales
- WHO ICF framework

The data model deliberately allows a field to remain unavailable rather than inventing a cutoff, MCID, MDC, normative value, sensitivity/specificity, or prognosis.

## AI / security architecture

GitHub Pages serves public client-side code. Therefore private API keys must **never** be stored in this repository or frontend JavaScript.

v1 uses:

- `clinical-engine.js` for deterministic interpretation
- `goal-engine.js` for deterministic draft goals
- `ai-service.js` as a disabled future adapter

A real LLM integration should only be enabled later through a secure backend that keeps provider credentials server-side and preserves the same safety boundaries.

## Project structure

```text
/
├── index.html
├── 404.html
├── manifest.webmanifest
├── service-worker.js
├── css/
│   ├── styles.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── router.js
│   ├── state.js
│   ├── storage.js
│   ├── utils.js
│   ├── scoring-engine.js
│   ├── clinical-engine.js
│   ├── goal-engine.js
│   ├── ai-service.js
│   └── data/
│       ├── conditions.js
│       ├── measures.js
│       ├── assessment-domains.js
│       └── references.js
├── assets/icons/icon.svg
└── .github/workflows/pages.yml
```

## Add a condition

Edit `js/data/conditions.js`.

Conditions are generated from a family template plus optional overrides. Add:

- ID
- Display name
- Family
- Synonyms
- Optional evidence note / custom measure mapping

For rare diagnoses, prefer an explicit `evidenceNote` explaining limited disease-specific evidence rather than pretending a generic cutoff is validated.

## Add an outcome measure

Edit `js/data/measures.js` and provide structured metadata:

- `id`
- `name`
- `acronym`
- `domains`
- `populations`
- `purpose`
- `measureType`
- `equipment`
- `estimatedTime`
- `scoreRange`
- `scoreDirection`
- `inputType`
- `scoringNotes`
- `interpretation`
- `reassessmentUse`
- `licensing`
- `sources`

Only add population-specific `changeEvidence` after verifying the population, phase/setting, value, unit, and source.

## Update references

Add or update entries in `js/data/references.js`, then reference them by ID from measure metadata.

Do not paste copyrighted instrument item wording into the dataset unless redistribution is clearly permitted.

## Local development

No build step is required.

From the repository directory:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

Use a local server rather than opening `index.html` directly because ES modules have browser origin requirements.

## GitHub Pages deployment

The included workflow deploys the repository root as a static Pages artifact on each push to `main`.

If Pages has not been enabled for the repository:

1. Open **Repository Settings → Pages**
2. Under **Build and deployment**, choose **GitHub Actions**

No manual file upload or code editing should be required.

All internal asset links are relative, so a project-site path such as `https://<user>.github.io/DPT/` is supported.

## Current limitations

- This is an evidence-aware MVP, not a completed clinical validation program.
- Rare-condition mappings are intentionally conservative.
- Many population-specific psychometric values have not yet been encoded.
- Pediatric-specific outcome measure coverage should be expanded in a dedicated evidence pass.
- No real AI backend is enabled.
- No cloud sync or multi-device case account exists.
- The progress chart is deliberately simple and dependency-free.
- Full automated scoring for complex/proprietary instruments is intentionally deferred.

## Clinical disclaimer

Clinical decision-support tool for education and rehabilitation planning. It does not replace examination, diagnosis, local protocols, or clinician judgment. Urgent or new neurological symptoms require appropriate medical evaluation.
