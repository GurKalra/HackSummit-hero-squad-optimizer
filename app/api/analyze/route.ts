import { type NextRequest, NextResponse } from "next/server";
import * as tf from "@tensorflow/tfjs";
import * as fs from "fs";
import * as path from "path";

// --- INTERFACES ---
interface Character {
  name: string;
  type: string;
  strength: number;
  agility: number;
  health: number;
  mana?: number;
  dexterity?: number;
  wisdom?: number;
}
interface Encounter {
  event_type: string;
}

// ✅ FINAL CORRECTED VERSION of the load handler
function fileSystemLoadHandler(): tf.io.ModelArtifacts {
  const modelPath = path.join(process.cwd(), "models", "party-optimizer-model");

  const modelJson = JSON.parse(
    fs.readFileSync(path.join(modelPath, "model.json"), "utf-8")
  );

  const modelTopology = modelJson.modelTopology;
  const weightSpecs = modelJson.weightsManifest[0].weights;

  // Read the weights file into a Node.js Buffer
  const weightsBuffer = fs.readFileSync(path.join(modelPath, "weights.bin"));

  // ⛔️ OLD WAY (Can cause a type error)
  // const weightData = weightsBuffer.buffer.slice(
  //   weightsBuffer.byteOffset,
  //   weightsBuffer.byteOffset + weightsBuffer.byteLength
  // );

  // ✅ NEW WAY: Convert Buffer to a guaranteed standard ArrayBuffer
  // This creates a Uint8Array view of the buffer, and its .buffer property is a standard ArrayBuffer.
  const weightData = new Uint8Array(weightsBuffer).buffer;

  // Return all three required properties
  return { modelTopology, weightSpecs, weightData };
}
// --- LOAD THE TRAINED MODEL ---
let model: tf.LayersModel;
(async () => {
  try {
    // This now correctly passes the IOHandler object to loadLayersModel
    model = await tf.loadLayersModel({
      load: () => Promise.resolve(fileSystemLoadHandler()),
    });
    console.log("✅ Party Optimizer model loaded successfully!");
  } catch (error) {
    console.error("❌ Error loading model:", error);
  }
})();

// --- DATA PREPARATION ---
function prepareDataForModel(
  party: Character[],
  encounter: Encounter
): number[] {
  const totalStrength = party.reduce(
    (sum, char) => sum + (char.strength || 0),
    0
  );
  const totalHealth = party.reduce((sum, char) => sum + (char.health || 0), 0);
  const totalAgility = party.reduce(
    (sum, char) => sum + (char.agility || 0),
    0
  );
  const totalMana = party.reduce((sum, char) => sum + (char.mana || 0), 0);
  const totalDexterity = party.reduce(
    (sum, char) => sum + (char.dexterity || 0),
    0
  );
  const totalWisdom = party.reduce((sum, char) => sum + (char.wisdom || 0), 0);

  const numMages = party.filter((c) => c.type === "Mage").length;
  const numBarbarians = party.filter((c) => c.type === "Barbarian").length;
  const numRogues = party.filter((c) => c.type === "Rogue").length;
  const numBandits = party.filter((c) => c.type === "Bandit").length;

  const isDragonFight = encounter.event_type === "Dragon Fight" ? 1 : 0;
  const isAncientTrap = encounter.event_type === "Ancient Trap" ? 1 : 0;
  const isMysticPuzzle = encounter.event_type === "Mystic Puzzle" ? 1 : 0;

  return [
    party.length,
    totalStrength,
    totalHealth,
    totalAgility,
    totalMana,
    totalDexterity,
    totalWisdom,
    numMages,
    numBarbarians,
    numRogues,
    numBandits,
    isDragonFight,
    isAncientTrap,
    isMysticPuzzle,
  ];
}

async function getTFJSAnalysis(
  party: Character[],
  encounter: Encounter
): Promise<number> {
  if (!model) {
    console.error("Model not loaded. Returning a default value.");
    return 50;
  }
  const inputVector = prepareDataForModel(party, encounter);
  const inputTensor = tf.tensor2d([inputVector]);
  const prediction = model.predict(inputTensor) as tf.Tensor;
  const successChanceArray = await prediction.data();
  inputTensor.dispose();
  prediction.dispose();
  return Math.round(successChanceArray[0] * 100);
}

async function analyzePartyVsEncounter(
  party: Character[],
  encounter: Encounter
) {
  const finalSuccessChance = await getTFJSAnalysis(party, encounter);
  const weightedAnalysis = getWeightedAnalysis(
    party,
    encounter,
    finalSuccessChance
  );
  return {
    party_success_chance: finalSuccessChance,
    individual_success_rates: weightedAnalysis.individual_success_rates,
    encounter_difficulty: getEncounterDifficulty(encounter.event_type),
    strategic_recommendations: weightedAnalysis.strategic_recommendations,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.party || !body.encounter) {
      return NextResponse.json(
        { error: "Missing required fields: party, encounter" },
        { status: 400 }
      );
    }
    const analysis = await analyzePartyVsEncounter(body.party, body.encounter);
    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Error analyzing party:", error);
    return NextResponse.json(
      { error: "Failed to analyze party composition" },
      { status: 500 }
    );
  }
}

// --- RECOMMENDATION HELPERS (These remain unchanged) ---
interface StatWeights {
  strength: number;
  agility: number;
  health: number;
  mana: number;
  dexterity: number;
  wisdom: number;
}
function getStatWeights(eventType: string): StatWeights {
  switch (eventType) {
    case "Dragon Fight":
      return {
        strength: 1.3,
        health: 1.2,
        agility: 1.1,
        mana: 1.1,
        dexterity: 1.0,
        wisdom: 0.9,
      };
    case "Ancient Trap":
      return {
        dexterity: 1.4,
        agility: 1.3,
        wisdom: 1.2,
        health: 1.0,
        mana: 0.9,
        strength: 0.8,
      };
    case "Mystic Puzzle":
      return {
        wisdom: 1.5,
        mana: 1.3,
        dexterity: 1.0,
        agility: 0.9,
        health: 0.8,
        strength: 0.7,
      };
    default:
      return {
        strength: 1.0,
        agility: 1.0,
        health: 1.0,
        mana: 1.0,
        dexterity: 1.0,
        wisdom: 1.0,
      };
  }
}
function getWeightedAnalysis(
  party: Character[],
  encounter: Encounter,
  partySuccessChance: number
) {
  const weights = getStatWeights(encounter.event_type);
  const totalWeight = Object.values(weights).reduce(
    (sum, weight) => sum + weight,
    0
  );
  const difficultyMultiplier = getDifficultyMultiplier(encounter.event_type);
  const individualRates = party.map((character) => {
    const charTotalWeighted =
      (character.strength || 0) * weights.strength +
      (character.agility || 0) * weights.agility +
      (character.health || 0) * weights.health +
      (character.mana || 0) * weights.mana +
      (character.dexterity || 0) * weights.dexterity +
      (character.wisdom || 0) * weights.wisdom;
    const charBaseRate = charTotalWeighted / (totalWeight * 15);
    const charSuccessRate = Math.min(
      95,
      Math.max(15, 20 + charBaseRate * 75 * difficultyMultiplier)
    );
    return {
      character: character.name,
      success_rate: Math.round(charSuccessRate),
      recommended_action: getRecommendedAction(character, encounter.event_type),
    };
  });
  const recommendations = generateRecommendations(
    party,
    encounter,
    partySuccessChance
  );
  return {
    individual_success_rates: individualRates,
    strategic_recommendations: recommendations,
  };
}
function getDifficultyMultiplier(eventType: string): number {
  switch (eventType) {
    case "Dragon Fight":
      return 0.85;
    case "Ancient Trap":
      return 0.9;
    case "Mystic Puzzle":
      return 1.0;
    default:
      return 0.95;
  }
}
function getEncounterDifficulty(eventType: string): string {
  switch (eventType) {
    case "Dragon Fight":
      return "Hard";
    case "Ancient Trap":
      return "Medium";
    case "Mystic Puzzle":
      return "Easy";
    default:
      return "Unknown";
  }
}
function getRecommendedAction(character: Character, eventType: string): string {
  const stats = {
    str: character.strength,
    agi: character.agility,
    dex: character.dexterity || 0,
    wis: character.wisdom || 0,
    mana: character.mana || 0,
  };
  switch (eventType) {
    case "Dragon Fight":
      if (stats.str > 15) return "Power Attack";
      if (stats.mana > 15) return "Cast Fireball";
      if (stats.agi > 15) return "Dodge and Weave";
      return "Defensive Stance";
    case "Ancient Trap":
      if (stats.dex > 15) return "Disarm Trap";
      if (stats.wis > 15) return "Analyze Mechanism";
      if (stats.agi > 15) return "Evade Pressure Plate";
      return "Provide Lookout";
    case "Mystic Puzzle":
      if (stats.wis > 15) return "Decipher Runes";
      if (stats.mana > 15) return "Channel Insight";
      if (stats.dex > 10) return "Manipulate Artifact";
      return "Observe Patterns";
    default:
      return "Take Action";
  }
}
function generateRecommendations(
  party: Character[],
  encounter: Encounter,
  successChance: number
): string[] {
  const recs: string[] = [];
  const findBest = (stat: keyof Omit<Character, "name" | "type">) =>
    party.reduce((best, char) =>
      (char[stat] || 0) > (best[stat] || 0) ? char : best
    );
  if (successChance < 40) {
    recs.push(
      "This is a highly challenging encounter. Survival should be the top priority; focus on defensive abilities and healing."
    );
  } else if (successChance > 75) {
    recs.push(
      "Your party has a clear advantage. A coordinated, aggressive strategy should secure a swift victory."
    );
  } else {
    recs.push(
      "The odds are balanced. A smart, tactical approach combining offense and defense is crucial for success."
    );
  }
  switch (encounter.event_type) {
    case "Dragon Fight":
      const tank = findBest("health");
      recs.push(
        `Let ${tank.name} draw the dragon's attention while others attack from the flanks.`
      );
      const strongest = findBest("strength");
      recs.push(
        `${strongest.name} should focus on dealing maximum physical damage.`
      );
      break;
    case "Ancient Trap":
      const nimble = findBest("dexterity");
      recs.push(
        `${nimble.name} should take the lead to scout for and disarm any traps.`
      );
      const wiseTrap = findBest("wisdom");
      if (wiseTrap.name !== nimble.name) {
        recs.push(
          `${wiseTrap.name} can assist by spotting the trap mechanisms from a distance.`
        );
      }
      break;
    case "Mystic Puzzle":
      const wise = findBest("wisdom");
      recs.push(
        `The party should rely on ${wise.name}'s wisdom to solve the core puzzle.`
      );
      const mage = findBest("mana");
      if (mage.name !== wise.name) {
        recs.push(
          `${mage.name} could use their mana to reveal hidden clues or magical auras.`
        );
      }
      break;
  }
  return recs;
}
