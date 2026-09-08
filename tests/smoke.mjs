import { conditions } from "../js/data/conditions.js";
import { measures, measureById } from "../js/data/measures.js";
import { references } from "../js/data/references.js";
import { calculateGaitSpeed, validateMeasureValue } from "../js/scoring-engine.js";
import { interpretCase } from "../js/clinical-engine.js";

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const uniqueIds = list => new Set(list.map(item => item.id)).size === list.length;

check(conditions.length >= 60, "Expected broad condition library.");
check(measures.length >= 25, "Expected core outcome-measure library.");
check(uniqueIds(conditions), "Condition IDs must be unique.");
check(uniqueIds(measures), "Measure IDs must be unique.");

for (const condition of conditions) {
  for (const priority of ["essential", "recommended", "optional"]) {
    for (const id of condition.measures?.[priority] || []) {
      check(Boolean(measureById[id]), `Missing measure '${id}' referenced by ${condition.id}/${priority}.`);
    }
  }
}

for (const measure of measures) {
  for (const source of measure.sources || []) {
    check(Boolean(references[source]), `Missing reference '${source}' used by ${measure.id}.`);
  }
}

check(calculateGaitSpeed(6, 5) === 1.2, "10MWT gait-speed calculation failed.");
check(!validateMeasureValue(measureById.bbs, 99).valid, "BBS should reject values above 56.");
check(!validateMeasureValue(measureById.tug, -1).valid, "TUG should reject negative times.");
check(!validateMeasureValue(measureById.edss, 3.2).valid, "EDSS should reject unsupported 0.5-step values.");

const sampleStroke = {
  diagnosisId: "ischemic-stroke",
  phase: "acute",
  setting: "outpatient",
  assessment: { concerns: ["gait", "balance"] },
  selectedMeasures: ["10mwt", "bbs"],
  timepoints: [
    { date: "2026-09-01", label: "Initial", scores: [
      { measureId: "10mwt", value: 0.50, unit: "m/s" },
      { measureId: "bbs", value: 40, unit: "points" }
    ] },
    { date: "2026-09-08", label: "Follow-up", scores: [
      { measureId: "10mwt", value: 0.67, unit: "m/s" },
      { measureId: "bbs", value: 44, unit: "points" }
    ] }
  ],
  goals: []
};

const interpretation = interpretCase(sampleStroke);
const tenMWT = interpretation.changeStatements.find(item => item.title === "10MWT change")?.text || "";
const bbs = interpretation.changeStatements.find(item => item.title === "BBS change")?.text || "";
check(tenMWT.includes("meets or exceeds"), "Matched acute-stroke 10MWT change evidence was not surfaced.");
check(bbs.includes("not stored"), "BBS change was overinterpreted without exact stored context.");

if (failures.length) {
  console.error("Neuro PT smoke tests failed:\n" + failures.map(item => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: ${conditions.length} conditions, ${measures.length} measures, ${Object.keys(references).length} reference records.`);
console.log("PASS: mappings, score validation, gait-speed calculation, and conservative change interpretation.");
