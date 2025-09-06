// src/app/api/analyze/route.ts

import { type NextRequest, NextResponse } from "next/server";

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

// --- CONTEXTUAL MONTE CARLO SIMULATION ---

/**
 * Runs a single, randomized trial of an encounter based on its type.
 * @returns {boolean} - True if the party won, false otherwise.
 */
function simulateSingleEncounter(
  party: Character[],
  encounter: Encounter
): boolean {
  switch (encounter.event_type) {
    case "Mystic Puzzle": {
      const totalWisdom = party.reduce(
        (sum, char) => sum + (char.wisdom || 0),
        0
      );
      const totalMana = party.reduce((sum, char) => sum + (char.mana || 0), 0);
      const avgIntellect = (totalWisdom + totalMana) / (party.length * 2);
      const successChance = Math.min(0.95, avgIntellect / 25);
      return Math.random() < successChance;
    }

    case "Ancient Trap": {
      const totalDexterity = party.reduce(
        (sum, char) => sum + (char.dexterity || 0),
        0
      );
      const totalAgility = party.reduce(
        (sum, char) => sum + (char.agility || 0),
        0
      );
      const avgFinesse = (totalDexterity + totalAgility) / (party.length * 2);
      // Rebalanced divisor from 30 to 28 for better results
      const successChance = Math.min(0.95, avgFinesse / 28);
      return Math.random() < successChance;
    }

    case "Dragon Fight":
    default: {
      let enemyHealth = encounter.enemy.health;
      let partyHealth = party.map((p) => p.health);
      const weights = getStatWeights(encounter.event_type);

      for (let round = 0; round < 50; round++) {
        party.forEach((character, index) => {
          if (partyHealth[index] <= 0) return;

          const effectiveness =
            (character.strength * weights.strength +
              character.agility * weights.agility +
              (character.dexterity || 0) * weights.dexterity +
              (character.mana || 0) * weights.mana +
              (character.wisdom || 0) * weights.wisdom) /
            (weights.strength +
              weights.agility +
              weights.dexterity +
              weights.mana +
              weights.wisdom);

          const successChance = Math.min(0.95, 0.2 + effectiveness / 25);
          if (Math.random() < successChance) {
            const damage = Math.floor(5 + Math.random() * (effectiveness / 2));
            enemyHealth -= damage;
            if (enemyHealth <= 0) return;
          }
        });

        if (enemyHealth <= 0) return true;

        const activePartyMembers = partyHealth
          .map((h, i) => (h > 0 ? i : -1))
          .filter((i) => i !== -1);
        if (activePartyMembers.length === 0) return false;

        const targetIndex =
          activePartyMembers[
            Math.floor(Math.random() * activePartyMembers.length)
          ];
        const enemyDamage = Math.floor(
          5 + (encounter.enemy.health / 20) * Math.random()
        );
        partyHealth[targetIndex] -= enemyDamage;

        if (partyHealth.every((h) => h <= 0)) return false;
      }
      return enemyHealth <= 0;
    }
  }
}

function runMonteCarloSimulation(
  party: Character[],
  encounter: Encounter
): number {
  const NUM_TRIALS = 1000;
  let wins = 0;
  for (let i = 0; i < NUM_TRIALS; i++) {
    if (simulateSingleEncounter(party, encounter)) {
      wins++;
    }
  }
  return Math.round((wins / NUM_TRIALS) * 100);
}

// --- HYBRID ANALYSIS CONTROLLER ---
function analyzePartyVsEncounter(party: Character[], encounter: Encounter) {
  const partySuccessChance = runMonteCarloSimulation(party, encounter);
  const weightedAnalysis = getWeightedAnalysis(
    party,
    encounter,
    partySuccessChance
  );

  return {
    party_success_chance: partySuccessChance,
    individual_success_rates: weightedAnalysis.individual_success_rates,
    encounter_difficulty: getEncounterDifficulty(encounter.event_type),
    strategic_recommendations: weightedAnalysis.strategic_recommendations,
  };
}

// --- GRANULAR WEIGHTING ALGORITHM & HELPERS ---

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
