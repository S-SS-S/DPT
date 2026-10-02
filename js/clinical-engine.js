import { conditionById } from "./data/conditions.js";
import { measureById } from "./data/measures.js";
import { assessmentDomains, domainLabels } from "./data/assessment-domains.js";
import { compareScores, matchingChangeEvidence } from "./scoring-engine.js";

const domainById=Object.fromEntries(assessmentDomains.map(d=>[d.id,d]));
const hasValue=v=>v!==null&&v!==undefined&&String(v).trim()!=="";

function getLatestEntries(caseData){
  const points=[...(caseData.timepoints||[])].sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const latest=points.at(-1)||null, previous=points.at(-2)||null;
  return {latest,previous};
}

function structuredFindingSummary(caseData,domainId){
  const values=caseData.assessment?.details?.[domainId]||{};
  const domain=domainById[domainId];
  if(!domain)return [];
  return (domain.fields||[]).map(f=>({label:f.label,value:values[f.key]})).filter(x=>hasValue(x.value));
}

function scoreRangeText(m){
  const r=m.scoreRange||{};
  if(Number.isFinite(r.min)&&Number.isFinite(r.max))return `${r.min}–${r.max} ${r.unit||""}`.trim();
  if(Number.isFinite(r.min))return `${r.min}+ ${r.unit||""}`.trim();
  return "See verified instrument/version";
}

export function interpretCase(caseData){
  const condition=conditionById[caseData.diagnosisId];
  const {latest,previous}=getLatestEntries(caseData);
  const concerns=new Set(caseData.assessment?.concerns||[]);
  const details=caseData.assessment?.details||{};
  const detailDomains=new Set(Object.entries(details).filter(([,v])=>Object.values(v||{}).some(hasValue)).map(([k])=>k));
  const measuredDomains=new Set();
  const scoreStatements=[];
  const changeStatements=[];
  const evidenceStatements=[];

  for(const entry of latest?.scores||[]){
    const m=measureById[entry.measureId]; if(!m)continue;
    m.domains.forEach(d=>measuredDomains.add(d));
    const direction=m.scoreDirection==="higher"?"higher values generally represent better performance":m.scoreDirection==="lower"?"lower values generally represent better performance":"interpretation is context-dependent";
    let clinicianReference="";
    if(entry.protocol?.referenceTarget){
      clinicianReference=` Clinician-entered reference/target: ${entry.protocol.referenceTarget}.`;
      if(typeof entry.value==="number" && m.scoreDirection!=="context"){
        const parsed=Number.parseFloat(String(entry.protocol.referenceTarget).replace(/[^0-9.+-]/g,""));
        if(Number.isFinite(parsed)){
          const meets=m.scoreDirection==="higher"?entry.value>=parsed:entry.value<=parsed;
          clinicianReference+=meets
            ? " The current value meets or exceeds that clinician-entered benchmark in the favorable direction."
            : " The current value has not yet reached that clinician-entered benchmark in the favorable direction.";
        }
      }
    }
    scoreStatements.push({
      title:`${m.acronym}: ${entry.value} ${entry.unit||""}`.trim(),
      text:`Reference frame: ${scoreRangeText(m)}; ${direction}. ${m.interpretation}${clinicianReference}`,
      confidence:"Measure metadata + entered result"
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
    ...detailDomains,
    ...(condition?.goalDomains||[]).filter(d=>concerns.has(d)||detailDomains.has(d)||measuredDomains.has(d))
  ])];

  const priorities=priorityDomains.map(d=>{
    const findings=structuredFindingSummary(caseData,d);
    const preview=findings.slice(0,4).map(x=>`${x.label}: ${x.value}`).join("; ");
    return {
      id:d,
      title:domainLabels[d]||d,
      text:preview
        ? `Structured findings: ${preview}${findings.length>4?"; …":""}`
        : concerns.has(d)
          ? "Marked as a clinical concern. Add structured findings and a matching outcome measure where appropriate."
          : "Relevant to the selected condition and represented by the chosen outcome measures.",
      confidence:preview?"Direct structured assessment input":concerns.has(d)?"Direct assessment input":"Condition/measure mapping"
    };
  });

  const reassessment=[...new Set((caseData.selectedMeasures||[]).map(id=>measureById[id]?.acronym).filter(Boolean))];

  return {
    condition,
    priorities,
    scoreStatements,
    changeStatements,
    evidenceStatements,
    reassessment,
    caveat: latest
      ? "Interpretation is rules-based and transparent. It combines structured examination findings, the selected condition, clinician-marked concerns and entered scores; it does not diagnose or replace clinician judgment."
      : "Structured examination findings can guide priorities now. Add a score timepoint for score-specific interpretation."
  };
}
