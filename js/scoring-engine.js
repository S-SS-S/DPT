import { measureById } from "./data/measures.js";

export function validateMeasureValue(measure,value){
  if(value===null||value===undefined||String(value).trim()==="") return {valid:false,message:"Enter a value."};
  if(measure.inputType==="text") return {valid:String(value).trim().length>0,message:"Enter the verified classification or score."};
  const n=Number(value);
  if(!Number.isFinite(n))return {valid:false,message:"Enter a valid number."};
  if(n<0)return {valid:false,message:"Negative values are not valid."};
  const r=measure.scoreRange||{};
  if(Number.isFinite(r.min)&&n<r.min)return {valid:false,message:`Minimum is ${r.min}.`};
  if(Number.isFinite(r.max)&&n>r.max)return {valid:false,message:`Maximum is ${r.max}.`};
  if(measure.inputType==="integer"&&!Number.isInteger(n))return {valid:false,message:"Enter a whole-number score."};
  if(r.step&&Math.abs((n/r.step)-Math.round(n/r.step))>1e-8)return {valid:false,message:`Use ${r.step}-point increments.`};
  if(["tug","5xsts","fsst"].includes(measure.id)&&n===0)return {valid:false,message:"A timed performance cannot be 0 seconds."};
  return {valid:true,value:n};
}

export function calculateGaitSpeed(distance,time){
  const d=Number(distance),t=Number(time);
  if(!Number.isFinite(d)||!Number.isFinite(t)||d<=0||t<=0)return null;
  return d/t;
}

export function buildScoreEntry(measureId,raw,extra={}){
  const m=measureById[measureId]; if(!m)throw new Error("Unknown measure.");
  if(m.inputType==="gait-speed"&&extra.distance&&extra.time){
    const speed=calculateGaitSpeed(extra.distance,extra.time);
    if(speed===null)return {ok:false,error:"Distance and time must both be greater than 0."};
    return {ok:true,entry:{measureId,value:Number(speed.toFixed(3)),unit:"m/s",protocol:{distance:Number(extra.distance),time:Number(extra.time),speedType:extra.speedType||"comfortable",device:extra.device||""}}};
  }
  const result=validateMeasureValue(m,raw);
  if(!result.valid)return {ok:false,error:result.message};
  return {ok:true,entry:{measureId,value:m.inputType==="text"?String(raw).trim():result.value,unit:m.scoreRange?.unit||"",protocol:extra||{}}};
}

export function compareScores(measure,previous,current){
  if(typeof previous!=="number"||typeof current!=="number")return null;
  const absolute=Number((current-previous).toFixed(3));
  const improved=measure.scoreDirection==="higher"?absolute>0:measure.scoreDirection==="lower"?absolute<0:null;
  const worsened=improved===null?null:!improved&&absolute!==0;
  const pct=previous!==0?Number(((absolute/Math.abs(previous))*100).toFixed(1)):null;
  return {absolute,improved,worsened,percent:pct};
}

export function matchingChangeEvidence(measure,caseData){
  return (measure.changeEvidence||[]).filter(e=>{
    const c=(caseData?.diagnosisFamily||"").toLowerCase();
    const p=(caseData?.phase||"").toLowerCase();
    const s=(caseData?.setting||"").toLowerCase();
    return (!e.population||c===e.population)&&(!e.phase||p===e.phase)&&(!e.setting||s===e.setting);
  });
}
