export const assessmentDomains = [
  {id:"history",name:"History",icon:"H",items:[
    "Diagnosis and onset / mechanism when relevant","Previous level of function","Current mobility and assistance required",
    "Falls history","Assistive devices and orthoses","Home and environmental context","Patient priorities and participation goals",
    "Fatigue, pain and dizziness","Medications relevant to mobility or motor performance","Precautions and restrictions"
  ]},
  {id:"vitals",name:"Medical stability / vitals",icon:"V",items:[
    "Heart rate","Blood pressure","SpO₂","Orthostatic symptoms when relevant","Response to exertion","Condition-specific medical precautions"
  ]},
  {id:"cognition",name:"Cognition / communication",icon:"C",items:[
    "Alertness and arousal","Orientation","Command following","Attention","Communication","Memory when relevant","Safety awareness"
  ]},
  {id:"vision",name:"Vision / oculomotor / perception",icon:"O",items:[
    "Visual field concerns","Neglect / inattention","Diplopia","Oculomotor screen when relevant","Visuospatial concerns"
  ]},
  {id:"motor",name:"Motor control / strength",icon:"M",items:[
    "Selective motor control","Strength","Range of motion","Motor planning","Movement symmetry"
  ]},
  {id:"tone",name:"Tone / spasticity / rigidity",icon:"T",items:[
    "Tone","Spasticity","Rigidity","Clonus when indicated","Effect of tone on function"
  ]},
  {id:"sensory",name:"Sensory",icon:"S",items:[
    "Light touch","Proprioception","Protective sensation when relevant","Cortical sensory concerns when relevant"
  ]},
  {id:"coordination",name:"Coordination / ataxia",icon:"A",items:[
    "Limb coordination","Truncal control","Dysmetria","Rapid alternating movement","Ataxic movement pattern"
  ]},
  {id:"balance",name:"Balance",icon:"B",items:[
    "Sitting balance","Static standing","Dynamic standing","Reactive balance","Anticipatory balance"
  ]},
  {id:"mobility",name:"Transfers / functional mobility",icon:"F",items:[
    "Bed mobility","Sit-to-stand","Stand-to-sit","Bed/chair transfer","Floor transfer when appropriate"
  ]},
  {id:"gait",name:"Gait",icon:"G",items:[
    "Gait initiation","Speed","Symmetry","Step length","Cadence when useful","Turning","Dual task","Stairs","Assistive device","Community ambulation"
  ]},
  {id:"endurance",name:"Endurance",icon:"E",items:[
    "Walking endurance","Exertional response","Fatigue","Rest requirements"
  ]},
  {id:"participation",name:"Independence / participation",icon:"P",items:[
    "ADLs","Home mobility","Community mobility","Work / school roles","Participation restrictions"
  ]},
  {id:"safety",name:"Falls / safety",icon:"R",items:[
    "Recent falls or near-falls","Supervision needs","Environmental hazards","Caregiver assistance","Emergency or escalation concerns"
  ]}
];

export const domainLabels = Object.fromEntries(assessmentDomains.map(d => [d.id, d.name]));
