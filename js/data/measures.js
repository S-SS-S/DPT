export const measures = [
  {
    id:"bbs",name:"Berg Balance Scale",acronym:"BBS",domains:["balance","falls"],populations:["stroke","parkinsons","ms","sci","brain-injury"],
    purpose:"Performance-based assessment of static and dynamic balance in adults.",measureType:"Performance-based",equipment:"Stopwatch, chairs, step/stool, ruler and shoe/slipper",estimatedTime:"15–20 min",
    scoreRange:{min:0,max:56,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter the verified total score from the administered form. Higher scores represent better balance performance. Do not apply one universal fall-risk cutoff across populations.",
    interpretation:"Use the total score with diagnosis, setting, mobility status and population-specific evidence. The application does not apply a universal diagnostic or fall-risk threshold.",
    reassessmentUse:"Useful for repeated balance assessment when the same administration conditions are maintained.",
    licensing:"Listed as free/public-domain by the Rehabilitation Measures Database; verify local/institutional requirements before reproducing forms.",
    sources:["bbsRMD","sralabRMD"]
  },
  {
    id:"mini-best",name:"Mini Balance Evaluation Systems Test",acronym:"Mini-BESTest",domains:["balance","gait","falls"],populations:["parkinsons","stroke","ms","vestibular"],
    purpose:"Assesses dynamic balance across multiple balance-control systems.",measureType:"Performance-based",equipment:"Standardized testing setup; see official/validated instructions",estimatedTime:"~10–15 min",
    scoreRange:{min:0,max:28,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter a verified total score. Use the official scoring instructions; item wording is not reproduced here.",
    interpretation:"Higher scores indicate better dynamic balance performance. Population-specific cutoffs should only be used from matching evidence.",
    reassessmentUse:"Useful when dynamic balance systems and fall-related performance are important.",licensing:"Use the official instrument/instructions; this site stores only metadata and the final score.",
    sources:["miniBestRMD","sralabRMD"]
  },
  {
    id:"frt",name:"Functional Reach Test",acronym:"FRT",domains:["balance"],populations:["stroke","parkinsons","older-adults","vestibular"],
    purpose:"Measures maximal forward reach while maintaining a fixed base of support.",measureType:"Performance-based",equipment:"Wall-mounted ruler or measuring tape",estimatedTime:"<5 min",
    scoreRange:{min:0,max:null,unit:"cm"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter reach distance using a consistent protocol and unit. This site does not apply a universal cutoff.",interpretation:"Greater reach generally reflects greater limits of stability, but interpretation is population and protocol dependent.",
    reassessmentUse:"Repeat with the same setup and protocol.",licensing:"Metadata only; verify the protocol source used in your setting.",sources:["sralabRMD"]
  },
  {
    id:"10mwt",name:"10 Meter Walk Test",acronym:"10MWT",domains:["gait","mobility"],populations:["stroke","parkinsons","ms","sci","brain-injury","neuromuscular"],
    purpose:"Assesses walking speed over a short duration.",measureType:"Performance-based",equipment:"Stopwatch and a clear measured walkway",estimatedTime:"≤5 min",
    scoreRange:{min:0,max:null,unit:"m/s"},scoreDirection:"higher",inputType:"gait-speed",
    scoringNotes:"Speed = timed distance ÷ time. Protocols vary; document whether speed is comfortable or fast and the exact timed distance. Assistive devices and assistance should be documented.",
    interpretation:"Higher gait speed indicates faster walking performance. Do not infer community ambulation class from speed unless a matching population-specific source is selected.",
    reassessmentUse:"Strong repeated measure when protocol, assistance and device are held consistent.",
    licensing:"Free measure; follow a standardized protocol.",
    changeEvidence:[
      {population:"stroke",phase:"acute",type:"MCID",value:0.16,unit:"m/s",label:"Acute stroke; approximately day 20 to day 60 in the cited cohort",source:"tenMWTRMD"}
    ],
    sources:["tenMWTRMD","anptEdge"]
  },
  {
    id:"6mwt",name:"6 Minute Walk Test",acronym:"6MWT",domains:["endurance","gait"],populations:["stroke","parkinsons","ms","sci","brain-injury"],
    purpose:"Measures distance walked over six minutes as a functional walking-endurance measure.",measureType:"Performance-based",equipment:"Measured walkway, timing device and protocol-specific safety equipment",estimatedTime:"~10 min including setup",
    scoreRange:{min:0,max:null,unit:"m"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter total distance. Use a standardized protocol and document device, assistance, rest and testing environment.",
    interpretation:"Greater distance indicates greater walking endurance under the administered conditions. Population-specific reference values are not universal.",
    reassessmentUse:"Repeat using the same protocol and environment when feasible.",licensing:"Use a recognized standardized protocol.",sources:["sixMWTRMD","sralabRMD"]
  },
  {
    id:"fga",name:"Functional Gait Assessment",acronym:"FGA",domains:["gait","balance","falls"],populations:["stroke","parkinsons","vestibular","older-adults"],
    purpose:"Assesses postural stability during challenging walking tasks.",measureType:"Performance-based",equipment:"Stopwatch, marked walkway and standardized obstacle/setup",estimatedTime:"~10 min",
    scoreRange:{min:0,max:30,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter the verified total. Item-level wording is not reproduced. The FGA contains 10 scored items with a maximum score of 30.",
    interpretation:"Higher scores indicate better performance. Cutoffs vary by population and should not be generalized.",
    reassessmentUse:"Useful for dynamic gait and balance reassessment.",licensing:"Use the authorized/official administration materials.",sources:["fgaRMD","sralabRMD"]
  },
  {
    id:"dgi",name:"Dynamic Gait Index",acronym:"DGI",domains:["gait","balance","falls"],populations:["stroke","parkinsons","vestibular","ms"],
    purpose:"Assesses the ability to modify gait in response to changing task demands.",measureType:"Performance-based",equipment:"Marked walkway and standardized obstacles",estimatedTime:"~10–15 min",
    scoreRange:{min:0,max:24,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter the verified total from the administered instrument.",interpretation:"Higher scores indicate better dynamic gait performance; population-specific cutoff evidence must be matched.",
    reassessmentUse:"Repeat with the same protocol.",licensing:"Metadata and final-score entry only.",sources:["sralabRMD"]
  },
  {
    id:"tug",name:"Timed Up and Go",acronym:"TUG",domains:["mobility","balance","gait"],populations:["stroke","parkinsons","ms","sci","brain-injury","vestibular"],
    purpose:"Times a functional sequence of standing, walking, turning and sitting.",measureType:"Performance-based",equipment:"Chair, marked 3 m path and stopwatch",estimatedTime:"<5 min",
    scoreRange:{min:0,max:null,unit:"s"},scoreDirection:"lower",inputType:"number",
    scoringNotes:"Enter time in seconds and document device/assistance. Negative or zero values are invalid.",
    interpretation:"Lower time indicates faster functional mobility. This site does not use a universal fall-risk cutoff.",
    reassessmentUse:"Useful for repeated functional mobility assessment.",licensing:"Common clinical measure; use a standardized administration protocol.",sources:["tugRMD","sralabRMD"]
  },
  {
    id:"5xsts",name:"Five Times Sit-to-Stand Test",acronym:"5xSTS",domains:["mobility","motor"],populations:["parkinsons","stroke","vestibular","older-adults"],
    purpose:"Quantifies repeated sit-to-stand transfer performance and functional lower-extremity strength.",measureType:"Performance-based",equipment:"Standard chair and stopwatch",estimatedTime:"<5 min",
    scoreRange:{min:0,max:null,unit:"s"},scoreDirection:"lower",inputType:"number",
    scoringNotes:"Enter completion time and document any protocol modifications. Inability to complete under the selected protocol should be recorded rather than assigned an invented time.",
    interpretation:"Lower time indicates faster transfer performance under the same protocol.",reassessmentUse:"Repeat using the same chair height and assistance rules.",
    licensing:"Free measure; follow the standardized protocol.",sources:["fiveStsRMD","sralabRMD"]
  },
  {
    id:"fac",name:"Functional Ambulation Category",acronym:"FAC",domains:["gait","mobility"],populations:["stroke","ms","brain-injury"],
    purpose:"Clinician-rated category of the physical support/supervision required for ambulation.",measureType:"Clinician-rated",equipment:"None beyond clinical walking assessment",estimatedTime:"~1 min",
    scoreRange:{min:0,max:5,unit:"level"},scoreDirection:"higher",inputType:"integer",
    scoringNotes:"Enter a verified category from 0 to 5 based on the administered FAC criteria.",interpretation:"Higher categories reflect greater walking independence.",
    reassessmentUse:"Useful to track broad change in ambulatory independence.",licensing:"Listed as free by the Rehabilitation Measures Database.",sources:["facRMD"]
  },
  {
    id:"fma",name:"Fugl-Meyer Assessment",acronym:"FMA",domains:["motor","sensory","balance"],populations:["stroke"],
    purpose:"Stroke-specific impairment measure covering motor performance and other impairment domains.",measureType:"Performance-based / clinician-rated",equipment:"Standardized assessment materials",estimatedTime:"Varies by section",
    scoreRange:{min:0,max:226,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter the verified total or use the motor section if that is what your service administers. Document which version/section is used; do not mix totals from different sections.",
    interpretation:"Higher scores indicate less impairment within the administered FMA scope.",reassessmentUse:"Useful for tracking post-stroke motor impairment when the same section is repeated.",
    licensing:"Use an authorized standardized form. This application does not reproduce the full items.",sources:["sralabRMD"]
  },
  {
    id:"nihss",name:"National Institutes of Health Stroke Scale",acronym:"NIHSS",domains:["motor","sensory","cognition"],populations:["stroke"],
    purpose:"Quantifies neurological deficit/severity after stroke; it is not primarily a PT functional outcome measure.",measureType:"Clinician-rated medical severity scale",equipment:"Standardized scale materials",estimatedTime:"~5–10 min",
    scoreRange:{min:0,max:42,unit:"points"},scoreDirection:"lower",inputType:"integer",
    scoringNotes:"Enter a verified score from appropriately trained administration. Do not use this application to reconstruct the full scale.",
    interpretation:"Lower scores represent less neurological deficit. Use alongside PT-specific functional measures rather than as a substitute for them.",
    reassessmentUse:"May contextualize neurological severity when available.",licensing:"Follow NIH/authorized training and administration requirements.",sources:["nihssRMD"]
  },
  {
    id:"mrs",name:"Modified Rankin Scale",acronym:"mRS",domains:["participation","mobility"],populations:["stroke"],
    purpose:"Global disability scale commonly used after stroke.",measureType:"Clinician-rated",equipment:"Interview/clinical information",estimatedTime:"Brief",
    scoreRange:{min:0,max:6,unit:"grade"},scoreDirection:"lower",inputType:"integer",
    scoringNotes:"Enter a verified grade. Use a standardized interview approach where applicable.",interpretation:"Lower grades represent less global disability; it is broad and should not replace domain-specific PT measures.",
    reassessmentUse:"Useful as a global disability context measure.",licensing:"Use standardized mRS guidance.",sources:["sralabRMD"]
  },
  {
    id:"edss",name:"Expanded Disability Status Scale",acronym:"EDSS",domains:["mobility","participation"],populations:["ms"],
    purpose:"Neurological disability scale widely used in multiple sclerosis.",measureType:"Clinician-rated medical disability scale",equipment:"Neurological examination and standardized scoring",estimatedTime:"Variable",
    scoreRange:{min:0,max:10,unit:"points",step:0.5},scoreDirection:"lower",inputType:"number",
    scoringNotes:"Enter a verified EDSS score. Full EDSS calculation is not implemented in v1.",interpretation:"Lower scores indicate less disability. Interpret within MS context and alongside PT-specific function measures.",
    reassessmentUse:"Can contextualize disease-related disability; PT change may require more responsive performance measures.",licensing:"Final verified score entry only.",sources:["sralabRMD"]
  },
  {
    id:"mds-updrs",name:"Movement Disorder Society–Unified Parkinson’s Disease Rating Scale",acronym:"MDS-UPDRS",domains:["motor","participation"],populations:["parkinsons"],
    purpose:"Comprehensive Parkinson’s disease rating scale covering motor and non-motor experiences and examination.",measureType:"Clinician-rated / patient-reported components",equipment:"Official instrument and trained administration",estimatedTime:"Variable",
    scoreRange:{min:0,max:null,unit:"points"},scoreDirection:"lower",inputType:"number",
    scoringNotes:"Enter a verified total or subscore from an authorized form and label the part used. Full copyrighted item text is not reproduced.",
    interpretation:"Higher scores generally reflect greater impact/severity within the scored part; do not compare unlabeled totals from different parts.",
    reassessmentUse:"Useful in Parkinson’s disease when administered consistently by appropriately trained users.",
    licensing:"Movement Disorder Society licensing/permission rules apply. This site does not distribute the scale.",sources:["mdsPermissions"]
  },
  {
    id:"sara",name:"Scale for the Assessment and Rating of Ataxia",acronym:"SARA",domains:["coordination","gait","balance"],populations:["ataxia","cerebellar"],
    purpose:"Semi-quantitative clinical assessment of cerebellar ataxia impairment.",measureType:"Performance-based / clinician-rated",equipment:"Stopwatch, 10 m walkway and examination table",estimatedTime:"~7–22 min",
    scoreRange:{min:0,max:40,unit:"points"},scoreDirection:"lower",inputType:"number",
    scoringNotes:"Enter the verified total from 0 to 40. Full item text is not reproduced.",interpretation:"Lower scores indicate less ataxia. A clear universal MCID is not established in the cited RMD summary.",
    reassessmentUse:"Useful to track ataxia severity when the same administration approach is used.",licensing:"Listed as free by the Rehabilitation Measures Database.",sources:["saraRMD"]
  },
  {
    id:"isncsci",name:"International Standards for Neurological Classification of Spinal Cord Injury",acronym:"ISNCSCI / ASIA Exam",domains:["motor","sensory"],populations:["sci"],
    purpose:"Standardized neurological classification of spinal cord injury.",measureType:"Standardized neurological examination",equipment:"Official worksheet and exam materials",estimatedTime:"Variable; training recommended",
    scoreRange:{min:0,max:null,unit:"classification"},scoreDirection:"context",inputType:"text",
    scoringNotes:"v1 accepts a final verified classification/summary only. Automated full ISNCSCI scoring is intentionally not implemented without formal algorithm validation.",
    interpretation:"Use the official ASIA/ISNCSCI standard. Classification should not be inferred from incomplete data.",
    reassessmentUse:"Repeat as clinically indicated using the official standard.",licensing:"Use official ASIA materials and current standards.",sources:["asiaIsncsci"]
  },
  {
    id:"scim",name:"Spinal Cord Independence Measure",acronym:"SCIM III",domains:["mobility","participation"],populations:["sci"],
    purpose:"Measures independence in daily function for people with spinal cord injury.",measureType:"Clinician-rated functional measure",equipment:"Clinical observation/interview and authorized form",estimatedTime:"~30–45 min depending setting",
    scoreRange:{min:0,max:100,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter a verified SCIM III total or clearly labeled subscore.",interpretation:"Higher scores indicate greater independence.",
    reassessmentUse:"Useful for tracking functional independence after SCI.",licensing:"Use the appropriate official/authorized form.",sources:["scimRMD"]
  },
  {
    id:"wisci2",name:"Walking Index for Spinal Cord Injury II",acronym:"WISCI II",domains:["gait","mobility"],populations:["sci"],
    purpose:"Ranks walking capacity after spinal cord injury based on devices, braces and physical assistance.",measureType:"Clinician-rated performance classification",equipment:"Walking setup and required devices/braces",estimatedTime:"Brief once walking ability is observed",
    scoreRange:{min:0,max:20,unit:"level"},scoreDirection:"higher",inputType:"integer",
    scoringNotes:"Enter a verified level. Use official descriptors for classification.",interpretation:"Higher levels represent greater walking independence/capacity.",reassessmentUse:"Useful with gait-speed/endurance measures in ambulatory SCI.",
    licensing:"Final-score entry only; consult official materials.",sources:["tenMWTRMD","sralabRMD"]
  },
  {
    id:"mas",name:"Modified Ashworth Scale",acronym:"MAS",domains:["tone"],populations:["stroke","sci","ms","brain-injury","cerebral-palsy"],
    purpose:"Clinician-rated resistance to passive movement commonly used to describe hypertonia/spasticity-related findings.",measureType:"Clinician-rated",equipment:"Examination surface",estimatedTime:"Brief",
    scoreRange:{min:0,max:4,unit:"grade"},scoreDirection:"lower",inputType:"text",
    scoringNotes:"Enter the verified grade and muscle group/side. Because the 1+ category is non-linear, this application stores the score as text rather than forcing arithmetic.",
    interpretation:"Use as one component of tone assessment; do not equate the score alone with functional impact.",reassessmentUse:"Repeat the same muscle group with standardized positioning/velocity.",
    licensing:"Use recognized administration guidance.",sources:["sralabRMD"]
  },
  {
    id:"abc",name:"Activities-specific Balance Confidence Scale",acronym:"ABC Scale",domains:["balance","participation"],populations:["parkinsons","vestibular","stroke","older-adults"],
    purpose:"Patient-reported balance confidence during everyday activities.",measureType:"Patient-reported",equipment:"Authorized questionnaire",estimatedTime:"~5–10 min",
    scoreRange:{min:0,max:100,unit:"%"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter the verified overall score. Item wording is not reproduced.",interpretation:"Higher scores indicate greater balance confidence; confidence is distinct from observed balance performance.",
    reassessmentUse:"Useful for participation/confidence change.",licensing:"Check instrument permissions before reproducing items.",sources:["sralabRMD"]
  },
  {
    id:"pass",name:"Postural Assessment Scale for Stroke Patients",acronym:"PASS",domains:["balance","mobility"],populations:["stroke"],
    purpose:"Assesses postural control in people after stroke, including maintaining and changing posture.",measureType:"Performance-based",equipment:"Clinical environment and standardized form",estimatedTime:"~10 min",
    scoreRange:{min:0,max:36,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter the verified total.",interpretation:"Higher scores reflect better postural control.",reassessmentUse:"Useful especially when lower-level postural control is important.",
    licensing:"Use authorized administration materials.",sources:["sralabRMD","fgaRMD"]
  },
  {
    id:"tis",name:"Trunk Impairment Scale",acronym:"TIS",domains:["motor","balance"],populations:["stroke","ms"],
    purpose:"Assesses static/dynamic sitting balance and trunk coordination.",measureType:"Performance-based",equipment:"Clinical seating/exam setup",estimatedTime:"~10 min",
    scoreRange:{min:0,max:23,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter a verified total and identify the version used.",interpretation:"Higher scores reflect better trunk control on the administered version.",
    reassessmentUse:"Useful when trunk impairment is a treatment priority.",licensing:"Verify version and use permissions.",sources:["sralabRMD"]
  },
  {
    id:"rmi",name:"Rivermead Mobility Index",acronym:"RMI",domains:["mobility"],populations:["stroke","brain-injury","ms"],
    purpose:"Assesses a hierarchy of functional mobility activities.",measureType:"Performance / report-based",equipment:"Standardized form",estimatedTime:"~5 min",
    scoreRange:{min:0,max:15,unit:"points"},scoreDirection:"higher",inputType:"integer",
    scoringNotes:"Enter the verified total.",interpretation:"Higher scores indicate greater mobility.",reassessmentUse:"Useful for broad mobility change.",
    licensing:"Use authorized form; metadata only here.",sources:["sralabRMD","fgaRMD"]
  },
  {
    id:"barthel",name:"Barthel Index",acronym:"BI",domains:["participation","mobility"],populations:["stroke","brain-injury","neurological"],
    purpose:"Measures independence in basic activities of daily living.",measureType:"Clinician-rated / interview",equipment:"Standardized form",estimatedTime:"~5–10 min",
    scoreRange:{min:0,max:100,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Multiple scoring conventions exist. Enter a verified total and document the version; this application assumes a 0–100 convention only when that version is selected.",
    interpretation:"Higher scores indicate greater ADL independence on the selected version.",reassessmentUse:"Useful as a broad independence outcome.",
    licensing:"Verify the scoring version and permissions used locally.",sources:["sralabRMD","fgaRMD"]
  },
  {
    id:"msws12",name:"12-item Multiple Sclerosis Walking Scale",acronym:"MSWS-12",domains:["gait","participation"],populations:["ms"],
    purpose:"Patient-reported impact of multiple sclerosis on walking.",measureType:"Patient-reported",equipment:"Authorized questionnaire",estimatedTime:"~5 min",
    scoreRange:{min:0,max:100,unit:"transformed score"},scoreDirection:"lower",inputType:"number",
    scoringNotes:"Enter the verified transformed score from the version used.",interpretation:"Higher transformed scores generally indicate greater walking impact; confirm the scoring convention of the authorized version.",
    reassessmentUse:"Useful to pair perceived walking impact with performance measures.",licensing:"Use authorized questionnaire and scoring instructions.",sources:["sralabRMD"]
  },
  {
    id:"2mwt",name:"2 Minute Walk Test",acronym:"2MWT",domains:["endurance","gait"],populations:["sci","ms","neuromuscular","frailty"],
    purpose:"Short walking-endurance measure when a 6-minute test is impractical.",measureType:"Performance-based",equipment:"Measured walkway and stopwatch",estimatedTime:"~5 min including setup",
    scoreRange:{min:0,max:null,unit:"m"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter distance and document protocol, device and assistance.",interpretation:"Greater distance reflects greater walking endurance under the same conditions.",
    reassessmentUse:"Repeat using the same setup.",licensing:"Use a standardized published protocol.",sources:["sralabRMD","tenMWTRMD"]
  },
  {
    id:"30sts",name:"30-Second Sit-to-Stand",acronym:"30sSTS",domains:["mobility","motor"],populations:["older-adults","neurological"],
    purpose:"Counts completed sit-to-stands during 30 seconds.",measureType:"Performance-based",equipment:"Standard chair and stopwatch",estimatedTime:"<5 min",
    scoreRange:{min:0,max:null,unit:"repetitions"},scoreDirection:"higher",inputType:"integer",
    scoringNotes:"Enter repetitions using a standardized protocol and record modifications.",interpretation:"More repetitions indicate greater repeated transfer capacity under the same protocol.",
    reassessmentUse:"Useful when the patient cannot reliably complete a fixed number of repetitions rapidly.",licensing:"Use standardized protocol.",sources:["fiveStsRMD"]
  },
  {
    id:"fsst",name:"Four Square Step Test",acronym:"FSST",domains:["balance","mobility","coordination"],populations:["vestibular","parkinsons","stroke"],
    purpose:"Assesses rapid multidirectional stepping and dynamic balance.",measureType:"Performance-based",equipment:"Four canes/tape setup and stopwatch",estimatedTime:"<5 min",
    scoreRange:{min:0,max:null,unit:"s"},scoreDirection:"lower",inputType:"number",
    scoringNotes:"Enter time using a standardized protocol; document inability or assistance instead of inventing a time.",interpretation:"Lower time indicates faster multidirectional stepping under the same conditions.",
    reassessmentUse:"Repeat with consistent setup.",licensing:"Use published administration guidance.",sources:["sralabRMD"]
  },
  {
    id:"himat",name:"High-level Mobility Assessment Tool",acronym:"HiMAT",domains:["mobility","gait"],populations:["brain-injury"],
    purpose:"Assesses high-level mobility limitations, particularly after traumatic brain injury.",measureType:"Performance-based",equipment:"Standardized mobility course",estimatedTime:"~10 min",
    scoreRange:{min:0,max:54,unit:"points"},scoreDirection:"higher",inputType:"number",
    scoringNotes:"Enter a verified total score from the official instrument.",interpretation:"Higher scores indicate higher-level mobility performance.",reassessmentUse:"Useful where basic mobility measures have ceiling effects.",
    licensing:"Use authorized form/instructions.",sources:["sralabRMD"]
  },
  {
    id:"freezing",name:"Freezing of Gait Questionnaire",acronym:"FOG-Q / NFOG-Q",domains:["gait","participation"],populations:["parkinsons"],
    purpose:"Patient-reported characterization of freezing-of-gait impact/frequency.",measureType:"Patient-reported",equipment:"Authorized questionnaire",estimatedTime:"Brief",
    scoreRange:{min:0,max:null,unit:"points"},scoreDirection:"lower",inputType:"number",
    scoringNotes:"Version-dependent. Enter a verified total and label the exact version; no cross-version arithmetic is performed.",
    interpretation:"Higher scores generally indicate more severe freezing impact on the administered version.",reassessmentUse:"Useful when freezing is a patient priority.",
    licensing:"Verify the specific version and permissions.",sources:["sralabRMD"]
  }
];

export const measureById = Object.fromEntries(measures.map(m => [m.id,m]));
