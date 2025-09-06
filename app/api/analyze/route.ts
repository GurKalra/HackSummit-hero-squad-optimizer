import { type NextRequest, NextResponse } from "next/server";

// --- INTERFACES ---
interface Character {
  name: string;
  type: string; // "Mage", "Barbarian", "Rogue", "Bandit"
  strength: number;
  agility: number;
  health: number;
  mana?: number;
  dexterity?: number;
  wisdom?: number;
}
interface Enemy {
  name: string;
  health: number;
}
interface Encounter {
  event_type: string;
  enemy: Enemy;
}
interface AnalyzeRequest {
  party: Character[];
  encounter: Encounter;
  current_turn_character: string;
}

// --- API ROUTE HANDLER ---
export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.party || !body.encounter) {
      return NextResponse.json(
        { error: "Missing required fields: party, encounter" },
        { status: 400 }
      );
    }

    // ✨ Use the new, upgraded analysis method
    const analysis = analyzePartyVsEncounter(body.party, body.encounter);

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Error analyzing party:", error);
    return NextResponse.json(
      { error: "Failed to analyze party composition" },
      { status: 500 }
    );
  }
}

// --- ✨ UPDATED: HYBRID ANALYSIS CONTROLLER ---
function analyzePartyVsEncounter(party: Character[], encounter: Encounter) {
  // 1. Get the base probability from the Naive Bayes calculation
  const baseSuccessChance = runBayesianAnalysis(party, encounter);

  // 2. Apply advanced, ML-like modifiers for synergy and diminishing returns
  const finalSuccessChance = applyAdvancedModifiers(
    baseSuccessChance,
    party,
    encounter
  );

  // 3. Generate recommendations based on the final, nuanced probability
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

// ==================================================================
// --- ✨ NEW: ADVANCED MODIFIER SYSTEM (The "ML-like" Layer) ---
// ==================================================================

/**
 * Applies a series of advanced adjustments to the base probability.
 * This function acts as the brain, layering complexity onto the initial guess.
 */
function applyAdvancedModifiers(
  baseChance: number,
  party: Character[],
  encounter: Encounter
): number {
  let modifiedChance = baseChance;

  // Apply Synergy & Counter adjustments
  const synergyMultiplier = getSynergyMultiplier(party, encounter);
  modifiedChance *= synergyMultiplier;

  // Apply Diminishing Returns
  modifiedChance = applyDiminishingReturns(modifiedChance, party);

  // Clamp the final value between a reasonable floor and ceiling (e.g., 5% to 95%)
  return Math.round(Math.max(5, Math.min(95, modifiedChance)));
}

/**
 * Calculates a multiplier based on party composition synergies and counters.
 * This is where the model understands "teamwork".
 */
function getSynergyMultiplier(
  party: Character[],
  encounter: Encounter
): number {
  let multiplier = 1.0;
  const partyClasses = new Set(party.map((c) => c.type));

  // --- POSITIVE SYNERGIES ---
  // Classic Tank & Glass Cannon combo
  if (partyClasses.has("Barbarian") && partyClasses.has("Mage")) {
    multiplier += 0.1; // 10% boost for this classic combo
  }
  // Balanced Party: having a mix of damage, utility, and toughness
  if (
    partyClasses.has("Barbarian") &&
    partyClasses.has("Mage") &&
    partyClasses.has("Rogue")
  ) {
    multiplier += 0.15; // 15% bonus for a well-rounded trio
  }
  // Specialist Team for Traps
  if (
    encounter.event_type === "Ancient Trap" &&
    partyClasses.has("Rogue") &&
    partyClasses.has("Bandit")
  ) {
    multiplier += 0.2; // 20% bonus for a team of trap experts
  }

  // --- NEGATIVE SYNERGIES (COUNTERS) ---
  // All-magic party vs. a Dragon Fight (likely has magic resistance)
  if (
    encounter.event_type === "Dragon Fight" &&
    party.every((c) => c.type === "Mage")
  ) {
    multiplier -= 0.25; // 25% penalty for a bad matchup
  }
  // All-brawn party vs. a Mystic Puzzle
  if (
    encounter.event_type === "Mystic Puzzle" &&
    party.every((c) => c.type === "Barbarian" || c.type === "Bandit")
  ) {
    multiplier -= 0.3; // 30% penalty, a very difficult challenge for this team
  }

  return multiplier;
}

/**
 * Applies a penalty for "over-stacking" stats, simulating diminishing returns.
 * This introduces non-linearity, a key feature of advanced models.
 */
function applyDiminishingReturns(chance: number, party: Character[]): number {
  const STAT_THRESHOLD = 22;
  const PENALTY_PER_POINT = 0.005; // 0.5% penalty per point over the threshold

  let totalPenalty = 0;

  party.forEach((character) => {
    const stats: (keyof Character)[] = [
      "strength",
      "agility",
      "health",
      "mana",
      "dexterity",
      "wisdom",
    ];
    stats.forEach((stat) => {
      const value = character[stat] as number | undefined;
      if (value && value > STAT_THRESHOLD) {
        totalPenalty += (value - STAT_THRESHOLD) * PENALTY_PER_POINT;
      }
    });
  });

  // Apply the total penalty, but don't let it reduce the chance by more than, say, 30%
  return chance * (1 - Math.min(0.3, totalPenalty));
}

// ==================================================================
// --- ✨ NEW: CORE NAIVE BAYES CLASSIFIER LOGIC ---
// ==================================================================

function getSuccessPriors(eventType: string): {
  success: number;
  failure: number;
} {
  switch (eventType) {
    case "Dragon Fight":
      return { success: 0.4, failure: 0.6 };
    case "Ancient Trap":
      return { success: 0.55, failure: 0.45 };
    case "Mystic Puzzle":
      return { success: 0.7, failure: 0.3 };
    default:
      return { success: 0.5, failure: 0.5 };
  }
}

function getLikelihoods(eventType: string): Record<string, any> {
  const defaults = {
    strength: {
      success: { low: 0.2, med: 0.4, high: 0.4 },
      failure: { low: 0.4, med: 0.4, high: 0.2 },
    },
    agility: {
      success: { low: 0.2, med: 0.4, high: 0.4 },
      failure: { low: 0.4, med: 0.4, high: 0.2 },
    },
    health: {
      success: { low: 0.2, med: 0.4, high: 0.4 },
      failure: { low: 0.4, med: 0.4, high: 0.2 },
    },
    mana: {
      success: { low: 0.2, med: 0.4, high: 0.4 },
      failure: { low: 0.4, med: 0.4, high: 0.2 },
    },
    dexterity: {
      success: { low: 0.2, med: 0.4, high: 0.4 },
      failure: { low: 0.4, med: 0.4, high: 0.2 },
    },
    wisdom: {
      success: { low: 0.2, med: 0.4, high: 0.4 },
      failure: { low: 0.4, med: 0.4, high: 0.2 },
    },
  };

  switch (eventType) {
    case "Dragon Fight":
      return {
        ...defaults,
        strength: {
          success: { low: 0.1, med: 0.3, high: 0.6 },
          failure: { low: 0.6, med: 0.3, high: 0.1 },
        },
        health: {
          success: { low: 0.15, med: 0.35, high: 0.5 },
          failure: { low: 0.5, med: 0.35, high: 0.15 },
        },
        agility: {
          success: { low: 0.2, med: 0.5, high: 0.3 },
          failure: { low: 0.3, med: 0.5, high: 0.2 },
        },
      };
    case "Ancient Trap":
      return {
        ...defaults,
        dexterity: {
          success: { low: 0.1, med: 0.3, high: 0.6 },
          failure: { low: 0.6, med: 0.3, high: 0.1 },
        },
        agility: {
          success: { low: 0.15, med: 0.35, high: 0.5 },
          failure: { low: 0.5, med: 0.35, high: 0.15 },
        },
        wisdom: {
          success: { low: 0.2, med: 0.5, high: 0.3 },
          failure: { low: 0.3, med: 0.5, high: 0.2 },
        },
      };
    case "Mystic Puzzle":
      return {
        ...defaults,
        wisdom: {
          success: { low: 0.05, med: 0.25, high: 0.7 },
          failure: { low: 0.7, med: 0.25, high: 0.05 },
        },
        mana: {
          success: { low: 0.1, med: 0.4, high: 0.5 },
          failure: { low: 0.5, med: 0.4, high: 0.1 },
        },
      };
    default:
      return defaults;
  }
}

function getStatCategory(value: number): "low" | "med" | "high" {
  if (value < 10) return "low";
  if (value < 20) return "med";
  return "high";
}

function runBayesianAnalysis(party: Character[], encounter: Encounter): number {
  const basePriors = getSuccessPriors(encounter.event_type);
  const likelihoods = getLikelihoods(encounter.event_type);

  // Party Size Scaling: Adjust priors based on party size.
  const partySizeMultiplier = 0.8 + 0.1 * party.length; // 1=.9, 2=1, 3=1.1, 4=1.2
  const priors = {
    success: basePriors.success * partySizeMultiplier,
    failure: basePriors.failure / partySizeMultiplier,
  };

  // Use log probabilities to avoid underflow
  let logProbSuccess = Math.log(priors.success);
  let logProbFailure = Math.log(priors.failure);

  party.forEach((character) => {
    Object.keys(character).forEach((statKey) => {
      const statValue = (character as any)[statKey];
      if (typeof statValue === "number" && likelihoods[statKey]) {
        const category = getStatCategory(statValue);
        // Add a small value (Laplace smoothing) to prevent log(0)
        logProbSuccess += Math.log(
          likelihoods[statKey].success[category] + 0.01
        );
        logProbFailure += Math.log(
          likelihoods[statKey].failure[category] + 0.01
        );
      }
    });
  });

  const probSuccess = Math.exp(logProbSuccess);
  const probFailure = Math.exp(logProbFailure);
  const totalProb = probSuccess + probFailure;

  if (totalProb === 0) return 50;

  return (probSuccess / totalProb) * 100;
}

// ==================================================================
// --- GRANULAR WEIGHTING & RECOMMENDATION HELPERS (Unchanged) ---
// ==================================================================

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
      character.strength * weights.strength +
      character.agility * weights.agility +
      character.health * weights.health +
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
      // FIX: Correctly pass encounter.event_type
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
  // FIX: Corrected the typing for the 'stat' parameter to match the local Character interface.
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
