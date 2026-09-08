import { domainLabels } from "./data/assessment-domains.js";
import { measureById } from "./data/measures.js";
import { interpretCase } from "./clinical-engine.js";

const templates={
  balance:({timeframe})=>`Within ${timeframe}, the patient will demonstrate improved balance performance during the clinically relevant task(s), with the target level selected by the clinician based on baseline findings, safety, and a repeatable balance measure.`,
  gait:({timeframe})=>`Within ${timeframe}, the patient will improve walking performance for the stated functional purpose, using the documented assistive device if required, with the numeric target selected from the patient’s baseline and population-appropriate evidence.`,
  mobility:({timeframe})=>`Within ${timeframe}, the patient will improve functional mobility/transfer performance toward the level of assistance or time target selected by the clinician, using the same test conditions for reassessment.`,
  motor:({timeframe})=>`Within ${timeframe}, the patient will demonstrate improved task-specific motor performance in the affected movement(s), with an objective target selected from the baseline examination or a validated motor measure.`,
  coordination:({timeframe})=>`Within ${timeframe}, the patient will improve coordinated performance during the selected functional task, with progress verified using the same ataxia/coordination measure or standardized task.`,
  endurance:({timeframe})=>`Within ${timeframe}, the patient will improve walking or activity endurance from baseline toward a clinician-selected target while maintaining appropriate safety and exertional response.`,
  participation:({timeframe})=>`Within ${timeframe}, the patient will improve participation in the selected home/community/work/school activity, using a measurable task or patient-reported outcome selected with the patient.`,
  fatigue:({timeframe})=>`Within ${timeframe}, the patient will improve management of fatigue during the selected activity by meeting the clinician- and patient-selected activity/rest target without unsafe symptom escalation.`,
  cognition:({timeframe})=>`Within ${timeframe}, the patient will improve safe completion of the selected mobility task using the required cueing/strategy level, with the target defined by the clinician and care team.`
};

function baselineForDomain(caseData,domain){
  const latest=[...(caseData.timepoints||[])].sort((a,b)=>String(a.date).localeCompare(String(b.date))).at(-1);
  if(!latest)return null;
  const entry=(latest.scores||[]).find(s=>measureById[s.measureId]?.domains?.includes(domain));
  if(!entry)return null;
  const m=measureById[entry.measureId];
  return `${m.acronym} = ${entry.value} ${entry.unit||""}`.trim();
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
      baseline:baseline||"No linked baseline measure entered.",
      text:body,
      status:"Not started",
      timeframe,
      evidenceNote: baseline
        ? "Baseline is linked to the most recent entered measure. Target still requires clinician selection unless exact matching MDC/MCID evidence is available."
        : "Target requires clinician selection; no numeric baseline is linked."
    };
  });
}
