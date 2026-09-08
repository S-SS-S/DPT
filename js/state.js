import { uid } from "./utils.js";
export const state={
  route:{name:"home",param:null},
  workingCase:null,
  assessmentStep:1,
  filters:{conditionQuery:"",conditionCategory:"all",measureQuery:"",measureDomain:"all"}
};

export function createEmptyCase(){
  const now=new Date().toISOString();
  return {
    id:uid("case"),nickname:"",ageBand:"",diagnosisId:"",phase:"",setting:"",assistiveDevice:"",
    primaryGoal:"",baselineDate:new Date().toISOString().slice(0,10),createdAt:now,updatedAt:now,
    assessment:{concerns:[],checked:[]},selectedMeasures:[],timepoints:[],goals:[]
  };
}
export function ensureWorkingCase(){if(!state.workingCase)state.workingCase=createEmptyCase();return state.workingCase}
export function setWorkingCase(c){state.workingCase=structuredClone(c);return state.workingCase}
