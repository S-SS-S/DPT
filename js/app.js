import { conditions, conditionById, conditionCategories } from "./data/conditions.js";
import { measures, measureById } from "./data/measures.js";
import { assessmentDomains, domainLabels } from "./data/assessment-domains.js";
import { resolveReferences } from "./data/references.js";
import { state, ensureWorkingCase, setWorkingCase, createEmptyCase } from "./state.js";
import { getCases, upsertCase, deleteCase, duplicateCase, clearCases, exportBackup, importBackup, getPrefs, setPref } from "./storage.js";
import { buildScoreEntry } from "./scoring-engine.js";
import { interpretCase } from "./clinical-engine.js";
import { generateGoals } from "./goal-engine.js";
import { parseHash, navigate } from "./router.js";
import { $, $$, esc, formatDate, debounce, toast, downloadJson, titleCase } from "./utils.js";

const main=$("#main-content");
const sideNav=$("#side-nav");
const mobileNav=$("#mobile-nav");
const navItems=[
  ["home","Dashboard","⌂","#/"],
  ["conditions","Conditions","C","#/conditions"],
  ["assessment","Assessment Builder","A","#/assessment"],
  ["measures","Outcome Measures","M","#/measures"],
  ["scores","Score & Interpret","S","#/scores"],
  ["goals","Goals","G","#/goals"],
  ["cases","Saved Cases","K","#/cases"],
  ["about","References / About","R","#/about"]
];

function renderNav(){
  const route=state.route.name;
  sideNav.innerHTML=navItems.map(([id,label,icon,href])=>`<a class="nav-link ${route===id?"active":""}" href="${href}"><span class="nav-icon">${icon}</span>${label}</a>`).join("");
  const mobile=navItems.filter(([id])=>["home","conditions","assessment","measures","cases"].includes(id));
  mobileNav.innerHTML=mobile.map(([id,label,icon,href])=>`<a class="nav-link ${route===id?"active":""}" href="${href}"><span class="nav-icon">${icon}</span><span>${label.replace("Assessment Builder","Assess").replace("Outcome Measures","Measures").replace("Saved Cases","Cases")}</span></a>`).join("");
}

function pageHead(title,subtitle="",actions=""){
  return `<header class="page-head"><div><p class="eyebrow">Neuro PT clinical decision support</p><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:""}</div>${actions?`<div class="page-actions">${actions}</div>`:""}</header>`;
}
function chip(text,kind=""){return `<span class="chip ${kind?`chip-${kind}`:""}">${esc(text)}</span>`}
function refHtml(ids){
  const refs=resolveReferences(ids);
  return refs.length?`<div class="reference-list">${refs.map(r=>`<div class="reference-item"><strong>${esc(r.title)}</strong><div>${esc(r.type)}</div><a href="${r.url}" target="_blank" rel="noopener noreferrer">Open source</a></div>`).join("")}</div>`:`<p class="score-note">No source metadata stored for this entry yet.</p>`;
}
function measurePriorityRows(condition){
  return ["essential","recommended","optional"].map(priority=>{
    const ids=condition.measures?.[priority]||[];
    if(!ids.length)return "";
    return `<div class="card"><div class="card-top"><h3>${titleCase(priority)}</h3>${chip(`${ids.length} measure${ids.length===1?"":"s"}`,priority)}</div>
      ${ids.map(id=>{
        const m=measureById[id]; if(!m)return "";
        return `<div class="measure-row"><div><a class="link-clean" href="#/measure/${m.id}"><strong>${esc(m.acronym)}</strong> — ${esc(m.name)}</a><p>${esc(m.purpose)}</p></div><a class="button button-sm" href="#/measure/${m.id}">Details</a></div>`;
      }).join("")}</div>`;
  }).join("");
}

function renderHome(){
  const cases=getCases();
  const domains=[
    ["balance","Balance"],["gait","Gait"],["mobility","Mobility"],["motor","Motor control"],
    ["coordination","Coordination / ataxia"],["tone","Tone / spasticity"],["endurance","Endurance"],["participation","Functional independence"],
    ["stroke","Stroke"],["parkinsons","Parkinsonism"],["ms","Multiple sclerosis"],["sci","Spinal cord injury"]
  ];
  main.innerHTML=`
    <section class="hero">
      <div><p class="eyebrow" style="color:#bfe2e6">Structured neuro rehabilitation workflow</p><h1>From neurological condition to a defensible PT assessment plan.</h1>
      <p>Choose the condition, build the examination, select outcome measures, enter scores, interpret change conservatively, and create editable draft goals.</p>
      <div class="hero-actions"><a class="button button-primary" href="#/assessment" id="home-start">Start New Neuro Assessment</a><a class="button" href="#/conditions">Browse Conditions</a><a class="button" href="#/measures">Find an Outcome Measure</a></div></div>
      <div class="hero-kicker"><div class="metric"><strong>${conditions.length}</strong><span>Neuro conditions</span></div><div class="metric"><strong>${measures.length}</strong><span>Curated measures</span></div><div class="metric"><strong>${cases.length}</strong><span>Local cases</span></div><div class="metric"><strong>0</strong><span>Cloud identifiers</span></div></div>
    </section>
    <section class="section"><div class="section-head"><div><h2>How it works</h2><p>Progressive workflow. No diagnosis automation.</p></div></div>
      <div class="flow">${["Condition","Assessment","Measures","Scores","Interpret","Goals","Reassess"].map((x,i)=>`${i?'<span class="flow-arrow">→</span>':""}<div class="flow-step">${x}</div>`).join("")}</div>
    </section>
    <section class="section"><div class="section-head"><div><h2>Quick domains</h2><p>Jump into the part of neuro PT you need.</p></div></div>
      <div class="grid grid-4">${domains.map(([id,label])=>`<a class="card card-click domain-card" href="${["stroke","parkinsons","ms","sci"].includes(id)?`#/conditions?focus=${id}`:`#/measures?domain=${id}`}"><div class="domain-icon">${label[0]}</div><strong>${label}</strong><small>Browse relevant ${["stroke","parkinsons","ms","sci"].includes(id)?"conditions and measures":"outcome measures"}</small></a>`).join("")}</div>
    </section>
    <section class="section"><div class="section-head"><div><h2>Recent local cases</h2><p>Stored only in this browser.</p></div><a class="button button-sm" href="#/cases">View all</a></div>
      ${cases.length?`<div class="grid grid-3">${cases.slice(0,3).map(c=>caseCard(c)).join("")}</div>`:`<div class="empty"><strong>No saved cases yet</strong>Create a non-identifying case ID and save your first assessment.</div>`}
    </section>
    <section class="section"><div class="notice notice-warning"><strong>Privacy:</strong> Do not enter patient name, MRN, phone number, national ID, or other identifying information. v1 stores case data in your browser only.</div></section>`;
}

function conditionCard(c){
  const top=[...(c.measures?.essential||[]),...(c.measures?.recommended||[])].slice(0,4).map(id=>measureById[id]?.acronym).filter(Boolean);
  return `<a class="card card-click" href="#/condition/${c.id}"><div class="card-top"><div><h3>${esc(c.name)}</h3><p>${esc(c.category)} · ${esc(c.system)}</p></div>${c.common?chip("Common"):chip("Uncommon / rare","optional")}</div><p>${esc(c.description)}</p><div class="card-footer">${top.map(x=>chip(x,"recommended")).join("")}</div></a>`;
}
function renderConditions(){
  const params=new URLSearchParams((location.hash.split("?")[1]||""));
  const focus=params.get("focus");
  if(focus&&!state.filters.conditionQuery)state.filters.conditionQuery=focus;
  const q=state.filters.conditionQuery.toLowerCase().trim(), cat=state.filters.conditionCategory;
  const filtered=conditions.filter(c=>{
    const hay=[c.name,...c.synonyms,c.category,c.system,...c.impairments].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(cat==="all"||c.category===cat);
  });
  main.innerHTML=pageHead("Neurological conditions","Search common and uncommon conditions. Rare entries are explicitly marked when PT-specific evidence mapping is limited.",`<a class="button button-primary" href="#/assessment">Build assessment</a>`) +
  `<div class="toolbar"><input id="condition-search" type="search" placeholder="Search condition or impairment…" value="${esc(state.filters.conditionQuery)}"><select id="condition-category"><option value="all">All categories</option>${conditionCategories.map(c=>`<option ${cat===c?"selected":""}>${esc(c)}</option>`).join("")}</select></div>
  <div class="section-head"><p>${filtered.length} of ${conditions.length} conditions</p><div>${chip("Central + peripheral")}${chip("Adult + pediatric")}</div></div>
  ${filtered.length?`<div class="grid grid-3">${filtered.map(conditionCard).join("")}</div>`:`<div class="empty"><strong>No matching condition</strong>Try another name, synonym, category, or impairment.</div>`}`;
  $("#condition-search")?.addEventListener("input",debounce(e=>{state.filters.conditionQuery=e.target.value;renderConditions()},120));
  $("#condition-category")?.addEventListener("change",e=>{state.filters.conditionCategory=e.target.value;renderConditions()});
}
function renderCondition(id){
  const c=conditionById[id]; if(!c)return renderNotFound();
  const refs=["sralabRMD","anptEdge","whoICF"];
  main.innerHTML=pageHead(c.name,`${c.category} · ${c.system} · ${c.ageGroup}`,`<button class="button button-primary" id="start-condition">Start assessment</button><a class="button" href="#/conditions">Back</a>`) +
  `<div class="detail-layout"><div class="detail-main">
    <section class="card"><h2>Overview</h2><p>${esc(c.description)}</p><div class="card-footer">${c.impairments.map(x=>chip(x)).join("")}</div></section>
    <section class="card"><h2>PT-relevant functional problems</h2><ul class="bullets">${c.impairments.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="notice" style="margin-top:14px">${esc(c.evidenceNote)}</div></section>
    <section class="card"><h2>Medical escalation / red flags</h2><div class="notice notice-danger">These prompts are safety reminders, not a diagnostic screen.</div><ul class="bullets">${c.redFlags.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
    <section><div class="section-head"><div><h2>Neuro PT assessment checklist</h2><p>Core exam plus condition-specific additions.</p></div></div><div class="card"><h3>Condition-specific additions</h3><ul class="bullets">${c.specificAssessment.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="card-footer">${c.assessmentDomains.map(d=>chip(domainLabels[d]||d,"recommended")).join("")}</div></div></section>
    <section><div class="section-head"><div><h2>Recommended outcome measures</h2><p>Prioritized mappings; suitability still depends on presentation and setting.</p></div></div>${measurePriorityRows(c)}</section>
    <section class="card"><h2>Reassessment</h2><p>Repeat selected measures when clinically useful, using the same protocol, device/assistance and scoring version where possible. The site intentionally does not impose an arbitrary fixed interval.</p></section>
    <section class="card"><h2>Evidence framework</h2>${refHtml(refs)}</section>
  </div><aside class="card sticky-panel"><h3>At a glance</h3><dl class="meta-list">
    <div class="meta-row"><dt>Category</dt><dd>${esc(c.category)}</dd></div><div class="meta-row"><dt>System</dt><dd>${esc(c.system)}</dd></div>
    <div class="meta-row"><dt>Population</dt><dd>${esc(c.ageGroup)}</dd></div><div class="meta-row"><dt>Core domains</dt><dd>${c.goalDomains.map(d=>esc(domainLabels[d]||d)).join(", ")}</dd></div>
  </dl><hr style="border:0;border-top:1px solid var(--line);margin:18px 0"><button class="button button-primary" style="width:100%" id="start-condition-side">Use this condition</button></aside></div>`;
  ["#start-condition","#start-condition-side"].forEach(sel=>$(sel)?.addEventListener("click",()=>startAssessmentWithCondition(c.id)));
}
function measureCard(m){
  return `<a class="card card-click" href="#/measure/${m.id}"><div class="card-top"><div><h3>${esc(m.acronym)}</h3><p>${esc(m.name)}</p></div>${chip(m.measureType)}</div><p>${esc(m.purpose)}</p><div class="card-footer">${m.domains.slice(0,3).map(d=>chip(domainLabels[d]||d,"recommended")).join("")}</div></a>`;
}
function renderMeasures(){
  const params=new URLSearchParams((location.hash.split("?")[1]||""));
  const domain=params.get("domain");
  if(domain)state.filters.measureDomain=domain;
  const q=state.filters.measureQuery.toLowerCase().trim(), d=state.filters.measureDomain;
  const domainOptions=[...new Set(measures.flatMap(m=>m.domains))].sort();
  const filtered=measures.filter(m=>{
    const hay=[m.name,m.acronym,m.purpose,...m.domains,...m.populations].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(d==="all"||m.domains.includes(d));
  });
  main.innerHTML=pageHead("Outcome measures","Curated neuro rehabilitation measures with scoring direction, administration metadata, licensing notes, and source links.",`<a class="button button-primary" href="#/scores">Enter scores</a>`) +
  `<div class="toolbar"><input id="measure-search" type="search" placeholder="Search BBS, gait, balance…" value="${esc(state.filters.measureQuery)}"><select id="measure-domain"><option value="all">All domains</option>${domainOptions.map(x=>`<option value="${x}" ${d===x?"selected":""}>${esc(domainLabels[x]||titleCase(x))}</option>`).join("")}</select></div>
  <div class="section-head"><p>${filtered.length} of ${measures.length} measures</p><div>${chip("Final-score entry")}${chip("Licensing-aware")}</div></div>
  ${filtered.length?`<div class="grid grid-3">${filtered.map(measureCard).join("")}</div>`:`<div class="empty"><strong>No matching measure</strong>Try an acronym, measure name, population, or domain.</div>`}`;
  $("#measure-search")?.addEventListener("input",debounce(e=>{state.filters.measureQuery=e.target.value;renderMeasures()},120));
  $("#measure-domain")?.addEventListener("change",e=>{state.filters.measureDomain=e.target.value;renderMeasures()});
}
function renderMeasure(id){
  const m=measureById[id]; if(!m)return renderNotFound();
  const range=m.scoreRange?.max===null||m.scoreRange?.max===undefined?`${m.scoreRange?.min??0}+ ${m.scoreRange?.unit||""}`:`${m.scoreRange.min}–${m.scoreRange.max} ${m.scoreRange.unit||""}`;
  main.innerHTML=pageHead(`${m.acronym} — ${m.name}`,m.purpose,`<button class="button button-primary" id="use-measure">Use in assessment</button><a class="button" href="#/measures">Back</a>`) +
  `<div class="detail-layout"><div class="detail-main">
    <section class="card"><h2>Clinical use</h2><p>${esc(m.purpose)}</p><div class="card-footer">${m.domains.map(d=>chip(domainLabels[d]||d,"recommended")).join("")}</div></section>
    <section class="card"><h2>Scoring</h2><p>${esc(m.scoringNotes)}</p><div class="notice" style="margin-top:14px">${esc(m.interpretation)}</div></section>
    <section class="card"><h2>Reassessment</h2><p>${esc(m.reassessmentUse)}</p></section>
    <section class="card"><h2>Licensing / permissions</h2><p>${esc(m.licensing)}</p></section>
    ${m.changeEvidence?.length?`<section class="card"><h2>Stored population-specific change evidence</h2>${m.changeEvidence.map(e=>`<div class="reference-item"><strong>${e.type}: ${e.value} ${e.unit}</strong><div>${esc(e.label)}</div><small>This is only surfaced by the engine when the case context matches.</small></div>`).join("")}</section>`:""}
    <section class="card"><h2>References</h2>${refHtml(m.sources)}</section>
  </div><aside class="card sticky-panel"><h3>Measure metadata</h3><dl class="meta-list">
    <div class="meta-row"><dt>Type</dt><dd>${esc(m.measureType)}</dd></div><div class="meta-row"><dt>Time</dt><dd>${esc(m.estimatedTime)}</dd></div>
    <div class="meta-row"><dt>Equipment</dt><dd>${esc(m.equipment)}</dd></div><div class="meta-row"><dt>Score</dt><dd>${esc(range)}</dd></div>
    <div class="meta-row"><dt>Direction</dt><dd>${m.scoreDirection==="higher"?"Higher is better":m.scoreDirection==="lower"?"Lower is better":"Context-dependent"}</dd></div>
  </dl></aside></div>`;
  $("#use-measure")?.addEventListener("click",()=>{const c=ensureWorkingCase();if(!c.selectedMeasures.includes(m.id))c.selectedMeasures.push(m.id);state.assessmentStep=3;navigate("/assessment");toast(`${m.acronym} added to the working assessment.`)});
}

function stepper(current){
  return `<div class="stepper">${["Case","Assessment","Measures","Scores","Goals & save"].map((x,i)=>`<div class="step ${current===i+1?"active":current>i+1?"done":""}">${i+1}. ${x}</div>`).join("")}</div>`;
}
function startAssessmentWithCondition(id){
  const c=createEmptyCase(); c.diagnosisId=id; setWorkingCase(c); state.assessmentStep=1; navigate("/assessment");
}
function caseForm(c){
  return `<div class="card"><div class="notice notice-warning" style="margin-bottom:16px"><strong>Do not enter identifiers.</strong> Use only a case ID/nickname. Never enter a name, MRN, phone number, national ID, or similar information.</div>
  <div class="form-grid">
    <div class="field"><label for="case-nickname">Case ID / nickname</label><input id="case-nickname" data-bind="nickname" value="${esc(c.nickname)}" placeholder="e.g., Stroke-A01"></div>
    <div class="field"><label for="case-age">Age band</label><select id="case-age" data-bind="ageBand"><option value="">Not specified</option>${["Pediatric","18–39","40–64","65–74","75+"].map(x=>`<option ${c.ageBand===x?"selected":""}>${x}</option>`).join("")}</select></div>
    <div class="field"><label for="case-dx">Neurological condition</label><select id="case-dx" data-bind="diagnosisId"><option value="">Generic neuro assessment</option>${conditions.map(x=>`<option value="${x.id}" ${c.diagnosisId===x.id?"selected":""}>${esc(x.name)}</option>`).join("")}</select></div>
    <div class="field"><label for="case-phase">Phase</label><select id="case-phase" data-bind="phase"><option value="">Not specified</option>${["acute","subacute","chronic"].map(x=>`<option value="${x}" ${c.phase===x?"selected":""}>${titleCase(x)}</option>`).join("")}</select></div>
    <div class="field"><label for="case-setting">Setting</label><select id="case-setting" data-bind="setting"><option value="">Not specified</option>${["acute care","inpatient","outpatient","home health","community"].map(x=>`<option value="${x}" ${c.setting===x?"selected":""}>${titleCase(x)}</option>`).join("")}</select></div>
    <div class="field"><label for="case-device">Assistive device</label><input id="case-device" data-bind="assistiveDevice" value="${esc(c.assistiveDevice)}" placeholder="None / cane / walker / wheelchair…"></div>
    <div class="field"><label for="baseline-date">Baseline date</label><input id="baseline-date" data-bind="baselineDate" type="date" value="${esc(c.baselineDate)}"></div>
    <div class="field field-span-2"><label for="primary-goal">Primary patient priority</label><textarea id="primary-goal" data-bind="primaryGoal" placeholder="Non-identifying functional priority…">${esc(c.primaryGoal)}</textarea></div>
  </div></div>`;
}
function assessmentChecklist(c){
  const condition=conditionById[c.diagnosisId];
  const concernSet=new Set(c.assessment?.concerns||[]);
  const checkedSet=new Set(c.assessment?.checked||[]);
  return `<div class="notice" style="margin-bottom:14px">Mark domains that are clinically impaired/important. These clinician-marked concerns drive the local interpretation and draft-goal engine more than arbitrary score thresholds.</div>
  <div class="checklist">${assessmentDomains.map((d,i)=>`<details class="check-section" ${i<4||condition?.assessmentDomains.includes(d.id)?"open":""}><summary><span>${d.name}</span><label class="chip"><input type="checkbox" data-concern="${d.id}" ${concernSet.has(d.id)?"checked":""}> Priority domain</label></summary><div class="check-body">${d.items.map((item,j)=>{const key=`${d.id}:${j}`;return `<label class="check-item"><input type="checkbox" data-check="${key}" ${checkedSet.has(key)?"checked":""}><span>${esc(item)}${condition?.assessmentDomains.includes(d.id)?`<small>Relevant to ${esc(condition.name)}</small>`:""}</span></label>`}).join("")}</div></details>`).join("")}
  ${condition?`<div class="card"><h3>${esc(condition.name)} — diagnosis-specific additions</h3><ul class="bullets">${condition.specificAssessment.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}</div>`;
}
function measurePicker(c){
  const condition=conditionById[c.diagnosisId];
  const selected=new Set(c.selectedMeasures||[]);
  let groups;
  if(condition)groups=[["essential",condition.measures.essential],["recommended",condition.measures.recommended],["optional",condition.measures.optional]];
  else groups=[["recommended",["bbs","10mwt","tug","6mwt","5xsts"]],["optional",measures.slice(0,12).map(m=>m.id)]];
  return `<div class="notice" style="margin-bottom:14px">Select a small set that matches the patient and the question you need to answer. “Essential” here means high-priority within this site’s condition mapping, not mandatory for every patient.</div>
  <div class="grid grid-2">${groups.map(([priority,ids])=>`<div class="card"><div class="card-top"><h3>${titleCase(priority)}</h3>${chip(priority,priority)}</div>${[...new Set(ids)].map(id=>{const m=measureById[id];if(!m)return"";return `<label class="measure-row"><div><strong>${esc(m.acronym)}</strong> — ${esc(m.name)}<p>${esc(m.purpose)}</p></div><input type="checkbox" data-measure-select="${m.id}" ${selected.has(m.id)?"checked":""} aria-label="Select ${esc(m.acronym)}"></label>`}).join("")}</div>`).join("")}</div>
  <div class="card section"><h3>Selected (${selected.size})</h3><div class="card-footer">${[...selected].map(id=>chip(measureById[id]?.acronym||id,"recommended")).join("")||"<span class='score-note'>No measures selected yet.</span>"}</div></div>`;
}
function scoreRows(c){
  if(!c.selectedMeasures?.length)return `<div class="empty"><strong>No measures selected</strong>Go back to the measure-selection step.</div>`;
  return `<div class="card"><div class="inline-fields" style="margin-bottom:12px"><div class="field"><label for="tp-date">Assessment date</label><input type="date" id="tp-date" value="${new Date().toISOString().slice(0,10)}"></div><div class="field"><label for="tp-label">Timepoint</label><select id="tp-label">${["Initial","Week 2","Week 4","Week 6","Week 8","Week 12","Discharge","Follow-up"].map(x=>`<option>${x}</option>`).join("")}</select></div></div>
  <table class="score-table"><thead><tr><th>Measure</th><th>Entry</th><th>Context</th></tr></thead><tbody>${c.selectedMeasures.map(id=>{
    const m=measureById[id];if(!m)return"";
    if(m.inputType==="gait-speed")return `<tr><td><strong>${m.acronym}</strong><div class="score-note">${esc(m.name)}</div></td><td><div class="inline-fields"><input class="score-input" id="score-${m.id}-distance" type="number" step="0.01" min="0" placeholder="distance m"><input class="score-input" id="score-${m.id}-time" type="number" step="0.01" min="0" placeholder="time s"></div><div id="error-${m.id}" class="score-error"></div></td><td><select class="score-input" id="score-${m.id}-speedtype"><option value="comfortable">Comfortable</option><option value="fast">Fast</option></select><div class="score-note">Exact timed distance is stored with the result.</div></td></tr>`;
    const type=m.inputType==="text"?"text":"number",step=m.scoreRange?.step||((m.inputType==="integer")?1:"any");
    return `<tr><td><strong>${m.acronym}</strong><div class="score-note">${esc(m.name)}</div></td><td><input class="score-input" id="score-${m.id}" type="${type}" ${type==="number"?`step="${step}" min="${m.scoreRange?.min??0}" ${Number.isFinite(m.scoreRange?.max)?`max="${m.scoreRange.max}"`:""}`:""} placeholder="${m.scoreRange?.unit||"value"}"><div id="error-${m.id}" class="score-error"></div></td><td><div class="score-note">${esc(m.scoringNotes)}</div></td></tr>`;
  }).join("")}</tbody></table><div class="page-actions" style="margin-top:16px"><button id="save-timepoint" class="button button-primary">Save score timepoint</button></div></div>`;
}
function insightHtml(c){
  const insight=interpretCase(c);
  return `<div class="notice" style="margin-bottom:14px">${esc(insight.caveat)}</div>
  <section class="section"><div class="section-head"><div><h2>Priority domains</h2><p>Driven by clinician-marked concerns plus condition/measure relevance.</p></div></div>${insight.priorities.length?`<div class="insight-grid">${insight.priorities.map(x=>`<div class="insight"><strong>${esc(x.title)}</strong><p>${esc(x.text)}</p><span class="confidence">${esc(x.confidence)}</span></div>`).join("")}</div>`:`<div class="empty"><strong>No priority domains marked</strong>Mark clinical concerns in the assessment checklist to generate domain-level priorities.</div>`}</section>
  <section class="section"><div class="section-head"><div><h2>Score interpretation</h2><p>No universal diagnostic cutoffs are applied.</p></div></div>${insight.scoreStatements.length?`<div class="grid grid-2">${insight.scoreStatements.map(x=>`<div class="card"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p><span class="confidence">${esc(x.confidence)}</span></div>`).join("")}</div>`:`<div class="empty"><strong>No saved scores</strong>Add a timepoint to generate score-specific interpretation.</div>`}</section>
  ${insight.changeStatements.length?`<section class="section"><div class="section-head"><div><h2>Change since prior timepoint</h2><p>Meaningful change is only labeled when stored evidence matches the selected context.</p></div></div><div class="grid grid-2">${insight.changeStatements.map(x=>`<div class="card"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p><span class="confidence">${esc(x.confidence)}</span></div>`).join("")}</div></section>`:""}
  <section class="section"><div class="card"><h3>Suggested reassessment set</h3><p>${insight.reassessment.length?`Consider repeating: ${insight.reassessment.map(esc).join(", ")}. Keep protocol, device/assistance, and scoring version consistent where possible.`:"Select measures first."}</p></div></section>`;
}
function goalsHtml(c){
  const goals=c.goals||[];
  return `<div class="form-grid" style="margin-bottom:16px"><div class="field"><label for="goal-timeframe">Draft goal timeframe</label><select id="goal-timeframe">${["1–2 weeks","4 weeks","6 weeks","8 weeks","12 weeks","custom"].map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>&nbsp;</label><button id="generate-goals" class="button button-primary">Generate / refresh draft goals</button></div></div>
  <div class="notice">Goals are editable drafts. The engine will not invent a numeric target when matching evidence is unavailable; clinician selection is required.</div>
  <div class="section grid grid-2" id="goal-list">${goals.length?goals.map(g=>`<div class="card goal-card" data-goal="${g.id}"><div class="card-top"><div><h3>${esc(g.title)}</h3><p>Baseline: ${esc(g.baseline)}</p></div>${chip(domainLabels[g.domain]||g.domain,"recommended")}</div><textarea data-goal-text="${g.id}">${esc(g.text)}</textarea><small>${esc(g.evidenceNote)}</small><div class="goal-status"><label for="status-${g.id}">Status</label><select id="status-${g.id}" data-goal-status="${g.id}">${["Not started","In progress","Met","Revised"].map(x=>`<option ${g.status===x?"selected":""}>${x}</option>`).join("")}</select></div></div>`).join(""):`<div class="empty" style="grid-column:1/-1"><strong>No draft goals yet</strong>Mark priority domains and generate goals.</div>`}</div>`;
}
function renderAssessment(){
  const c=ensureWorkingCase(), step=state.assessmentStep;
  let body="";
  if(step===1)body=caseForm(c);
  if(step===2)body=assessmentChecklist(c);
  if(step===3)body=measurePicker(c);
  if(step===4)body=`${scoreRows(c)}<div class="section">${insightHtml(c)}</div>`;
  if(step===5)body=`${goalsHtml(c)}<section class="section card"><h3>Save case locally</h3><p>Only non-identifying information should be stored. Data remains in this browser unless you export a JSON backup.</p><div class="page-actions" style="margin-top:14px"><button id="save-case" class="button button-primary">Save local case</button><button id="print-case" class="button">Print summary</button></div></section>`;
  main.innerHTML=pageHead("Assessment Builder",c.diagnosisId?`Working case: ${esc(conditionById[c.diagnosisId]?.name||"Neuro assessment")}`:"Build a generic neuro PT assessment or select a diagnosis.",`<button id="new-case" class="button">New case</button>`) + stepper(step) + body +
    `<div class="page-actions section"><button id="assessment-back" class="button" ${step===1?"disabled":""}>Back</button><button id="assessment-next" class="button button-primary" ${step===5?"disabled":""}>${step===4?"Review goals":"Next"}</button></div>`;
  wireAssessment(step,c);
}
function wireCommonCaseBindings(c){
  $$("[data-bind]").forEach(el=>el.addEventListener("input",e=>{c[e.currentTarget.dataset.bind]=e.currentTarget.value}));
  $$("[data-bind]").forEach(el=>el.addEventListener("change",e=>{c[e.currentTarget.dataset.bind]=e.currentTarget.value}));
}
function wireAssessment(step,c){
  wireCommonCaseBindings(c);
  $("#new-case")?.addEventListener("click",()=>{setWorkingCase(createEmptyCase());state.assessmentStep=1;renderAssessment()});
  $("#assessment-back")?.addEventListener("click",()=>{state.assessmentStep=Math.max(1,step-1);renderAssessment()});
  $("#assessment-next")?.addEventListener("click",()=>{state.assessmentStep=Math.min(5,step+1);renderAssessment()});
  if(step===2){
    $$("[data-concern]").forEach(el=>el.addEventListener("change",()=>{
      c.assessment.concerns=$$("[data-concern]:checked").map(x=>x.dataset.concern);
    }));
    $$("[data-check]").forEach(el=>el.addEventListener("change",()=>{
      c.assessment.checked=$$("[data-check]:checked").map(x=>x.dataset.check);
    }));
  }
  if(step===3){
    $$("[data-measure-select]").forEach(el=>el.addEventListener("change",()=>{
      c.selectedMeasures=$$("[data-measure-select]:checked").map(x=>x.dataset.measureSelect);
      renderAssessment();
    }));
  }
  if(step===4)$("#save-timepoint")?.addEventListener("click",()=>saveTimepoint(c,()=>renderAssessment()));
  if(step===5){
    wireGoalEvents(c,()=>renderAssessment());
    $("#save-case")?.addEventListener("click",()=>{if(!c.nickname)c.nickname=`Case ${getCases().length+1}`;upsertCase(c);toast("Case saved locally.")});
    $("#print-case")?.addEventListener("click",()=>window.print());
  }
}
function saveTimepoint(c,after){
  const date=$("#tp-date")?.value,label=$("#tp-label")?.value||"Assessment";
  if(!date){toast("Choose an assessment date.");return}
  const scores=[];let errors=0;
  c.selectedMeasures.forEach(id=>{
    const m=measureById[id];let result;
    if(m.inputType==="gait-speed"){
      result=buildScoreEntry(id,null,{distance:$(`#score-${id}-distance`)?.value,time:$(`#score-${id}-time`)?.value,speedType:$(`#score-${id}-speedtype`)?.value,device:c.assistiveDevice});
    }else result=buildScoreEntry(id,$(`#score-${id}`)?.value,{device:c.assistiveDevice});
    const err=$(`#error-${id}`);if(result.ok){if(err)err.textContent="";scores.push(result.entry)}else{errors++;if(err)err.textContent=result.error}
  });
  if(errors){toast("Fix invalid or missing score entries.");return}
  const existing=c.timepoints.findIndex(t=>t.date===date&&t.label===label);
  const tp={id:existing>=0?c.timepoints[existing].id:`tp-${Date.now()}`,date,label,scores};
  if(existing>=0)c.timepoints[existing]=tp;else c.timepoints.push(tp);
  c.timepoints.sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  toast("Score timepoint saved to the working case.");after?.();
}
function renderScores(){
  const c=ensureWorkingCase();
  main.innerHTML=pageHead("Score & Interpret","Enter a new timepoint for the working case, then review deterministic, context-aware interpretation.",`<a class="button" href="#/assessment">Assessment Builder</a>`) +
    `<section class="card"><div class="card-top"><div><h3>${esc(c.nickname||"Unsaved working case")}</h3><p>${esc(conditionById[c.diagnosisId]?.name||"Generic neuro assessment")} · ${c.timepoints.length} saved timepoint(s)</p></div><a class="button button-sm" href="#/measures">Browse measures</a></div></section>
    <section class="section">${scoreRows(c)}</section><section class="section">${insightHtml(c)}</section>`;
  $("#save-timepoint")?.addEventListener("click",()=>saveTimepoint(c,()=>renderScores()));
}
function renderGoals(){
  const c=ensureWorkingCase();
  main.innerHTML=pageHead("Draft rehabilitation goals","SMART-style drafts based on clinician-marked domains, entered baselines, and conservative evidence matching.",`<a class="button" href="#/scores">Review scores</a>`) +
    `<section class="card"><h3>${esc(c.nickname||"Working case")}</h3><p>${esc(c.primaryGoal||"No patient priority entered yet.")}</p></section><section class="section">${goalsHtml(c)}</section>
    <section class="section card"><button id="save-goal-case" class="button button-primary">Save goals to local case</button></section>`;
  wireGoalEvents(c,()=>renderGoals());
  $("#save-goal-case")?.addEventListener("click",()=>{if(!c.nickname)c.nickname=`Case ${getCases().length+1}`;upsertCase(c);toast("Goals and case saved locally.")});
}
function wireGoalEvents(c,after){
  $("#generate-goals")?.addEventListener("click",()=>{const tf=$("#goal-timeframe")?.value||"4 weeks";c.goals=generateGoals(c,tf);after?.();toast("Draft goals generated.")});
  $$("[data-goal-text]").forEach(el=>el.addEventListener("input",e=>{const g=c.goals.find(x=>x.id===e.currentTarget.dataset.goalText);if(g)g.text=e.currentTarget.value}));
  $$("[data-goal-status]").forEach(el=>el.addEventListener("change",e=>{const g=c.goals.find(x=>x.id===e.currentTarget.dataset.goalStatus);if(g)g.status=e.currentTarget.value}));
}
function caseCard(c){
  const dx=conditionById[c.diagnosisId]?.name||"Generic neuro";
  return `<div class="card"><h3>${esc(c.nickname||"Unnamed case")}</h3><p>${esc(dx)} · ${c.timepoints?.length||0} timepoint(s)</p><div class="card-footer">${chip(formatDate(c.baselineDate))}${chip(`${c.goals?.length||0} goals`)}</div><div class="page-actions" style="margin-top:14px"><button class="button button-sm" data-open-case="${c.id}">Open</button><button class="button button-sm" data-progress-case="${c.id}">Progress</button></div></div>`;
}
function renderCases(){
  const cases=getCases();
  main.innerHTML=pageHead("Saved Cases","Local browser storage only. Use non-identifying case IDs.",`<button class="button button-primary" id="case-new">New case</button>`) +
    `<div class="notice notice-warning">Do not store names, MRNs, phone numbers, national IDs, exact addresses, or other identifying information.</div>
    <section class="section">${cases.length?`<div class="case-list">${cases.map(c=>`<div class="card case-row"><div><h3>${esc(c.nickname||"Unnamed case")}</h3><p>${esc(conditionById[c.diagnosisId]?.name||"Generic neuro")} · Baseline ${formatDate(c.baselineDate)} · Updated ${new Date(c.updatedAt||c.createdAt).toLocaleDateString()}</p></div><div class="case-actions"><button class="button button-sm" data-open-case="${c.id}">Open</button><button class="button button-sm" data-progress-case="${c.id}">Progress</button><button class="button button-sm" data-duplicate-case="${c.id}">Duplicate</button><button class="button button-sm button-danger" data-delete-case="${c.id}">Delete</button></div></div>`).join("")}</div>`:`<div class="empty"><strong>No local cases</strong>Start an assessment and save it here.</div>`}</section>
    <section class="section card"><h3>Local data controls</h3><p>Export a non-identifying JSON backup, import a compatible backup, or clear all local case data.</p><div class="page-actions" style="margin-top:14px"><button class="button" id="export-cases">Export JSON backup</button><label class="button" for="import-file">Import JSON backup</label><input id="import-file" class="sr-only" type="file" accept="application/json"><button class="button button-danger" id="clear-cases">Clear all local data</button></div></section>`;
  wireCaseButtons();
  $("#case-new")?.addEventListener("click",()=>{setWorkingCase(createEmptyCase());state.assessmentStep=1;navigate("/assessment")});
  $("#export-cases")?.addEventListener("click",()=>downloadJson("neuropt-cases-backup.json",exportBackup()));
  $("#import-file")?.addEventListener("change",async e=>{try{const text=await e.target.files?.[0]?.text();const n=importBackup(JSON.parse(text));toast(`Imported ${n} case(s).`);renderCases()}catch(err){toast(err.message||"Import failed.")}});
  $("#clear-cases")?.addEventListener("click",()=>{if(confirm("Delete all locally saved Neuro PT cases from this browser?")){clearCases();toast("Local case data cleared.");renderCases()}});
}
function wireCaseButtons(){
  $$("[data-open-case]").forEach(b=>b.addEventListener("click",()=>{const c=getCases().find(x=>x.id===b.dataset.openCase);if(c){setWorkingCase(c);state.assessmentStep=1;navigate("/assessment")}}));
  $$("[data-progress-case]").forEach(b=>b.addEventListener("click",()=>navigate(`/progress/${b.dataset.progressCase}`)));
  $$("[data-duplicate-case]").forEach(b=>b.addEventListener("click",()=>{duplicateCase(b.dataset.duplicateCase);toast("Case duplicated.");renderCases()}));
  $$("[data-delete-case]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete this local case?")){deleteCase(b.dataset.deleteCase);toast("Case deleted.");renderCases()}}));
}
function renderProgress(id){
  const c=getCases().find(x=>x.id===id);if(!c)return renderNotFound();
  const scoreSeries={};
  (c.timepoints||[]).forEach(tp=>(tp.scores||[]).forEach(s=>{(scoreSeries[s.measureId]??=[]).push({date:tp.date,label:tp.label,value:s.value,unit:s.unit})}));
  const numeric=Object.entries(scoreSeries).filter(([,rows])=>rows.some(r=>typeof r.value==="number"));
  main.innerHTML=pageHead(`Progress — ${esc(c.nickname||"Case")}`,`${esc(conditionById[c.diagnosisId]?.name||"Generic neuro")} · ${c.timepoints.length} timepoint(s)`,`<button class="button button-primary" id="progress-open">Open case</button><a class="button" href="#/cases">Back</a>`) +
    `<div class="stat-strip"><div class="stat"><strong>${c.timepoints.length}</strong><span>Assessment dates</span></div><div class="stat"><strong>${Object.keys(scoreSeries).length}</strong><span>Measures tracked</span></div><div class="stat"><strong>${c.goals?.length||0}</strong><span>Goals</span></div><div class="stat"><strong>${(c.goals||[]).filter(g=>g.status==="Met").length}</strong><span>Goals met</span></div></div>
    <section class="section"><div class="section-head"><div><h2>Score history</h2><p>Simple local trend display. It does not infer clinical significance without matching evidence.</p></div></div>${numeric.length?`<div class="grid grid-2">${numeric.map(([mid,rows])=>{const m=measureById[mid];const vals=rows.filter(r=>typeof r.value==="number").map(r=>r.value);const max=Math.max(...vals,1),min=Math.min(...vals,0),span=Math.max(max-min,0.0001);return `<div class="card"><h3>${esc(m?.acronym||mid)} — ${esc(m?.name||"Measure")}</h3><div class="trend" style="margin-top:14px">${rows.map(r=>`<div class="trend-row"><small>${formatDate(r.date)} · ${esc(r.label)}</small><div class="trend-track"><div class="trend-fill" style="width:${Math.max(3,((Number(r.value)-min)/span)*100)}%"></div></div><strong>${esc(r.value)} ${esc(r.unit||"")}</strong></div>`).join("")}</div></div>`}).join("")}</div>`:`<div class="empty"><strong>No numeric trend data</strong>Add at least two score timepoints for trend review.</div>`}</section>
    <section class="section">${insightHtml(c)}</section>
    <section class="section"><div class="section-head"><div><h2>Goal status</h2></div></div>${c.goals?.length?`<div class="grid grid-2">${c.goals.map(g=>`<div class="card"><div class="card-top"><h3>${esc(g.title)}</h3>${chip(g.status,g.status==="Met"?"essential":"recommended")}</div><p>${esc(g.text)}</p></div>`).join("")}</div>`:`<div class="empty"><strong>No saved goals</strong>Generate goals from the Goals workspace.</div>`}</section>`;
  $("#progress-open")?.addEventListener("click",()=>{setWorkingCase(c);state.assessmentStep=4;navigate("/assessment")});
}
function renderAbout(){
  const refIds=["sralabRMD","anptEdge","mdsPermissions","asiaIsncsci","whoICF"];
  main.innerHTML=pageHead("References, safety & architecture","How this v1 handles evidence, privacy, licensing, and future AI.") +
  `<div class="grid grid-2"><section class="card"><h2>Clinical safety</h2><ul class="bullets"><li>No score establishes a diagnosis.</li><li>No universal cutoff is applied across diagnoses.</li><li>MDC/MCID is only surfaced when stored evidence matches the selected context.</li><li>Complex proprietary/standardized tools use final verified score entry rather than unvalidated auto-scoring.</li><li>Red flags prompt medical escalation; they do not generate an AI diagnosis.</li></ul></section>
  <section class="card"><h2>Privacy</h2><p>v1 uses browser localStorage. No login or backend is required. The case model intentionally asks for a non-identifying case ID instead of a patient name.</p><div class="notice notice-warning" style="margin-top:12px">Do not enter patient name, MRN, phone number, national ID, exact address, or other identifying information.</div></section>
  <section class="card"><h2>Clinical Insight Engine</h2><p>This is deterministic local JavaScript, not a language model. It combines condition mappings, clinician-marked concerns, selected measures, score direction, change over time and carefully matched evidence.</p></section>
  <section class="card"><h2>Future AI adapter</h2><p>A public GitHub Pages frontend cannot safely contain private API keys. The code includes a disabled AI adapter so a future secure backend can be added without exposing credentials.</p></section></div>
  <section class="section card"><h2>Core references</h2>${refHtml(refIds)}</section>
  <section class="section card"><h2>Known v1 limitations</h2><p>This is a clinical education/decision-support MVP, not validated medical software. Rare-condition mapping is intentionally conservative. Many population-specific psychometric values are not yet encoded. Pediatric disease-specific measures need a dedicated evidence expansion. Full scoring for ISNCSCI and MDS-UPDRS is intentionally not implemented.</p></section>`;
}
function renderNotFound(){main.innerHTML=pageHead("Not found","The requested Neuro PT page does not exist.",`<a class="button button-primary" href="#/">Dashboard</a>`)}
function render(){
  state.route=parseHash();renderNav();
  const {name,param}=state.route;
  if(name==="home")renderHome();
  else if(name==="conditions")renderConditions();
  else if(name==="condition")renderCondition(param);
  else if(name==="measures")renderMeasures();
  else if(name==="measure")renderMeasure(param);
  else if(name==="assessment")renderAssessment();
  else if(name==="scores")renderScores();
  else if(name==="goals")renderGoals();
  else if(name==="cases")renderCases();
  else if(name==="progress")renderProgress(param);
  else if(name==="about")renderAbout();
  else renderNotFound();
  main.focus({preventScroll:true});
  $(".sidebar")?.classList.remove("open");
}
function setupSearch(){
  const input=$("#global-search"),box=$("#search-results");
  input.addEventListener("input",debounce(()=>{
    const q=input.value.trim().toLowerCase();
    if(q.length<2){box.hidden=true;box.innerHTML="";return}
    const conditionHits=conditions.filter(c=>[c.name,...c.synonyms,c.category,...c.impairments].join(" ").toLowerCase().includes(q)).slice(0,5);
    const measureHits=measures.filter(m=>[m.name,m.acronym,m.purpose,...m.domains,...m.populations].join(" ").toLowerCase().includes(q)).slice(0,5);
    const domainHits=assessmentDomains.filter(d=>[d.name,...d.items].join(" ").toLowerCase().includes(q)).slice(0,3);
    const items=[
      ...conditionHits.map(c=>({label:c.name,meta:`Condition · ${c.category}`,href:`#/condition/${c.id}`})),
      ...measureHits.map(m=>({label:`${m.acronym} — ${m.name}`,meta:`Outcome measure · ${m.domains.map(d=>domainLabels[d]||d).join(", ")}`,href:`#/measure/${m.id}`})),
      ...domainHits.map(d=>({label:d.name,meta:"Assessment domain",href:`#/measures?domain=${d.id}`}))
    ];
    box.innerHTML=items.length?items.map(x=>`<a class="search-item" role="option" href="${x.href}"><strong>${esc(x.label)}</strong><small>${esc(x.meta)}</small></a>`).join(""):`<div class="search-item"><strong>No matches</strong><small>Try a condition, acronym, or impairment domain.</small></div>`;
    box.hidden=false;
  },100));
  input.addEventListener("keydown",e=>{if(e.key==="Escape"){box.hidden=true;input.blur()}});
  document.addEventListener("click",e=>{if(!e.target.closest(".search-wrap"))box.hidden=true});
}
function setupTheme(){
  const prefs=getPrefs();const preferred=prefs.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  document.documentElement.dataset.theme=preferred;
  $("#theme-toggle").addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;setPref("theme",next)});
}
function setupShell(){
  setupTheme();setupSearch();
  $("#menu-toggle")?.addEventListener("click",()=>$(".sidebar")?.classList.toggle("open"));
  addEventListener("hashchange",render);
  if("serviceWorker" in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  render();
}
setupShell();
