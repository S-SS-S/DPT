export const references = {
  sralabRMD: {
    title: "Shirley Ryan AbilityLab Rehabilitation Measures Database",
    url: "https://www.sralab.org/rehabilitation-measures",
    type: "Rehabilitation measure database"
  },
  bbsRMD: {
    title: "Berg Balance Scale — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/berg-balance-scale",
    type: "Measure summary"
  },
  tenMWTRMD: {
    title: "10 Meter Walk Test — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/10-meter-walk-test",
    type: "Measure summary"
  },
  sixMWTRMD: {
    title: "6 Minute Walk Test — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/6-minute-walk-test",
    type: "Measure summary"
  },
  tugRMD: {
    title: "Timed Up and Go — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/timed-and-go",
    type: "Measure summary"
  },
  fgaRMD: {
    title: "Functional Gait Assessment — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/functional-gait-assessment",
    type: "Measure summary"
  },
  miniBestRMD: {
    title: "Mini-BESTest — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/mini-balance-evaluation-systems-test",
    type: "Measure summary"
  },
  fiveStsRMD: {
    title: "Five Times Sit to Stand Test — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/five-times-sit-stand-test",
    type: "Measure summary"
  },
  facRMD: {
    title: "Functional Ambulation Category — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/functional-ambulation-category",
    type: "Measure summary"
  },
  saraRMD: {
    title: "Scale for Assessment and Rating of Ataxia — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/scale-assessment-and-rating-ataxia",
    type: "Measure summary"
  },
  scimRMD: {
    title: "Spinal Cord Independence Measure — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/spinal-cord-independence-measure",
    type: "Measure summary"
  },
  mdsPermissions: {
    title: "Movement Disorder Society — Rating Scale Pricing and Permissions",
    url: "https://www.movementdisorders.org/MDS/MDS-Clinical-Outcome-Assessment/Rating-Scales-Pricing.htm",
    type: "Official licensing / permissions"
  },
  asiaIsncsci: {
    title: "American Spinal Injury Association — ISNCSCI resources",
    url: "https://asia-spinalinjury.org/isncsci-resources/",
    type: "Official current standards / permissions resource"
  },
  passRMD: {
    title: "Postural Assessment Scale for Stroke — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/postural-assessment-scale-stroke",
    type: "Measure summary"
  },
  rmiRMD: {
    title: "Rivermead Mobility Index — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/rivermead-mobility-index",
    type: "Measure summary"
  },
  barthelRMD: {
    title: "Barthel Index — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/barthel-index",
    type: "Measure summary / permissions context"
  },
  wisciRMD: {
    title: "Walking Index for Spinal Cord Injury — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/walking-index-spinal-cord-injury",
    type: "Measure summary"
  },
  nihssRMD: {
    title: "NIH Stroke Scale — RehabMeasures Database",
    url: "https://www.sralab.org/rehabilitation-measures/national-institutes-health-stroke-scale",
    type: "Measure summary"
  },
  anptEdge: {
    title: "Academy of Neurologic Physical Therapy — Outcome Measures Recommendations",
    url: "https://www.neuropt.org/practice-resources/anpt-clinical-practice-guidelines/core-outcome-measures-cpg",
    type: "Professional association resource"
  },
  whoICF: {
    title: "World Health Organization — International Classification of Functioning, Disability and Health",
    url: "https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health",
    type: "Framework"
  }
};

export function resolveReferences(ids = []) {
  return ids.map(id => references[id]).filter(Boolean);
}
