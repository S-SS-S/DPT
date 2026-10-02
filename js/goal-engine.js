import { assessmentDomains, domainLabels } from "./data/assessment-domains.js";
import { measureById } from "./data/measures.js";
import { interpretCase } from "./clinical-engine.js";

const domainById=Object.fromEntries(assessmentDomains.map(d=>[d.id,d]));
const hasValue=v=>v!==null&&v!==undefined&&String(v).trim()!=="";

const templates={
  balance:({timeframe})=>`Within ${timeframe}, the patient will improve the selected balance task from the documented baseline toward a clinician-selected measurable target, using the same assistance/device and test conditions at reassessment.`,
  gait:({timeframe})=>`Within ${timeframe}, the patient will improve walking performance for the stated functional purpose from the documented baseline toward a clinician-selected target, using the documented device/assistance as required.`,
  mobility:({timeframe})=>`Within ${timeframe}, the patient will improve the selected transfer or functional-mobility task from the documented assistance/time baseline toward the clinician-selected target level.`,
  motor:({timeframe})=>`Within ${timeframe}, the patient will improve task-specific motor performance in the documented affected movement(s), using the recorded strength/ROM/motor-control baseline and a clinician-selected objective target.`,
  tone:({timeframe})=>`Within ${timeframe}, the patient will improve function limited by the documented tone abnormality, with progress judged by the same muscle group/side, functional task and verified tone measure when used.`,
  sensory:({timeframe})=>`Within ${timeframe}, the patient will demonstrate safer and more effective performance of the selected functional task using the required sensory or compensatory strategy, based on the documented sensory deficit.`,
  coordination:({timeframe})=>`Within ${timeframe}, the patient will improve coordinated performance during the selected functional task from the documented baseline, verified with the same standardized task or ataxia/coordination measure.`,
  endurance:({timeframe})=>`Within ${timeframe}, the patient will improve walking or activity tolerance from the documented baseline toward a clinician-selected duration/distance target while maintaining an appropriate physiologic response.`,
  participation:({timeframe})=>`Within ${timeframe}, the patient will improve participation in the selected home, community, work or school activity using a measurable task or patient-reported target agreed with the patient.`,
  cognition:({timeframe})=>`Within ${timeframe}, the patient will complete the selected mobility task with the clinician-selected level of cueing/strategy while maintaining safety.`,
  vision:({timeframe})=>`Within ${timeframe}, the patient will complete the selected mobility task using the required visual/perceptual strategy with the clinician-selected level of assistance and safety.`,
  safety:({timeframe})=>`Within ${timeframe}, the patient will complete the selected mobility activity using the agreed safety strategy, device and supervision level without preventable loss of balance or unsafe technique during observed practice.`
};

const interventionLibrary={
  balance:["Static-to-dynamic balance practice matched to the documented assistance level","Anticipatory and reactive stepping practice when safe","Functional reaching, turning and multidirectional weight shift","Progress base of support, surface, vision or dual-task demand one variable at a time"],
  gait:["Task-specific overground walking with documented device/orthosis","Practice gait initiation, step length/symmetry, turning and stopping","Obstacle or stair practice when relevant and safe","Progress speed, distance or environmental complexity while preserving gait quality"],
  mobility:["Bed mobility and transfer practice at the recorded assistance level","Repeated sit-to-stand with task-specific cueing","Practice movement sequencing and safe device setup","Progress assistance, repetitions or task complexity based on response"],
  motor:["Task-specific strengthening through the impaired movement pattern","Selective motor-control practice with high-quality repetitions","Functional closed-chain tasks such as sit-to-stand or step-up when appropriate","Active ROM and mobility work for documented ROM limitations"],
  tone:["Positioning and active movement through available range","Task-specific activation of antagonists and functional movement practice","Sustained positioning/stretch only when indicated and tolerated","Reassess the same muscle group, side and functional effect rather than treating the grade alone"],
  sensory:["Sensory discrimination and limb-awareness practice when appropriate","Visual feedback or compensatory strategy training","Task-specific foot/hand placement practice with safety emphasis","Skin/protective-sensation education when reduced sensation affects safety"],
  coordination:["Accuracy-focused reaching or stepping practice","Slow controlled multi-joint task practice before speed progression","Trunk control and proximal stability during limb tasks","Progress task speed/complexity only while movement quality remains acceptable"],
  endurance:["Interval walking or cycling matched to current tolerance","Monitor vitals, symptoms and perceived exertion","Gradually increase work duration before adding intensity when appropriate","Use planned rest periods and document recovery"],
  participation:["Practice the patient-selected home/community/work/school task","Simulate relevant environmental demands","Train caregiver or device strategy when it directly supports the goal","Link impairment work to a meaningful functional task each session"],
  cognition:["Use simple external cues and consistent task setup","Practice safety-critical mobility with cueing level documented","Add dual-task demand only when single-task performance is safe","Train caregiver cueing strategy when relevant"],
  vision:["Visual scanning/anchoring strategies during functional mobility","Environmental setup to reduce avoidable visual-perceptual errors","Practice turning, obstacle negotiation and reaching with compensatory strategy","Coordinate referral/escalation when visual symptoms are new or unexplained"],
  safety:["Practice device use and transfer safety","Falls-prevention education tied to the documented mechanism","Caregiver training when hands-on assistance is required","Address environmental hazards relevant to the actual home/community task"]
};

function latestScoreBaseline(caseData,domain){
  const latest=[...(caseData.timepoints||[])].sort((a,b)=>String(a.date).localeCompare(String(b.date))).at(-1);
  if(!latest)return null;
  const entry=(latest.scores||[]).find(s=>measureById[s.measureId]?.domains?.includes(domain));
  if(!entry)return null;
  const m=measureById[entry.measureId];
  return `${m.acronym} = ${entry.value} ${entry.unit||""}`.trim();
}

function structuredBaseline(caseData,domain){
  const d=domainById[domain],values=caseData.assessment?.details?.[domain]||{};
  if(!d)return null;
  const rows=(d.fields||[]).map(f=>hasValue(values[f.key])?`${f.label}: ${values[f.key]}`:null).filter(Boolean);
  return rows.length?rows.slice(0,3).join("; "):null;
}

function baselineForDomain(caseData,domain){
  return latestScoreBaseline(caseData,domain)||structuredBaseline(caseData,domain);
}

function doseEstimate(caseData,priorityCount){
  const setting=(caseData.setting||"").toLowerCase();
  const phase=(caseData.phase||"").toLowerCase();
  let frequency="2 sessions/week",weeks=4,min=8,max=8;
  if(setting==="outpatient"){
    if(phase==="acute"||phase==="subacute"){frequency="2–3 sessions/week";weeks=4;min=8;max=12}
    else {frequency="1–2 sessions/week";weeks=6;min=6;max=12}
  }else if(setting==="home health"){
    frequency="1–3 sessions/week";weeks=4;min=4;max=12;
  }else if(setting==="community"){
    frequency="1–2 sessions/week";weeks=6;min=6;max=12;
  }else if(setting==="inpatient"){
    frequency="5–6 therapy days/week within the rehabilitation program";weeks=2;min=10;max=12;
  }else if(setting==="acute care"){
    frequency="Frequent short contacts while medically stable, per acute-care service model";weeks=1;min=null;max=null;
  }
  if(priorityCount>=5 && setting==="outpatient" && max!==null){frequency="2–3 sessions/week";weeks=Math.max(weeks,6);min=12;max=18}
  const sessions=min===null?"Determined by admission length, medical stability and local service model":min===max?`${min} planned sessions`:`${min}–${max} planned sessions`;
  return {frequency,weeks,sessions,rationale:"Planning estimate generated from setting, phase and number of documented priority domains. It is not a guideline-derived prescription and must be edited for tolerance, prognosis, service constraints and local policy."};
}

export function generateGoals(caseData,timeframe="4 weeks"){
  const insight=interpretCase(caseData);
  const domains=insight.priorities.map(p=>p.id);
  if(caseData.primaryGoal && !domains.includes("participation"))domains.push("participation");
  return [...new Set(domains)].slice(0,6).map((domain,i)=>{
    const baseline=baselineForDomain(caseData,domain);
    const body=(templates[domain]||templates.participation)({timeframe});
    return {
      id:`goal-${Date.now()}-${i}`,
      domain,
      title:`${domainLabels[domain]||domain} goal`,
      baseline:baseline||"No linked structured baseline or outcome score entered.",
      text:body,
      status:"Not started",
      timeframe,
      evidenceNote: baseline
        ? "Baseline is linked to an entered examination finding or the most recent outcome measure. The numeric/assistance target remains clinician-selected unless matching evidence is stored."
        : "Add a measurable baseline before finalizing the goal."
    };
  });
}

export function generatePlan(caseData){
  const insight=interpretCase(caseData);
  const domains=insight.priorities.map(p=>p.id).filter(d=>interventionLibrary[d]);
  const unique=[...new Set(domains)].slice(0,5);
  const dose=doseEstimate(caseData,unique.length);
  const focus=unique.map(domain=>({
    domain,
    title:domainLabels[domain]||domain,
    baseline:baselineForDomain(caseData,domain)||"Priority selected; add a structured baseline or outcome score for a more specific plan.",
    items:interventionLibrary[domain].slice(0,4)
  }));
  const nextSession=[
    "Recheck medical stability, pain/fatigue and response to the previous session before progression.",
    ...unique.slice(0,3).map(d=>`Reassess the key ${domainLabels[d]||d} finding, then progress one task variable if performance and safety permit.`),
    "Document assistance/device level and one objective anchor so the next reassessment is directly comparable."
  ];
  const followUp=[
    "Repeat selected outcome measures using the same protocol/device/assistance when clinically appropriate.",
    "Progress task difficulty only when movement quality, safety and physiologic response remain acceptable.",
    "Revise goals and session estimate if the patient reaches a target early, plateaus, develops a new limitation or changes setting."
  ];
  return {
    generatedAt:new Date().toISOString(),
    dose,
    focus,
    nextSession,
    followUp,
    disclaimer:"Editable clinical planning draft. It does not prescribe treatment and does not replace examination, local protocols, contraindication screening or clinician judgment."
  };
}
