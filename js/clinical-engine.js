import { conditionById } from "./data/conditions.js";
import { measureById } from "./data/measures.js";
import { domainLabels } from "./data/assessment-domains.js";
import { compareScores, matchingChangeEvidence } from "./scoring-engine.js";

function getLatestEntries(caseData){
  const points=[...(caseData.timepoints||[])].sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const latest=points.at(-1)||null, previous=points.at(-2)||null;
  return {latest,previous};
}

export function interpretCase(caseData){
  const condition=conditionById[caseData.diagnosisId];
  const {latest,previous}=getLatestEntries(caseData);
  const concerns=new Set(caseData.assessment?.concerns||[]);
  const measuredDomains=new Set();
  const scoreStatements=[];
  const changeStatements=[];
  const evidenceStatements=[];

  for(const entry of latest?.scores||[]){
    const m=measureById[entry.measureId]; if(!m)continue;
    m.domains.forEach(d=>measuredDomains.add(d));
    const direction=m.scoreDirection==="higher"?"higher is better":m.scoreDirection==="lower"?"lower is better":"context-dependent";
    scoreStatements.push({
      title:`${m.acronym}: ${entry.value} ${entry.unit||""}`.trim(),
      text:`${m.purpose} Scoring direction: ${direction}. No universal diagnostic threshold is applied.`,
      confidence:"Directly supported by measure metadata"
    });
    if(previous){
      const old=previous.scores?.find(s=>s.measureId===entry.measureId);
      if(old && typeof old.value==="number" && typeof entry.value==="number"){
        const cmp=compareScores(m,old.value,entry.value);
        if(cmp){
          const sign=cmp.absolute>0?"+":"";
          let text=`Change from the previous timepoint: ${sign}${cmp.absolute} ${entry.unit||""}.`;
          const family=condition?.familyId==="stroke"?"stroke":condition?.familyId==="sci"?"sci":condition?.familyId;
          const matches=matchingChangeEvidence(m,{...caseData,diagnosisFamily:family});
          if(matches.length){
            const matched=matches.find(e=>Math.abs(cmp.absolute)>=e.value);
            if(matched){
              text+=` Absolute change meets or exceeds the stored ${matched.type} (${matched.value} ${matched.unit}) for ${matched.label}.`;
              evidenceStatements.push({measureId:m.id,evidence:matched});
            }else{
              text+=` Stored population-matched meaningful-change value: ${matches[0].value} ${matches[0].unit} (${matches[0].type}; ${matches[0].label}).`;
            }
          }else{
            text+=" Published MDC/MCID for this exact selected context is not stored; clinical significance is not inferred.";
          }
          changeStatements.push({title:`${m.acronym} change`,text,confidence:matches.length?"Population-specific evidence":"Clinician judgment required"});
        }
      }
    }
  }

  const priorityDomains=[...new Set([
    ...concerns,
    ...(condition?.goalDomains||[]).filter(d=>concerns.has(d)||measuredDomains.has(d))
  ])];

  const priorities=priorityDomains.map(d=>({
    id:d,
    title:domainLabels[d]||d,
    text:concerns.has(d)
      ? "Marked as a clinical concern in the assessment. Use examination findings and matching outcome measures to define the problem and target."
      : "This domain is relevant to the selected condition and is represented by the chosen outcome measures.",
    confidence:concerns.has(d)?"Direct assessment input":"Condition/measure mapping"
  }));

  const reassessment=[...new Set((caseData.selectedMeasures||[]).map(id=>measureById[id]?.acronym).filter(Boolean))];

  return {
    condition,
    priorities,
    scoreStatements,
    changeStatements,
    evidenceStatements,
    reassessment,
    caveat: latest
      ? "Interpretation is rules-based and transparent. It summarizes the selected condition, clinician-marked concerns, and entered scores; it does not diagnose or prescribe treatment."
      : "Add a score timepoint to generate score-specific interpretation."
  };
}
