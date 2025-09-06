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
interface AnalyzeResponse {
  success: boolean;
  analysis: any;
}

// --- API ROUTE HANDLER ---
export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.party || !body.encounter || !body.current_turn_character) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: party, encounter, current_turn_character",
        },
        { status: 400 }
      );
    }

    const analysis = analyzePartyVsEncounter(
      body.party,
      body.encounter,
      body.current_turn_character
    );

    const response: AnalyzeResponse = { success: true, analysis };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error analyzing party:", error);
    return NextResponse.json(
      { error: "Failed to analyze party composition" },
      { status: 500 }
    );
  }
}

// --- RE-TUNED GRANULAR WEIGHTING ALGORITHM ---

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

function analyzePartyVsEncounter(
  party: Character[],
  encounter: Encounter,
  currentCharacter: string
) {
  const weights = getStatWeights(encounter.event_type);
  const totalWeight = Object.values(weights).reduce(
    (sum, weight) => sum + weight,
    0
  );

  const totalWeightedPower = party.reduce((partySum, char) => {
    const charPower =
      char.strength * weights.strength +
      char.agility * weights.agility +
      char.health * weights.health +
      (char.mana || 0) * weights.mana +
      (char.dexterity || 0) * weights.dexterity +
      (char.wisdom || 0) * weights.wisdom;
    return partySum + charPower;
  }, 0);

  const partySize = party.length;
  // --- FIX #1 --- Changed the normalization from 40 to 20 to be less punishing.
  const baseSuccessRate = Math.min(
    95,
    Math.max(15, (totalWeightedPower / (partySize * totalWeight * 20)) * 100)
  );

  const difficultyMultiplier = getDifficultyMultiplier(encounter.event_type);
  const partySuccessChance = Math.round(baseSuccessRate * difficultyMultiplier);

  const individualRates = party.map((character) => {
    const charTotalWeighted =
      character.strength * weights.strength +
      character.agility * weights.agility +
      character.health * weights.health +
      (character.mana || 0) * weights.mana +
      (character.dexterity || 0) * weights.dexterity +
      (character.wisdom || 0) * weights.wisdom;

    // --- FIX #2 --- Changed the normalization from 25 to 15 for a more rewarding individual score.
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
    party_success_chance: partySuccessChance,
    individual_success_rates: individualRates,
    encounter_difficulty: getEncounterDifficulty(encounter.event_type),
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
      "This will be a tough encounter. Focus on defensive maneuvers and support."
    );
  } else if (successChance > 75) {
    recs.push(
      "Your party is well-suited for this challenge. Press the advantage with aggressive tactics."
    );
  } else {
    recs.push(
      "A balanced approach is best. Coordinate your strengths to overcome the challenge."
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
