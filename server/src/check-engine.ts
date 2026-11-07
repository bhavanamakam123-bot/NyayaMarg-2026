import assert from "node:assert/strict";
import { analyzeScenario } from "./services/engine.js";

const cases: Array<[string, string]> = [
  ["My online shopping company took my money but never delivered my product.", "consumer"],
  ["Someone transferred money from my bank account without permission.", "cyber"],
  ["My employer has not paid my salary.", "labour"],
  ["I received a cheque, but it bounced.", "cheque"],
  ["My landlord refuses to return my security deposit.", "tenancy"],
  ["Cheque bounce", "cheque"],
  ["Online cyber fraud", "cyber"],
  ["Consumer rights for defective goods", "consumer"],
];

for (const [text, expected] of cases) {
  const result = analyzeScenario({ text });
  assert.equal(result.categoryId, expected, `${text} -> ${result.categoryId}`);
  if (["consumer", "cyber", "cheque"].includes(expected)) assert.ok(result.provisions.length > 0, text);
  assert.ok(result.confidence.explanation.some((line) => /not the probability/i.test(line)));
}

const vague = analyzeScenario({ text: "Help me please with my problem soon" });
assert.equal(vague.uncertain, true);
assert.equal(vague.provisions.length, 0);
console.log("engine checks passed");
