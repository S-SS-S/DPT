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
    assessment:{concerns:[],checked:[],details:{}},selectedMeasures:[],timepoints:[],goals:[],plan:null
  };
}
export function ensureWorkingCase(){
  if(!state.workingCase)state.workingCase=createEmptyCase();
  state.workingCase.assessment=state.workingCase.assessment||{concerns:[],checked:[],details:{}};
  state.workingCase.assessment.concerns=state.workingCase.assessment.concerns||[];
  state.workingCase.assessment.checked=state.workingCase.assessment.checked||[];
  state.workingCase.assessment.details=state.workingCase.assessment.details||{};
  state.workingCase.selectedMeasures=state.workingCase.selectedMeasures||[];
  state.workingCase.timepoints=state.workingCase.timepoints||[];
  state.workingCase.goals=state.workingCase.goals||[];
  return state.workingCase;
}
export function setWorkingCase(c){
  state.workingCase=structuredClone(c);
  return ensureWorkingCase();
}
