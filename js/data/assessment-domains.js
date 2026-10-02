export const assessmentDomains = [
  {id:"history",name:"History",icon:"H",items:[
    "Diagnosis and onset / mechanism when relevant","Previous level of function","Current mobility and assistance required",
    "Falls history","Assistive devices and orthoses","Home and environmental context","Patient priorities and participation goals",
    "Fatigue, pain and dizziness","Medications relevant to mobility or motor performance","Precautions and restrictions"
  ],fields:[
    {key:"previousFunction",label:"Previous level of function",type:"text",placeholder:"e.g., independent community ambulation"},
    {key:"currentFunction",label:"Current mobility / assistance",type:"text",placeholder:"e.g., min assist with walker"},
    {key:"falls",label:"Falls / near-falls",type:"text",placeholder:"frequency, circumstances"},
    {key:"symptoms",label:"Pain / fatigue / dizziness",type:"text",placeholder:"severity and functional effect"},
    {key:"precautions",label:"Precautions / restrictions",type:"text",placeholder:"medical or movement precautions"}
  ]},
  {id:"vitals",name:"Medical stability / vitals",icon:"V",items:[
    "Heart rate","Blood pressure","SpO₂","Orthostatic symptoms when relevant","Response to exertion","Condition-specific medical precautions"
  ],fields:[
    {key:"bp",label:"Blood pressure",type:"text",placeholder:"e.g., 128/76 mmHg"},
    {key:"hr",label:"Heart rate",type:"number",placeholder:"bpm",unit:"bpm"},
    {key:"spo2",label:"SpO₂",type:"number",placeholder:"%",unit:"%"},
    {key:"orthostatic",label:"Orthostatic symptoms",type:"select",options:["","None reported","Present","Not assessed"]},
    {key:"exertion",label:"Response to exertion",type:"text",placeholder:"RPE, symptoms, recovery"}
  ]},
  {id:"cognition",name:"Cognition / communication",icon:"C",items:[
    "Alertness and arousal","Orientation","Command following","Attention","Communication","Memory when relevant","Safety awareness"
  ],fields:[
    {key:"commands",label:"Command following",type:"select",options:["","Independent","Needs repetition","Needs simple cues","Unable to assess"]},
    {key:"communication",label:"Communication",type:"text",placeholder:"aphasia, dysarthria, communication aid, etc."},
    {key:"safetyAwareness",label:"Safety awareness / cognition notes",type:"text",placeholder:"attention, impulsivity, memory, insight"}
  ]},
  {id:"vision",name:"Vision / oculomotor / perception",icon:"O",items:[
    "Visual field concerns","Neglect / inattention","Diplopia","Oculomotor screen when relevant","Visuospatial concerns"
  ],fields:[
    {key:"field",label:"Visual field / neglect",type:"text",placeholder:"side and finding"},
    {key:"diplopia",label:"Diplopia / oculomotor finding",type:"text",placeholder:"describe if present"},
    {key:"perception",label:"Perceptual findings",type:"text",placeholder:"visuospatial or inattention findings"}
  ]},
  {id:"motor",name:"Motor control / strength",icon:"M",items:[
    "Selective motor control","Strength","Range of motion","Motor planning","Movement symmetry"
  ],fields:[
    {key:"side",label:"Affected side / distribution",type:"select",options:["","Right","Left","Bilateral","Axial / trunk","Generalized","Not applicable"]},
    {key:"upperStrength",label:"Upper-limb strength",type:"text",placeholder:"e.g., shoulder 3/5, elbow 4-/5; or summary"},
    {key:"lowerStrength",label:"Lower-limb strength",type:"text",placeholder:"e.g., hip 3+/5, knee 4/5; or summary"},
    {key:"upperRom",label:"Upper-limb ROM",type:"text",placeholder:"degrees / limitation / WFL"},
    {key:"lowerRom",label:"Lower-limb ROM",type:"text",placeholder:"degrees / limitation / WFL"},
    {key:"motorControl",label:"Selective motor control / symmetry",type:"text",placeholder:"synergy, fractionation, planning, symmetry"}
  ]},
  {id:"tone",name:"Tone / spasticity / rigidity",icon:"T",items:[
    "Tone","Spasticity","Rigidity","Clonus when indicated","Effect of tone on function"
  ],fields:[
    {key:"type",label:"Tone finding",type:"select",options:["","Normal / no clinically relevant change","Spasticity","Rigidity","Hypotonia","Mixed / other"]},
    {key:"distribution",label:"Distribution",type:"select",options:["","Upper limb","Lower limb","Upper + lower limb","Axial / trunk","Generalized"]},
    {key:"side",label:"Side",type:"select",options:["","Right","Left","Bilateral","Not applicable"]},
    {key:"mas",label:"MAS / tone grade if used",type:"text",placeholder:"e.g., elbow flexors 1+; plantarflexors 2"},
    {key:"clonus",label:"Clonus",type:"text",placeholder:"absent / present + location"},
    {key:"functionalImpact",label:"Effect on function",type:"text",placeholder:"gait, reach, hygiene, transfers, pain, etc."}
  ]},
  {id:"sensory",name:"Sensory",icon:"S",items:[
    "Light touch","Proprioception","Protective sensation when relevant","Cortical sensory concerns when relevant"
  ],fields:[
    {key:"side",label:"Side / distribution",type:"text",placeholder:"right, left, distal, dermatomal, etc."},
    {key:"lightTouch",label:"Light touch",type:"text",placeholder:"intact / reduced / absent + location"},
    {key:"proprioception",label:"Proprioception",type:"text",placeholder:"intact / impaired + joint/location"},
    {key:"protective",label:"Protective / cortical sensation",type:"text",placeholder:"finding when relevant"}
  ]},
  {id:"coordination",name:"Coordination / ataxia",icon:"A",items:[
    "Limb coordination","Truncal control","Dysmetria","Rapid alternating movement","Ataxic movement pattern"
  ],fields:[
    {key:"upper",label:"Upper-limb coordination",type:"text",placeholder:"dysmetria, tremor, speed/accuracy"},
    {key:"lower",label:"Lower-limb coordination",type:"text",placeholder:"heel-shin / stepping accuracy / other"},
    {key:"trunk",label:"Truncal control / ataxia",type:"text",placeholder:"sitting/standing/truncal findings"}
  ]},
  {id:"balance",name:"Balance",icon:"B",items:[
    "Sitting balance","Static standing","Dynamic standing","Reactive balance","Anticipatory balance"
  ],fields:[
    {key:"sitting",label:"Sitting balance",type:"select",options:["","Independent","Supervision","Contact guard","Min assist","Mod assist","Max assist","Dependent"]},
    {key:"standing",label:"Static standing",type:"select",options:["","Independent","Supervision","Contact guard","Min assist","Mod assist","Max assist","Unable"]},
    {key:"dynamic",label:"Dynamic / reactive balance",type:"text",placeholder:"describe loss of balance, stepping response, reach, perturbation"},
    {key:"support",label:"UE support / device",type:"text",placeholder:"none, rail, walker, cane, etc."}
  ]},
  {id:"mobility",name:"Transfers / functional mobility",icon:"F",items:[
    "Bed mobility","Sit-to-stand","Stand-to-sit","Bed/chair transfer","Floor transfer when appropriate"
  ],fields:[
    {key:"bed",label:"Bed mobility",type:"select",options:["","Independent","Supervision","Contact guard","Min assist","Mod assist","Max assist","Dependent"]},
    {key:"sitStand",label:"Sit-to-stand",type:"select",options:["","Independent","Supervision","Contact guard","Min assist","Mod assist","Max assist","Dependent"]},
    {key:"transfer",label:"Bed / chair transfer",type:"select",options:["","Independent","Supervision","Contact guard","Min assist","Mod assist","Max assist","Dependent"]},
    {key:"notes",label:"Transfer / mobility details",type:"text",placeholder:"technique, cues, equipment, asymmetry"}
  ]},
  {id:"gait",name:"Gait",icon:"G",items:[
    "Gait initiation","Speed","Symmetry","Step length","Cadence when useful","Turning","Dual task","Stairs","Assistive device","Community ambulation"
  ],fields:[
    {key:"assistance",label:"Walking assistance",type:"select",options:["","Independent","Supervision","Contact guard","Min assist","Mod assist","Max assist","Dependent / non-ambulatory"]},
    {key:"device",label:"Device / orthosis",type:"text",placeholder:"none, cane, walker, AFO, etc."},
    {key:"distance",label:"Observed walking distance",type:"text",placeholder:"e.g., 30 m / household only"},
    {key:"pattern",label:"Gait pattern",type:"text",placeholder:"speed, symmetry, step length, foot clearance, turning"},
    {key:"stairs",label:"Stairs",type:"text",placeholder:"ability, rails, assistance"}
  ]},
  {id:"endurance",name:"Endurance",icon:"E",items:[
    "Walking endurance","Exertional response","Fatigue","Rest requirements"
  ],fields:[
    {key:"tolerance",label:"Activity / walking tolerance",type:"text",placeholder:"minutes, distance, limiting symptom"},
    {key:"rpe",label:"RPE / exertion",type:"text",placeholder:"e.g., 5/10 at end of walk"},
    {key:"rests",label:"Rest requirement",type:"text",placeholder:"number / duration / reason"}
  ]},
  {id:"participation",name:"Independence / participation",icon:"P",items:[
    "ADLs","Home mobility","Community mobility","Work / school roles","Participation restrictions"
  ],fields:[
    {key:"adl",label:"ADL independence",type:"text",placeholder:"independent / assistance + task"},
    {key:"home",label:"Home mobility",type:"text",placeholder:"key barriers / supports"},
    {key:"community",label:"Community / work / school",type:"text",placeholder:"participation restriction and priority"}
  ]},
  {id:"safety",name:"Falls / safety",icon:"R",items:[
    "Recent falls or near-falls","Supervision needs","Environmental hazards","Caregiver assistance","Emergency or escalation concerns"
  ],fields:[
    {key:"falls",label:"Recent falls / near-falls",type:"text",placeholder:"number, timing, mechanism"},
    {key:"supervision",label:"Supervision requirement",type:"select",options:["","None","Intermittent","Continuous","Hands-on assistance"]},
    {key:"caregiver",label:"Caregiver support",type:"text",placeholder:"available / training needs"},
    {key:"hazards",label:"Safety / environmental concerns",type:"text",placeholder:"stairs, bathroom, cognition, equipment, etc."}
  ]}
];

export const domainLabels = {...Object.fromEntries(assessmentDomains.map(d => [d.id, d.name])), falls: "Falls / safety"};
