const commonRedFlags = [
  "New or rapidly worsening focal neurological deficit, altered consciousness, seizure, or severe acute headache requires urgent medical evaluation.",
  "New chest pain, severe dyspnea, syncope, or unstable vital signs should stop routine rehabilitation assessment and trigger appropriate escalation."
];

const families = {
  stroke: {
    category:"Cerebrovascular",system:"Central",ageGroup:"Adult / mixed",common:true,
    description:"Cerebrovascular injury with neurological deficits that may affect motor control, sensation, balance, gait, communication, cognition and participation.",
    impairments:["Motor control and weakness","Postural control","Gait and mobility","Sensation / perception","Endurance and participation"],
    assessmentDomains:["motor","sensory","vision","balance","mobility","gait","endurance","cognition","safety"],
    specificAssessment:["Clarify lesion location, stroke type, onset and medical stability","Screen neglect, visual field and perceptual issues when relevant","Characterize selective motor control, synergy patterns and affected-side loading","Document assistance level and device for transfers/gait"],
    redFlags:commonRedFlags,
    measures:{essential:["10mwt","bbs","tug"],recommended:["fma","fac","6mwt","pass"],optional:["fga","mrs","nihss","tis","rmi","barthel"]},
    goalDomains:["balance","gait","mobility","motor","participation"]
  },
  parkinsons:{
    category:"Parkinsonism / movement disorder",system:"Central",ageGroup:"Adult",common:true,
    description:"Progressive movement disorder characterized by bradykinesia and other motor/non-motor features that can affect gait, balance, transfers and participation.",
    impairments:["Bradykinesia","Postural instability","Gait hypokinesia / freezing","Turning and dual-task mobility","Reduced activity / participation"],
    assessmentDomains:["motor","balance","mobility","gait","endurance","cognition","safety"],
    specificAssessment:["Document medication timing / ON-OFF state when clinically relevant","Ask about freezing, falls and turning difficulty","Observe gait initiation, step amplitude, turning and dual task","Screen orthostatic symptoms and exercise response"],
    redFlags:commonRedFlags,
    measures:{essential:["mini-best","tug","10mwt"],recommended:["6mwt","fga","mds-updrs","5xsts"],optional:["abc","freezing","fsst","bbs"]},
    goalDomains:["balance","gait","mobility","endurance","participation"]
  },
  ms:{
    category:"Demyelinating / inflammatory CNS",system:"Central",ageGroup:"Adult",common:true,
    description:"Immune-mediated CNS demyelinating disease with variable motor, sensory, balance, fatigue and walking limitations.",
    impairments:["Walking limitation","Fatigue","Balance impairment","Weakness / motor control","Sensory disturbance"],
    assessmentDomains:["motor","sensory","balance","gait","endurance","participation","safety"],
    specificAssessment:["Clarify relapse status and current medical stability","Characterize fatigue and heat sensitivity","Document walking reserve, device use and falls","Screen sensory and visual contributors to mobility"],
    redFlags:commonRedFlags,
    measures:{essential:["10mwt","tug"],recommended:["6mwt","mini-best","msws12","edss"],optional:["2mwt","bbs","abc","5xsts"]},
    goalDomains:["gait","endurance","balance","fatigue","participation"]
  },
  sci:{
    category:"Spinal cord / myelopathy",system:"Central",ageGroup:"Adult / mixed",common:true,
    description:"Spinal cord lesion that can affect motor, sensory and autonomic function below the neurological level, with wide variation in mobility and independence.",
    impairments:["Motor and sensory loss","Transfers and mobility","Walking or wheelchair mobility","Endurance","Autonomic / skin / safety considerations"],
    assessmentDomains:["vitals","motor","sensory","mobility","gait","endurance","participation","safety"],
    specificAssessment:["Use current neurological level/classification when available","Screen skin integrity, autonomic and orthostatic issues as relevant","Characterize transfer, wheelchair and/or walking capacity","Document braces, devices and physical assistance"],
    redFlags:[...commonRedFlags,"Symptoms concerning for autonomic dysreflexia in a susceptible person require immediate recognition and medical management according to local protocol."],
    measures:{essential:["isncsci","scim"],recommended:["wisci2","10mwt","6mwt"],optional:["2mwt","tug","bbs"]},
    goalDomains:["mobility","gait","endurance","participation","motor"]
  },
  ataxia:{
    category:"Cerebellar / ataxia",system:"Central",ageGroup:"Adult / mixed",common:false,
    description:"Ataxic syndrome affecting coordination, balance and gait. Etiology and progression determine the appropriate rehabilitation emphasis.",
    impairments:["Limb/trunk incoordination","Dynamic balance","Gait variability","Transfers","Participation"],
    assessmentDomains:["coordination","balance","gait","mobility","vision","safety"],
    specificAssessment:["Characterize truncal versus appendicular ataxia","Observe base of support, path deviation and turning","Screen oculomotor/visual contributors where relevant","Document falls and use of external support"],
    redFlags:commonRedFlags,
    measures:{essential:["sara"],recommended:["10mwt","tug","mini-best"],optional:["6mwt","fga","bbs","fsst"]},
    goalDomains:["coordination","balance","gait","mobility"]
  },
  brain:{
    category:"Traumatic / acquired brain injury",system:"Central",ageGroup:"Adult / mixed",common:true,
    description:"Acquired brain injury may produce motor, balance, cognitive, behavioral and participation limitations with severity-dependent rehabilitation needs.",
    impairments:["Motor control","Balance / mobility","Cognition and safety awareness","Endurance","Participation"],
    assessmentDomains:["cognition","vision","motor","sensory","balance","mobility","gait","endurance","participation","safety"],
    specificAssessment:["Establish arousal, command following and safety awareness","Screen vision/oculomotor and vestibular complaints when appropriate","Match mobility testing to cognitive and physical capacity","For high-level recovery, assess community and complex mobility"],
    redFlags:commonRedFlags,
    measures:{essential:["tug","10mwt"],recommended:["6mwt","bbs","fac"],optional:["himat","fga","rmi","barthel"]},
    goalDomains:["mobility","balance","gait","cognition","participation"]
  },
  peripheral:{
    category:"Peripheral nervous system",system:"Peripheral",ageGroup:"Adult / mixed",common:true,
    description:"Peripheral nerve dysfunction can affect strength, sensation, balance, gait and endurance; pattern and medical stability vary by etiology.",
    impairments:["Weakness","Sensory loss","Balance","Gait","Endurance"],
    assessmentDomains:["motor","sensory","balance","gait","endurance","safety"],
    specificAssessment:["Map weakness and sensory pattern","Check distal proprioception/protective sensation where relevant","Document orthoses/devices and foot clearance","Monitor exertional response and fatigability"],
    redFlags:commonRedFlags,
    measures:{essential:["10mwt","tug"],recommended:["6mwt","5xsts"],optional:["2mwt","bbs","abc"]},
    goalDomains:["motor","balance","gait","endurance"]
  },
  neuromuscular:{
    category:"Motor neuron / neuromuscular",system:"Peripheral / neuromuscular",ageGroup:"Adult / mixed",common:false,
    description:"Neuromuscular disease can cause progressive or fluctuating weakness, fatigue and mobility limitations; outcome selection should respect disease-specific safety and stage.",
    impairments:["Weakness","Fatigability","Transfers","Gait / mobility","Endurance / participation"],
    assessmentDomains:["vitals","motor","mobility","gait","endurance","participation","safety"],
    specificAssessment:["Characterize pattern and progression/fluctuation of weakness","Monitor exertional tolerance and respiratory concerns within scope","Document floor/bed/chair transfer strategies","Avoid interpreting fatigue-related decline as a single universal severity score"],
    redFlags:commonRedFlags,
    measures:{essential:["10mwt"],recommended:["6mwt","5xsts","2mwt"],optional:["tug","30sts"]},
    goalDomains:["mobility","motor","endurance","participation"]
  },
  vestibular:{
    category:"Vestibular / neuro-otology",system:"Peripheral / central",ageGroup:"Adult",common:true,
    description:"Vestibular dysfunction may affect gaze stability, balance, gait and symptom-limited participation. Peripheral and central presentations require different medical context.",
    impairments:["Dizziness","Gaze instability","Balance","Dynamic gait","Participation"],
    assessmentDomains:["history","vision","balance","gait","safety"],
    specificAssessment:["Clarify symptom timing/triggers and medical diagnosis","Screen oculomotor and gaze-stability findings within clinician scope","Assess static/dynamic balance and gait under sensory challenges","Document falls and motion-provoked participation restriction"],
    redFlags:[...commonRedFlags,"Acute vestibular symptoms with new focal neurological signs require urgent medical evaluation for a possible central cause."],
    measures:{essential:["fga","mini-best"],recommended:["tug","5xsts","abc"],optional:["dgi","frt","fsst"]},
    goalDomains:["balance","gait","participation"]
  },
  pediatric:{
    category:"Pediatric neuro",system:"Central / neuromuscular",ageGroup:"Pediatric",common:true,
    description:"Pediatric neurological rehabilitation requires age-, development- and diagnosis-specific measures. Adult thresholds should not be applied automatically.",
    impairments:["Gross motor function","Mobility","Balance","Motor control","Participation"],
    assessmentDomains:["history","motor","balance","mobility","gait","participation","safety"],
    specificAssessment:["Use developmental and age-appropriate examination","Involve caregiver priorities and school/community participation","Select pediatric-validated measures rather than importing adult cutoffs","Document equipment, orthoses and assistance"],
    redFlags:commonRedFlags,
    measures:{essential:[],recommended:["10mwt","6mwt"],optional:["bbs"]},
    goalDomains:["motor","mobility","balance","participation"]
  }
};

const defs = [
 ["ischemic-stroke","Ischemic stroke","stroke",["cerebral infarction","CVA"]],
 ["intracerebral-hemorrhage","Intracerebral hemorrhage","stroke",["ICH","hemorrhagic stroke"]],
 ["subarachnoid-hemorrhage","Subarachnoid hemorrhage","stroke",["SAH"]],
 ["brainstem-stroke","Brainstem stroke","stroke",["posterior circulation stroke"]],
 ["cerebellar-stroke","Cerebellar stroke","stroke",["cerebellar infarct","cerebellar hemorrhage"]],
 ["lacunar-stroke","Lacunar stroke","stroke",["small vessel stroke"]],
 ["post-stroke-hemiparesis","Post-stroke hemiparesis","stroke",["hemiplegia","hemiparesis"]],
 ["chronic-stroke","Chronic stroke rehabilitation","stroke",["chronic CVA"]],
 ["traumatic-brain-injury","Traumatic brain injury","brain",["TBI"]],
 ["diffuse-axonal-injury","Diffuse axonal injury","brain",["DAI"]],
 ["hypoxic-brain-injury","Anoxic / hypoxic brain injury","brain",["HBI","anoxic brain injury"]],
 ["disorders-consciousness","Disorders of consciousness","brain",["DOC"],{common:false,evidenceNote:"Outcome selection should be specialized and matched to level of consciousness; generic mobility measures may be inappropriate."}],
 ["parkinsons-disease","Parkinson’s disease","parkinsons",["PD"]],
 ["progressive-supranuclear-palsy","Progressive supranuclear palsy","parkinsons",["PSP"],{common:false,evidenceNote:"Use Parkinsonism measures selectively; disease-specific evidence may be more limited than idiopathic PD."}],
 ["multiple-system-atrophy","Multiple system atrophy","parkinsons",["MSA"],{common:false,evidenceNote:"Autonomic dysfunction and rapid progression may materially affect safety and measure selection."}],
 ["corticobasal-syndrome","Corticobasal syndrome / degeneration","parkinsons",["CBS","CBD"],{common:false,evidenceNote:"Measure mapping is clinician-selected where disease-specific validation is limited."}],
 ["huntingtons-disease","Huntington’s disease","parkinsons",["HD"],{common:false,evidenceNote:"Use generic mobility/balance outcomes alongside disease-specific neurological assessment where available."}],
 ["dystonia","Dystonia","parkinsons",[],{common:false,evidenceNote:"PT outcomes should be matched to the body region and functional complaint; generic balance measures may not be appropriate for every presentation."}],
 ["essential-tremor","Essential tremor","parkinsons",[],{common:false,evidenceNote:"PT measurement is situation-dependent; emphasize functional limitations rather than tremor severity alone."}],
 ["multiple-sclerosis","Multiple sclerosis","ms",["MS"]],
 ["neuromyelitis-optica","Neuromyelitis optica spectrum disorder","ms",["NMOSD"],{common:false,evidenceNote:"Use lesion- and function-specific measures; do not assume MS-specific cutoffs apply."}],
 ["mogad","MOG antibody-associated disease","ms",["MOGAD"],{common:false,evidenceNote:"Limited PT-specific measure validation; select measures according to resulting neurological impairments."}],
 ["transverse-myelitis","Transverse myelitis","sci",[],{common:false,evidenceNote:"Select spinal cord and mobility measures based on neurological deficits; traumatic SCI evidence should not be generalized automatically."}],
 ["adem","Acute disseminated encephalomyelitis","brain",["ADEM"],{common:false,evidenceNote:"Age and recovery stage strongly influence measure selection."}],
 ["traumatic-sci","Traumatic spinal cord injury","sci",["SCI"]],
 ["nontraumatic-sci","Non-traumatic spinal cord injury","sci",["NTSCI"]],
 ["cervical-myelopathy","Cervical myelopathy","sci",["degenerative cervical myelopathy","DCM"],{measures:{essential:["10mwt"],recommended:["tug","5xsts"],optional:["6mwt","scim"]}}],
 ["thoracic-myelopathy","Thoracic myelopathy","sci",[],{common:false,measures:{essential:["10mwt"],recommended:["tug","6mwt"],optional:["scim"]}}],
 ["spinal-cord-tumor","Spinal cord tumor rehabilitation","sci",[],{common:false,evidenceNote:"Use impairment-based measures; tumor-specific thresholds are not assumed."}],
 ["syringomyelia","Syringomyelia","sci",[],{common:false,evidenceNote:"Outcome selection depends on neurological distribution and progression."}],
 ["spina-bifida","Spina bifida / myelomeningocele","pediatric",["myelomeningocele"],{common:false,evidenceNote:"Use pediatric and diagnosis-specific measures where available; adult SCI thresholds are not applied."}],
 ["tethered-cord","Tethered cord","pediatric",[],{common:false,evidenceNote:"Use age- and impairment-specific measures; postoperative restrictions require local medical guidance."}],
 ["cerebellar-ataxia","Cerebellar ataxia","ataxia",[]],
 ["spinocerebellar-ataxia","Spinocerebellar ataxias","ataxia",["SCA"],{common:false}],
 ["friedreich-ataxia","Friedreich ataxia","ataxia",["FRDA"],{common:false}],
 ["ataxia-telangiectasia","Ataxia-telangiectasia","ataxia",["A-T"],{common:false,ageGroup:"Pediatric / mixed",evidenceNote:"Specialist pediatric/rare-disease outcome selection is recommended."}],
 ["episodic-ataxia","Episodic ataxia","ataxia",[],{common:false,evidenceNote:"Capture state/episode context; one score may not represent fluctuating function."}],
 ["als","Amyotrophic lateral sclerosis / motor neuron disease","neuromuscular",["ALS","MND"],{common:true,evidenceNote:"Disease-specific functional scales may be appropriate; avoid fatiguing testing that does not change management."}],
 ["spinal-muscular-atrophy","Spinal muscular atrophy","neuromuscular",["SMA"],{common:false,ageGroup:"Mixed",evidenceNote:"Use SMA- and age-specific validated measures where available."}],
 ["myasthenia-gravis","Myasthenia gravis","neuromuscular",["MG"],{common:false,evidenceNote:"Fatigability and medical stability are central; testing load should be clinically appropriate."}],
 ["duchenne-md","Duchenne muscular dystrophy","neuromuscular",["DMD"],{common:false,ageGroup:"Pediatric",evidenceNote:"Pediatric disease-specific measures should be preferred."}],
 ["becker-md","Becker muscular dystrophy","neuromuscular",["BMD"],{common:false}],
 ["limb-girdle-md","Limb-girdle muscular dystrophy","neuromuscular",["LGMD"],{common:false}],
 ["fshd","Facioscapulohumeral muscular dystrophy","neuromuscular",["FSHD"],{common:false}],
 ["guillain-barre","Guillain-Barré syndrome","peripheral",["GBS"],{common:true,evidenceNote:"Acute medical/respiratory and autonomic stability should precede routine performance testing."}],
 ["cidp","Chronic inflammatory demyelinating polyneuropathy","peripheral",["CIDP"],{common:false}],
 ["peripheral-neuropathy","Peripheral neuropathy","peripheral",[]],
 ["diabetic-polyneuropathy","Diabetic polyneuropathy","peripheral",["DPN"]],
 ["chemotherapy-neuropathy","Chemotherapy-induced peripheral neuropathy","peripheral",["CIPN"],{common:false}],
 ["charcot-marie-tooth","Charcot-Marie-Tooth disease","peripheral",["CMT"],{common:false}],
 ["critical-illness-neuromyopathy","Critical illness polyneuropathy / myopathy","peripheral",["CIP","CIM"],{common:false,evidenceNote:"Acute-care safety and generalized weakness measures may be more relevant than diagnosis-specific neuro scales."}],
 ["hereditary-spastic-paraplegia","Hereditary spastic paraplegia","sci",["HSP"],{common:false,evidenceNote:"Use gait, balance and spasticity measures; traumatic SCI classifications are not interchangeable."}],
 ["wilson-disease","Wilson disease","parkinsons",[],{common:false,evidenceNote:"Functional measure selection depends on movement-disorder and neurological phenotype."}],
 ["normal-pressure-hydrocephalus","Normal pressure hydrocephalus","brain",["NPH"],{common:false,measures:{essential:["tug","10mwt"],recommended:["5xsts","bbs"],optional:["6mwt"]}}],
 ["functional-neurological-disorder","Functional neurological disorder","brain",["FND"],{common:true,evidenceNote:"Use positive clinical diagnosis by appropriate medical professionals and function-focused rehabilitation measures; the site does not diagnose FND."}],
 ["brain-tumor","Brain tumor rehabilitation","brain",[],{common:false,evidenceNote:"Use location-, treatment- and deficit-specific measures; cancer/medical precautions may alter testing."}],
 ["post-neurosurgical","Post-neurosurgical neurological rehabilitation","brain",[],{common:false,evidenceNote:"Follow surgeon/local restrictions; measure selection is deficit-driven."}],
 ["encephalitis-recovery","Encephalitis recovery","brain",[],{common:false}],
 ["meningitis-neuro-deficits","Meningitis recovery with neurological deficits","brain",[],{common:false}],
 ["cerebral-palsy","Cerebral palsy","pediatric",["CP"],{common:true,evidenceNote:"Use GMFCS/GMFM and other pediatric CP-specific measures when available; adult cutoffs are not applied by this v1 dataset."}],
 ["pediatric-abi","Pediatric acquired brain injury","pediatric",["pediatric TBI"],{common:false}],
 ["pediatric-sci","Pediatric spinal cord injury","pediatric",["pediatric SCI"],{common:false}],
 ["unilateral-vestibular","Unilateral vestibular hypofunction","vestibular",["UVH"]],
 ["bilateral-vestibular","Bilateral vestibular hypofunction","vestibular",["BVH"],{common:false}],
 ["central-vestibular","Central vestibular disorder","vestibular",[],{common:false}],
 ["bppv","Benign paroxysmal positional vertigo","vestibular",["BPPV"],{common:true,evidenceNote:"Positional diagnostic maneuvers and treatment are not automated here; this entry focuses on rehabilitation measurement and safety."}]
];

function mergeMeasures(base, override){
  if(!override) return base;
  return {essential:override.essential||[],recommended:override.recommended||[],optional:override.optional||[]};
}

export const conditions = defs.map(([id,name,familyId,synonyms=[],override={}])=>{
  const f=families[familyId];
  return {
    id,name,synonyms,familyId,
    category:override.category||f.category,system:override.system||f.system,ageGroup:override.ageGroup||f.ageGroup,
    common:override.common ?? f.common,
    description:override.description||f.description,
    impairments:override.impairments||f.impairments,
    assessmentDomains:override.assessmentDomains||f.assessmentDomains,
    specificAssessment:override.specificAssessment||f.specificAssessment,
    redFlags:override.redFlags||f.redFlags,
    measures:mergeMeasures(f.measures,override.measures),
    goalDomains:override.goalDomains||f.goalDomains,
    evidenceNote:override.evidenceNote||"Recommendations are impairment- and presentation-dependent; select measures that match the patient, setting and test requirements."
  };
});

export const conditionById = Object.fromEntries(conditions.map(c=>[c.id,c]));
export const conditionCategories = [...new Set(conditions.map(c=>c.category))].sort();
