import { safeJsonParse } from "./utils.js";
const KEY="neuropt.cases.v1";
const PREFS="neuropt.prefs.v1";

export function getCases(){return safeJsonParse(localStorage.getItem(KEY),[]) || []}
export function saveCases(cases){localStorage.setItem(KEY,JSON.stringify(cases))}
export function upsertCase(caseData){
  const cases=getCases(); const i=cases.findIndex(c=>c.id===caseData.id);
  const stamped={...caseData,updatedAt:new Date().toISOString()};
  if(i>=0) cases[i]=stamped; else cases.unshift(stamped);
  saveCases(cases); return stamped;
}
export function deleteCase(id){saveCases(getCases().filter(c=>c.id!==id))}
export function clearCases(){localStorage.removeItem(KEY)}
export function duplicateCase(id){
  const source=getCases().find(c=>c.id===id); if(!source)return null;
  const copy=structuredClone(source); copy.id=`case-${Date.now()}`; copy.nickname=`${source.nickname||"Case"} copy`;
  copy.createdAt=new Date().toISOString(); copy.updatedAt=copy.createdAt;
  upsertCase(copy); return copy;
}
export function exportBackup(){return {schema:"neuropt-cases-v1",exportedAt:new Date().toISOString(),cases:getCases()}}
export function importBackup(payload){
  if(!payload||payload.schema!=="neuropt-cases-v1"||!Array.isArray(payload.cases)) throw new Error("Unsupported backup format.");
  saveCases(payload.cases); return payload.cases.length;
}
export function getPrefs(){return safeJsonParse(localStorage.getItem(PREFS),{})||{}}
export function setPref(key,value){const p=getPrefs();p[key]=value;localStorage.setItem(PREFS,JSON.stringify(p))}
