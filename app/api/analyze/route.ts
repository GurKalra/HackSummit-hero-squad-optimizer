import { type NextRequest, NextResponse } from "next/server"

interface Character {
  name: string
  type: string
  strength: number
  agility: number
  health: number
  mana?: number
  dexterity?: number
  wisdom?: number
}

interface Enemy {
  name: string
  health: number
}

interface Encounter {
  event_type: string
  enemy: Enemy
}

interface AnalyzeRequest {
  party: Character[]
  encounter: Encounter
  current_turn_character: string
}

interface AnalyzeResponse {
  success: boolean
  analysis: {
    party_success_chance: number
    individual_success_rates: Array<{
      character: string
      success_rate: number
      recommended_action: string
    }>
    encounter_difficulty: string
    strategic_recommendations: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()

    // Validate request structure
    if (!body.party || !body.encounter || !body.current_turn_character) {
      return NextResponse.json(
        { error: "Missing required fields: party, encounter, current_turn_character" },
        { status: 400 },
      )
    }

    // Simulate AI analysis based on party composition and encounter
    const analysis = analyzePartyVsEncounter(body.party, body.encounter, body.current_turn_character)

    const response: AnalyzeResponse = {
      success: true,
      analysis,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error analyzing party:", error)
    return NextResponse.json({ error: "Failed to analyze party composition" }, { status: 500 })
  }
}

function analyzePartyVsEncounter(party: Character[], encounter: Encounter, currentCharacter: string) {
  // Calculate party stats
  const totalStrength = party.reduce((sum, char) => sum + char.strength, 0)
  const totalAgility = party.reduce((sum, char) => sum + char.agility, 0)
  const totalHealth = party.reduce((sum, char) => sum + char.health, 0)
  const totalMana = party.reduce((sum, char) => sum + (char.mana || 0), 0)
  const partySize = party.length

  // Base success calculation
  const baseSuccessRate = Math.min(
    95,
    Math.max(15, ((totalStrength + totalAgility + totalHealth + totalMana) / (partySize * 4)) * 1.2),
  )

  // Adjust based on encounter difficulty
  const difficultyMultiplier = getDifficultyMultiplier(encounter.event_type)
  const partySuccessChance = Math.round(baseSuccessRate * difficultyMultiplier)

  // Calculate individual success rates
  const individualRates = party.map((character) => {
    const charTotal = character.strength + character.agility + character.health + (character.mana || 0)
    const charSuccessRate = Math.min(90, Math.max(10, (charTotal / 4) * difficultyMultiplier))

    return {
      character: character.name,
      success_rate: Math.round(charSuccessRate),
      recommended_action: getRecommendedAction(character, encounter.event_type),
    }
  })

  // Generate strategic recommendations
  const recommendations = generateRecommendations(party, encounter, partySuccessChance)

  return {
    party_success_chance: partySuccessChance,
    individual_success_rates: individualRates,
    encounter_difficulty: getEncounterDifficulty(encounter.event_type),
    strategic_recommendations: recommendations,
  }
}

function getDifficultyMultiplier(eventType: string): number {
  switch (eventType) {
    case "Dragon Fight":
      return 0.6 // Hard encounter
    case "Ancient Trap":
      return 0.8 // Medium encounter
    case "Mystic Puzzle":
      return 1.0 // Easy encounter
    default:
      return 0.8
  }
}

function getEncounterDifficulty(eventType: string): string {
  switch (eventType) {
    case "Dragon Fight":
      return "Extremely Dangerous"
    case "Ancient Trap":
      return "Moderately Challenging"
    case "Mystic Puzzle":
      return "Intellectually Demanding"
    default:
      return "Unknown"
  }
}

function getRecommendedAction(character: Character, eventType: string): string {
  const { type, strength, agility, mana = 0, wisdom = 0 } = character

  switch (eventType) {
    case "Dragon Fight":
      if (type === "Mage" && mana > 50) return "Cast Fireball"
      if (type === "Barbarian" && strength > 60) return "Berserker Rage"
      if (type === "Rogue" && agility > 50) return "Sneak Attack"
      if (type === "Bandit" && agility > 40) return "Poison Dart"
      return "Defensive Stance"

    case "Ancient Trap":
      if (type === "Rogue" && agility > 40) return "Disarm Trap"
      if (type === "Mage" && wisdom > 40) return "Detect Magic"
      if (type === "Barbarian") return "Trigger Safely"
      return "Careful Advance"

    case "Mystic Puzzle":
      if (type === "Mage" && wisdom > 50) return "Arcane Insight"
      if (wisdom > 40) return "Analyze Pattern"
      return "Support Team"

    default:
      return "Standard Attack"
  }
}

function generateRecommendations(party: Character[], encounter: Encounter, successChance: number): string[] {
  const recommendations: string[] = []

  if (successChance < 30) {
    recommendations.push("Consider retreating - this encounter may be too dangerous")
    recommendations.push("Focus on defensive strategies and healing")
  } else if (successChance < 60) {
    recommendations.push("Proceed with caution - coordinate your attacks")
    recommendations.push("Have healing items ready")
  } else {
    recommendations.push("Good chance of success - execute your strategy confidently")
  }

  // Class-specific recommendations
  const mages = party.filter((c) => c.type === "Mage").length
  const barbarians = party.filter((c) => c.type === "Barbarian").length
  const rogues = party.filter((c) => c.type === "Rogue").length

  if (encounter.event_type === "Dragon Fight") {
    if (mages > 0) recommendations.push("Mages should focus on elemental damage")
    if (barbarians > 0) recommendations.push("Barbarians should tank damage and draw attention")
  }

  if (encounter.event_type === "Ancient Trap" && rogues > 0) {
    recommendations.push("Let Rogues lead - they excel at trap detection")
  }

  if (encounter.event_type === "Mystic Puzzle" && mages > 0) {
    recommendations.push("Mages should take the lead on puzzle-solving")
  }

  return recommendations
}
