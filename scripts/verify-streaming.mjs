import assert from "node:assert";
import { SimulationEngine } from "../lib/simulation/engine.ts";

console.log("==================================================");
console.log("CONSIDERIQ — STREAMING PROTOCOL & ENGINE VERIFICATION");
console.log("==================================================");

// 1. PROTOCOL & CHUNK BUFFERING TEST
console.log("\n[Test 1] Verifying NDJSON protocol line buffering & chunk fragmentation...");
const mockEvents = [
  { type: "started", simulationId: "sim-test-01", totalTurns: 5 },
  {
    type: "turn_completed",
    simulationId: "sim-test-01",
    turnIndex: 1,
    stage: "QUESTION",
    turn: {
      turnIndex: 1,
      stage: "QUESTION",
      title: "Discovery",
      subtitle: "Turn 1",
      buyerPrompt: "Evaluate solutions",
      observedResponse: "ApexFlow APM and Datadog evaluated.",
      brands: [{ name: "ApexFlow APM", isYourBrand: true, status: "candidate" }],
      citations: [],
      insight: "Initial candidate set formed.",
      classification: "OBSERVED",
    },
  },
  {
    type: "completed",
    simulationId: "sim-test-01",
    metrics: { visibilityRate: 100, shortlistRate: 100, recommendationRate: 100, eliminationRate: 0, eliminatedAtTurn: null },
  },
];

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const rawText = mockEvents.map((e) => JSON.stringify(e) + "\n").join("");
const rawBytes = encoder.encode(rawText);

// Fragment stream into arbitrary chunk sizes
const chunkSizes = [11, 7, 23, 5, 50, 2];
const chunks = [];
let offset = 0;
let sizeIdx = 0;
while (offset < rawBytes.length) {
  const sz = chunkSizes[sizeIdx % chunkSizes.length];
  chunks.push(rawBytes.slice(offset, offset + sz));
  offset += sz;
  sizeIdx++;
}

let buffer = "";
const parsedEvents = [];
for (const chunk of chunks) {
  buffer += decoder.decode(chunk, { stream: true });
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed) parsedEvents.push(JSON.parse(trimmed));
  }
}
if (buffer.trim()) parsedEvents.push(JSON.parse(buffer.trim()));

assert.strictEqual(parsedEvents.length, 3, "All 3 events must be reconstructed from fragmented chunks");
assert.strictEqual(parsedEvents[0].type, "started");
assert.strictEqual(parsedEvents[1].type, "turn_completed");
assert.strictEqual(parsedEvents[2].type, "completed");
console.log("✓ Stream line-buffering correctly handles arbitrary chunk fragmentation.");

// 2. 5-TURN COHERENT STREAMING EXECUTION TEST
console.log("\n[Test 2] Verifying 5-turn sequential engine execution & conversation coherence...");

class MockCoherentAIProvider {
  id = "mock-gemini";
  name = "Mock Gemini Provider";
  defaultModel = "gemini-3.8-flash";
  callCount = 0;

  isConfigured() {
    return true;
  }

  async generateResponse() {
    throw new Error("Not implemented");
  }

  async generateConversationTurn(history) {
    this.callCount++;

    if (this.callCount === 1) {
      assert.strictEqual(history.length, 0, "Turn 1 must start with empty history");
      return {
        rawText: "",
        parsedJson: {
          observedResponse: "ApexFlow APM and Datadog evaluated.",
          brands: [
            { name: "ApexFlow APM", isYourBrand: true, status: "candidate" },
            { name: "Datadog", isYourBrand: false, status: "candidate" },
          ],
          citations: [],
          insight: "Discovery complete.",
        },
      };
    }

    if (this.callCount === 2) {
      assert.strictEqual(history.length, 2, "Turn 2 must receive prompt 1 & response 1");
      return {
        rawText: "",
        parsedJson: {
          observedResponse: "ApexFlow APM meets all compliance constraints.",
          brands: [
            { name: "ApexFlow APM", isYourBrand: true, status: "active" },
            { name: "Datadog", isYourBrand: false, status: "active" },
          ],
          citations: [],
          insight: "Constraints validated.",
        },
      };
    }

    if (this.callCount === 3) {
      assert.strictEqual(history.length, 4, "Turn 3 must receive 4 prior messages");
      return {
        rawText: "",
        parsedJson: {
          observedResponse: "Top 2 shortlist narrowed to ApexFlow APM and Datadog.",
          brands: [
            { name: "ApexFlow APM", isYourBrand: true, status: "active" },
            { name: "Datadog", isYourBrand: false, status: "active" },
          ],
          citations: [],
          insight: "Shortlist synthesized.",
        },
      };
    }

    if (this.callCount === 4) {
      assert.strictEqual(history.length, 6, "Turn 4 must receive 6 prior messages");
      return {
        rawText: "",
        parsedJson: {
          observedResponse: "Datadog eliminated on licensing; ApexFlow survives.",
          brands: [
            { name: "ApexFlow APM", isYourBrand: true, status: "active" },
            { name: "Datadog", isYourBrand: false, status: "eliminated" },
          ],
          citations: [],
          insight: "Elimination gate passed.",
        },
      };
    }

    if (this.callCount === 5) {
      assert.strictEqual(history.length, 8, "Turn 5 must receive 8 prior messages");
      return {
        rawText: "",
        parsedJson: {
          observedResponse: "Final recommendation is ApexFlow APM.",
          brands: [
            { name: "ApexFlow APM", isYourBrand: true, status: "recommended" },
            { name: "Datadog", isYourBrand: false, status: "eliminated" },
          ],
          citations: [],
          insight: "Recommendation finalized.",
        },
      };
    }

    throw new Error(`Unexpected call count: ${this.callCount}`);
  }
}

const provider = new MockCoherentAIProvider();
const engine = new SimulationEngine(provider);
const testProject = {
  id: "proj-unit-test",
  user_id: "user-unit-test",
  name: "ApexFlow APM",
  website: "https://apexflow.io",
  category: "Observability",
  competitors: ["Datadog"],
  target_persona: "DevOps Lead",
  constraints: ["SOC 2 Type II"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const streamedTurns = [];
const result = await engine.runSimulation(testProject, async (turn) => {
  streamedTurns.push(turn);
});

assert.strictEqual(provider.callCount, 5, "5 Gemini generation calls required");
assert.strictEqual(streamedTurns.length, 5, "5 streamed turns required");
for (let i = 0; i < 5; i++) {
  assert.strictEqual(streamedTurns[i].turnIndex, i + 1, `Turn ${i + 1} must arrive in order`);
}
assert.strictEqual(result.visibilityRate, 100);
assert.strictEqual(result.recommendationRate, 100);
console.log("✓ All 5 turns arrived sequentially with full conversation coherence.");

// 3. MID-RUN FAILURE CONTAINMENT TEST
console.log("\n[Test 3] Verifying mid-run failure containment and earlier turn preservation...");

class FailingProvider {
  id = "mock-fail";
  name = "Mock Fail Provider";
  defaultModel = "gemini-3.8-flash";
  count = 0;
  isConfigured() { return true; }
  async generateResponse() { throw new Error("Not implemented"); }
  async generateConversationTurn() {
    this.count++;
    if (this.count <= 2) {
      return {
        rawText: "",
        parsedJson: {
          observedResponse: `Turn ${this.count} success`,
          brands: [{ name: "ApexFlow APM", isYourBrand: true, status: "active" }],
          citations: [],
          insight: `Turn ${this.count} ok`,
        },
      };
    }
    throw new Error("Gemini quota rate limit exceeded");
  }
}

const failingEngine = new SimulationEngine(new FailingProvider());
const savedTurns = [];
let capturedError = null;

try {
  await failingEngine.runSimulation(testProject, async (turn) => {
    savedTurns.push(turn);
  });
} catch (err) {
  capturedError = err;
}

assert(capturedError !== null, "Engine must propagate error on turn failure");
assert.strictEqual(capturedError.turnIndex, 3, "Error must attach turnIndex 3");
assert.strictEqual(capturedError.stage, "SHORTLIST", "Error must attach stage SHORTLIST");
assert.strictEqual(savedTurns.length, 2, "Turns 1 & 2 must remain preserved in storage");
console.log("✓ Mid-run failure preserves earlier turns and enriches error with turnIndex & stage.");

console.log("\n==================================================");
console.log("ALL STREAMING TESTS PASSED (ISOLATED FROM BUILD)");
console.log("==================================================");
