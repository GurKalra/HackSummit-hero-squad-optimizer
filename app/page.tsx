"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Trash2,
  Users,
  Sword,
  Shield,
  Zap,
  Eye,
  Brain,
  Heart,
  Diamond as Dragon,
  Skull,
  Gem,
  Loader2,
  TrendingUp,
} from "lucide-react";

type CharacterClass = "Mage" | "Barbarian" | "Rogue" | "Bandit";

interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  strength: number;
  agility: number;
  mana: number;
  dexterity: number;
  wisdom: number;
  health: number;
}

interface Party {
  name: string;
  members: Character[];
}

type EventType = "Dragon Fight" | "Ancient Trap" | "Mystic Puzzle";

interface GameEvent {
  id: string;
  name: EventType;
  description: string;
  icon: React.ReactNode;
  backgroundImage: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function HomePage() {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    "home" | "party" | "events"
  >("home");
  const [party, setParty] = useState<Party | null>(null);

  const rollDice = () => {
    setIsSpinning(true);
    setDiceValue(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      setDiceValue(roll);
      setIsSpinning(false);
    }, 2000);
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
    // In a real app, this would control audio playback
  };

  if (currentSection === "party") {
    return (
      <PartySection
        onBack={() => setCurrentSection("home")}
        party={party}
        setParty={setParty}
      />
    );
  }

  if (currentSection === "events") {
    return (
      <EventsSection onBack={() => setCurrentSection("home")} party={party} />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/medieval-parchment-texture-with-faint-castle-illus.jpg')] bg-cover bg-center" />

      {/* Music Toggle - Bottom Left */}
      <Button
        onClick={toggleMusic}
        className="fixed bottom-6 left-6 z-50 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full p-3"
        size="icon"
      >
        {musicPlaying ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>

      {/* Learn D&D Modal - Bottom Right */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent/80 text-accent-foreground 
                 rounded-full px-4 py-2 flex items-center gap-2 whitespace-nowrap shadow-lg"
            size="sm"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Learn D&D</span>
          </Button>
        </DialogTrigger>

        <DialogContent
          className="max-w-2xl w-[95%] sm:w-full bg-card border-2 border-border 
               sm:rounded-lg rounded-none sm:mx-0 mx-2 max-h-[90vh] flex flex-col"
        >
          <DialogHeader>
            <DialogTitle className="font-fantasy text-2xl text-primary glow-text">
              Dungeons & Dragons Guide
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="space-y-4 text-card-foreground overflow-y-auto pr-2 flex-1">
            <p className="text-lg">
              Dungeons & Dragons (D&D) is a tabletop role-playing game where
              players create characters and embark on adventures guided by a
              Dungeon Master (DM). It's a game of imagination, strategy, and
              collaborative storytelling.
            </p>

            <div>
              <h3 className="font-fantasy text-xl text-primary mb-2">
                Core Concepts
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Characters:</strong> Players create heroes with unique
                  abilities, backgrounds, and personalities
                </li>
                <li>
                  <strong>Classes:</strong> Different character types like
                  Warriors, Mages, Rogues, and Clerics
                </li>
                <li>
                  <strong>Stats:</strong> Numerical values representing
                  character abilities (Strength, Agility, Health, etc.)
                </li>
                <li>
                  <strong>Encounters:</strong> Challenges and battles that test
                  the party's skills and teamwork
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-fantasy text-xl text-primary mb-2">
                How It Works
              </h3>
              <p>
                Players work together as a party to overcome obstacles, solve
                puzzles, and defeat enemies. The game uses dice rolls to
                determine the success of actions, adding an element of chance
                and excitement to every decision.
              </p>
            </div>

            <div>
              <h3 className="font-fantasy text-xl text-primary mb-2">
                Why Use an Optimizer?
              </h3>
              <p>
                The Hero Squad Optimizer helps players make strategic decisions
                during combat encounters. By analyzing party composition, enemy
                threats, and character abilities, it suggests the most effective
                actions to maximize your chances of success.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Title */}
        <h1 className="font-fantasy text-6xl md:text-8xl font-bold text-primary mb-8 text-center glow-text">
          Hero Squad Optimizer
        </h1>

        {/* D20 Dice */}
        <div className="mb-12">
          <div
            className={`relative cursor-pointer transition-transform hover:scale-105 ${
              isSpinning ? "animate-spin" : ""
            }`}
            onClick={rollDice}
          >
            <div className="w-48 h-48 relative perspective-1000">
              <div
                className={`w-full h-full transform-style-3d transition-transform duration-2000 ${
                  isSpinning ? "rotate-3d" : ""
                }`}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient
                      id="purpleGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="30%" stopColor="#7c3aed" />
                      <stop offset="70%" stopColor="#5b21b6" />
                      <stop offset="100%" stopColor="#4c1d95" />
                    </linearGradient>
                    <linearGradient
                      id="purpleGradient2"
                      x1="100%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6d28d9" />
                    </linearGradient>
                    <linearGradient
                      id="purpleGradient3"
                      x1="50%"
                      y1="0%"
                      x2="50%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <filter id="runeGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="edgeGlow">
                      <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Top pyramid faces */}
                  <polygon
                    points="100,15 70,50 130,50"
                    fill="url(#purpleGradient)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                  />
                  <polygon
                    points="100,15 130,50 160,80"
                    fill="url(#purpleGradient2)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                  />
                  <polygon
                    points="100,15 160,80 140,120"
                    fill="url(#purpleGradient3)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                  />
                  <polygon
                    points="100,15 140,120 100,140"
                    fill="url(#purpleGradient)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                  />
                  <polygon
                    points="100,15 100,140 60,120"
                    fill="url(#purpleGradient2)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                  />
                  <polygon
                    points="100,15 60,120 40,80"
                    fill="url(#purpleGradient3)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                  />
                  <polygon
                    points="100,15 40,80 70,50"
                    fill="url(#purpleGradient)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                  />

                  {/* Middle belt faces */}
                  <polygon
                    points="70,50 130,50 160,80 40,80"
                    fill="url(#purpleGradient2)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                    opacity="0.9"
                  />

                  {/* Bottom pyramid faces */}
                  <polygon
                    points="100,185 130,150 70,150"
                    fill="url(#purpleGradient3)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                  />
                  <polygon
                    points="40,80 60,120 100,140 70,150"
                    fill="url(#purpleGradient)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                    opacity="0.8"
                  />
                  <polygon
                    points="160,80 140,120 100,140 130,150"
                    fill="url(#purpleGradient2)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    filter="url(#edgeGlow)"
                    opacity="0.7"
                  />

                  {/* Rune-like numbers on visible faces */}
                  <text
                    x="100"
                    y="45"
                    textAnchor="middle"
                    className="fill-amber-300 font-bold text-sm"
                    filter="url(#runeGlow)"
                  >
                    20
                  </text>
                  <text
                    x="145"
                    y="75"
                    textAnchor="middle"
                    className="fill-amber-300 font-bold text-xs"
                    filter="url(#runeGlow)"
                  >
                    1
                  </text>
                  <text
                    x="55"
                    y="75"
                    textAnchor="middle"
                    className="fill-amber-300 font-bold text-xs"
                    filter="url(#runeGlow)"
                  >
                    19
                  </text>
                  <text
                    x="100"
                    y="125"
                    textAnchor="middle"
                    className="fill-amber-300 font-bold text-sm"
                    filter="url(#runeGlow)"
                  >
                    10
                  </text>
                </svg>
              </div>

              {/* Dice Result Display */}
              {diceValue && !isSpinning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/80 rounded-lg px-4 py-2 border border-amber-400">
                    <span className="font-fantasy text-3xl font-bold text-amber-300 glow-text">
                      {diceValue}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-center mt-4 text-muted-foreground font-medium">
            {isSpinning
              ? "Rolling the sacred die..."
              : diceValue
              ? `The fates decree: ${diceValue}!`
              : "Click the D20 to consult the fates!"}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            onClick={() => setCurrentSection("party")}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg border-2 border-accent shadow-lg hover:shadow-xl transition-all"
          >
            Create Party
          </Button>

          <Button
            onClick={() => setCurrentSection("events")}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-4 text-lg font-semibold rounded-lg border-2 border-primary shadow-lg hover:shadow-xl transition-all"
          >
            Choose Events
          </Button>
        </div>
      </div>
    </div>
  );
}

function PartySection({
  onBack,
  party,
  setParty,
}: {
  onBack: () => void;
  party: Party | null;
  setParty: (party: Party | null) => void;
}) {
  const [partyName, setPartyName] = useState("");
  const [memberCount, setMemberCount] = useState(1);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isCreating, setIsCreating] = useState(!party);

  const createNewCharacter = (): Character => ({
    id: Math.random().toString(36).substr(2, 9),
    name: "",
    class: "Mage",
    strength: 13,
    agility: 13,
    mana: 14,
    dexterity: 13,
    wisdom: 14,
    health: 13, // Total: 80 points (balanced distribution)
  });

  const handleMemberCountChange = (count: number) => {
    setMemberCount(count);
    const newCharacters = Array.from(
      { length: count },
      (_, i) => characters[i] || createNewCharacter()
    );
    setCharacters(newCharacters.slice(0, count));
  };

  const updateCharacter = (
    index: number,
    field: keyof Character,
    value: string | number
  ) => {
    const updated = [...characters];
    updated[index] = { ...updated[index], [field]: value };
    setCharacters(updated);
  };

  const getTotalPoints = (character: Character): number => {
    return (
      character.strength +
      character.agility +
      character.mana +
      character.dexterity +
      character.wisdom +
      character.health
    );
  };

  const isValidPointAllocation = (character: Character): boolean => {
    return getTotalPoints(character) <= 80;
  };

  const createParty = () => {
    const allValid = characters.every((char) => isValidPointAllocation(char));
    if (partyName && characters.length > 0 && allValid) {
      setParty({ name: partyName, members: characters });
      setIsCreating(false);
    }
  };

  const deleteParty = () => {
    setParty(null);
    setIsCreating(true);
    setPartyName("");
    setCharacters([]);
    setMemberCount(1);
  };

  const getClassIcon = (characterClass: CharacterClass) => {
    switch (characterClass) {
      case "Mage":
        return <Zap className="h-5 w-5" />;
      case "Barbarian":
        return <Sword className="h-5 w-5" />;
      case "Rogue":
        return <Eye className="h-5 w-5" />;
      case "Bandit":
        return <Shield className="h-5 w-5" />;
    }
  };

  const getClassImage = (characterClass: CharacterClass) => {
    const images = {
      Mage: "/fantasy-mage.png",
      Barbarian: "/fantasy-barbarian-warrior-with-axe.jpg",
      Rogue: "/fantasy-rogue-with-bow-and-hood.jpg",
      Bandit: "/fantasy-bandit-with-dagger-and-mask.jpg",
    };
    return images[characterClass];
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/medieval-parchment-texture-with-faint-castle-illus.jpg')] bg-cover bg-center" />

      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            ← Back to Home
          </Button>
          {party && !isCreating && (
            <Button
              onClick={deleteParty}
              className="bg-destructive hover:bg-destructive/80 text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Party
            </Button>
          )}
        </div>

        <h1 className="font-fantasy text-4xl md:text-6xl text-primary mb-8 text-center glow-text">
          {isCreating ? "Create Your Party" : `Party: ${party?.name}`}
        </h1>

        {isCreating ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Party Creation Form */}
            <Card className="bg-card/90 backdrop-blur border-2 border-accent shadow-xl">
              <CardHeader>
                <CardTitle className="font-fantasy text-2xl text-primary flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Party Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="partyName" className="text-lg font-semibold">
                    Party Name
                  </Label>
                  <Input
                    id="partyName"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="Enter your party name..."
                    className="mt-2 text-lg"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="memberCount"
                    className="text-lg font-semibold"
                  >
                    Number of Members
                  </Label>
                  <Select
                    value={memberCount.toString()}
                    onValueChange={(value) =>
                      handleMemberCountChange(Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Member{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Character Creation Forms */}
            {characters.map((character, index) => (
              <Card
                key={character.id}
                className="bg-card/90 backdrop-blur border-2 border-primary shadow-xl"
              >
                <CardHeader>
                  <CardTitle className="font-fantasy text-xl text-primary">
                    Character {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Name</Label>
                      <Input
                        value={character.name}
                        onChange={(e) =>
                          updateCharacter(index, "name", e.target.value)
                        }
                        placeholder="Character name..."
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Class</Label>
                      <Select
                        value={character.class}
                        onValueChange={(value) =>
                          updateCharacter(
                            index,
                            "class",
                            value as CharacterClass
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mage">Mage</SelectItem>
                          <SelectItem value="Barbarian">Barbarian</SelectItem>
                          <SelectItem value="Rogue">Rogue</SelectItem>
                          <SelectItem value="Bandit">Bandit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      {
                        key: "strength",
                        label: "Strength",
                        icon: <Sword className="h-4 w-4" />,
                      },
                      {
                        key: "agility",
                        label: "Agility",
                        icon: <Eye className="h-4 w-4" />,
                      },
                      {
                        key: "mana",
                        label: "Mana",
                        icon: <Zap className="h-4 w-4" />,
                      },
                      {
                        key: "dexterity",
                        label: "Dexterity",
                        icon: <Shield className="h-4 w-4" />,
                      },
                      {
                        key: "wisdom",
                        label: "Wisdom",
                        icon: <Brain className="h-4 w-4" />,
                      },
                      {
                        key: "health",
                        label: "Health",
                        icon: <Heart className="h-4 w-4" />,
                      },
                    ].map(({ key, label, icon }) => (
                      <div key={key}>
                        <Label className="font-semibold flex items-center gap-1">
                          {icon}
                          {label}
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="80"
                          value={character[key as keyof Character]}
                          onChange={(e) =>
                            updateCharacter(
                              index,
                              key as keyof Character,
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          className={
                            !isValidPointAllocation(character)
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Points:</span>
                      <span
                        className={`font-bold ${
                          getTotalPoints(character) > 80
                            ? "text-red-500"
                            : getTotalPoints(character) === 80
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {getTotalPoints(character)} / 80
                      </span>
                    </div>
                    {getTotalPoints(character) > 80 && (
                      <p className="text-red-500 text-sm mt-1">
                        ⚠️ Exceeds point limit! Reduce stats by{" "}
                        {getTotalPoints(character) - 80} points.
                      </p>
                    )}
                    {getTotalPoints(character) < 80 && (
                      <p className="text-yellow-600 text-sm mt-1">
                        💡 You have {80 - getTotalPoints(character)} points
                        remaining to allocate.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-center">
              <Button
                onClick={createParty}
                disabled={!partyName || characters.length === 0}
                className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-lg font-semibold"
              >
                Create Party
              </Button>
            </div>
          </div>
        ) : (
          // Party Display
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {party?.members.map((character, index) => (
                <Card
                  key={character.id}
                  className="bg-card/90 backdrop-blur border-2 border-accent shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary group cursor-pointer"
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 relative">
                      <img
                        src={
                          getClassImage(character.class) || "/placeholder.svg"
                        }
                        alt={`${character.class} character`}
                        className="w-24 h-24 rounded-full border-4 border-accent group-hover:border-primary transition-colors"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-secondary rounded-full p-2 border-2 border-accent">
                        {getClassIcon(character.class)}
                      </div>
                    </div>
                    <CardTitle className="font-fantasy text-xl text-primary">
                      {character.name}
                    </CardTitle>
                    <p className="text-muted-foreground font-semibold">
                      {character.class}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Sword className="h-3 w-3 text-accent" />
                        <span>STR: {character.strength}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-accent" />
                        <span>AGI: {character.agility}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-accent" />
                        <span>MAN: {character.mana}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-accent" />
                        <span>DEX: {character.dexterity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="h-3 w-3 text-accent" />
                        <span>WIS: {character.wisdom}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-accent" />
                        <span>HP: {character.health}</span>
                      </div>
                    </div>

                    {/* Hidden details shown on hover */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-xs text-muted-foreground border-t border-border pt-2">
                        <p className="font-semibold">Role: {character.class}</p>
                        <p>
                          Total Stats:{" "}
                          {character.strength +
                            character.agility +
                            character.mana +
                            character.dexterity +
                            character.wisdom +
                            character.health}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3"
              >
                Edit Party
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventsSection({
  onBack,
  party,
}: {
  onBack: () => void;
  party: Party | null;
}) {
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdventure, setShowAdventure] = useState(false);

  const events: GameEvent[] = [
    {
      id: "dragon-fight",
      name: "Dragon Fight",
      description:
        "Face the mighty Ancient Red Dragon in its volcanic lair. Only the bravest heroes dare challenge this legendary beast.",
      icon: <Dragon className="h-12 w-12" />,
      backgroundImage: "/dragon-cave-background.jpg",
      difficulty: "Hard",
    },
    {
      id: "ancient-trap",
      name: "Ancient Trap",
      description:
        "Navigate through a dungeon filled with deadly traps and ancient mechanisms. One wrong step could be your last.",
      icon: <Skull className="h-12 w-12" />,
      backgroundImage: "/dungeon-trap-background.jpg",
      difficulty: "Medium",
    },
    {
      id: "mystic-puzzle",
      name: "Mystic Puzzle",
      description:
        "Solve the riddles of the Crystal Chamber. Ancient magic protects powerful artifacts within these mystical halls.",
      icon: <Gem className="h-12 w-12" />,
      backgroundImage: "/crystal-chamber-background.jpg",
      difficulty: "Easy",
    },
  ];

  const handleEventSelect = (event: GameEvent) => {
    if (!party || party.members.length === 0) {
      alert("You need to create a party first!");
      return;
    }

    setSelectedEvent(event);
    setIsLoading(true);
    setShowAdventure(true);

    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  if (showAdventure && selectedEvent) {
    return (
      <AdventureScreen
        event={selectedEvent}
        party={party}
        isLoading={isLoading}
        onBack={() => {
          setShowAdventure(false);
          setSelectedEvent(null);
          setIsLoading(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/medieval-parchment-texture-with-faint-castle-illus.jpg')] bg-cover bg-center" />

      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            ← Back to Home
          </Button>
          {party && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Party</p>
              <p className="font-fantasy text-lg text-primary">{party.name}</p>
              <p className="text-sm text-muted-foreground">
                {party.members.length} members
              </p>
            </div>
          )}
        </div>

        <h1 className="font-fantasy text-4xl md:text-6xl text-primary mb-8 text-center glow-text">
          Choose Your Adventure
        </h1>

        {!party && (
          <Card className="max-w-2xl mx-auto mb-8 bg-card/90 backdrop-blur border-2 border-destructive">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-destructive-foreground">
                You need to create a party before embarking on an adventure!
              </p>
              <Button
                onClick={onBack}
                className="mt-4 bg-primary hover:bg-primary/80 text-primary-foreground"
              >
                Create Party First
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="bg-card/90 backdrop-blur border-2 border-accent shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-primary group cursor-pointer hover:scale-105"
              onClick={() => handleEventSelect(event)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-6 bg-primary/10 rounded-full border-4 border-accent group-hover:border-primary transition-colors group-hover:bg-primary/20">
                  <div className="text-primary group-hover:text-accent transition-colors">
                    {event.icon}
                  </div>
                </div>
                <CardTitle className="font-fantasy text-2xl text-primary group-hover:glow-text transition-all">
                  {event.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold">Difficulty:</span>
                  <span
                    className={`text-sm font-bold ${getDifficultyColor(
                      event.difficulty
                    )}`}
                  >
                    {event.difficulty}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground text-center leading-relaxed">
                  {event.description}
                </p>

                <div className="mt-6 text-center">
                  <Button
                    className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 font-semibold"
                    disabled={!party}
                  >
                    Begin Adventure
                  </Button>
                </div>

                {/* Hidden details shown on hover */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-xs text-muted-foreground border-t border-border pt-2 text-center">
                    <p className="font-semibold">
                      Click to start this encounter
                    </p>
                    {party && (
                      <p>
                        Party: {party.name} ({party.members.length} heroes)
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {party && (
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-card/90 backdrop-blur border-2 border-accent">
              <CardHeader>
                <CardTitle className="font-fantasy text-xl text-primary">
                  Ready for Adventure?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground mb-4">
                  Your party "{party.name}" is ready to face any challenge.
                  Choose an encounter above to begin your quest!
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {party.members.map((member, index) => (
                    <span
                      key={member.id}
                      className="px-3 py-1 bg-secondary/20 border border-secondary rounded-full text-sm font-semibold"
                    >
                      {member.name} ({member.class})
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function AdventureScreen({
  event,
  party,
  isLoading,
  onBack,
}: {
  event: GameEvent;
  party: Party | null;
  isLoading: boolean;
  onBack: () => void;
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [currentTurnCharacter, setCurrentTurnCharacter] = useState<string>("");

  const handleOptimizeActions = async () => {
    if (!party || party.members.length === 0) return;

    setIsAnalyzing(true);

    try {
      // Prepare API request data according to specification
      const requestData = {
        party: party.members.map((member) => ({
          name: member.name,
          type: member.class,
          strength: member.strength,
          agility: member.agility,
          health: member.health,
          mana: member.mana,
          dexterity: member.dexterity,
          wisdom: member.wisdom,
        })),
        encounter: {
          event_type: event.name,
          enemy: {
            name: getEnemyName(event.name),
            health: getEnemyHealth(event.name),
          },
        },
        current_turn_character: currentTurnCharacter || party.members[0].name,
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze party");
      }

      const result = await response.json();
      setAnalysisResult(result.analysis);
    } catch (error) {
      console.error("Error analyzing party:", error);
      alert("Failed to analyze party. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEnemyName = (eventName: EventType): string => {
    switch (eventName) {
      case "Dragon Fight":
        return "Ancient Red Dragon";
      case "Ancient Trap":
        return "Mechanical Guardian";
      case "Mystic Puzzle":
        return "Crystal Sentinel";
      default:
        return "Unknown Enemy";
    }
  };

  const getEnemyHealth = (eventName: EventType): number => {
    switch (eventName) {
      case "Dragon Fight":
        return 250;
      case "Ancient Trap":
        return 150;
      case "Mystic Puzzle":
        return 100;
      default:
        return 100;
    }
  };

  const getSuccessColor = (rate: number): string => {
    if (rate >= 70) return "text-green-500";
    if (rate >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Dynamic background based on selected event */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${event.backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80" />

        <Card className="relative z-10 max-w-2xl mx-auto bg-card/95 backdrop-blur border-4 border-accent shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <div className="text-primary mb-4 animate-pulse">
                {event.icon}
              </div>
              <h1 className="font-fantasy text-4xl text-primary glow-text mb-4">
                Adventure Begins
              </h1>
            </div>

            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-2 bg-primary/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>

              <p className="text-lg text-card-foreground animate-in fade-in duration-2000">
                Preparing your {event.name} encounter...
              </p>

              <div className="text-sm text-muted-foreground">
                <p>Party: {party?.name}</p>
                <p>Heroes: {party?.members.length}</p>
                <p>Difficulty: {event.difficulty}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic background based on selected event */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-1000"
        style={{ backgroundImage: `url('${event.backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/70" />

      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            ← Back to Events
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Encounter</p>
            <p className="font-fantasy text-lg text-primary">{event.name}</p>
            <p
              className={`text-sm font-semibold ${
                event.difficulty === "Hard"
                  ? "text-red-500"
                  : event.difficulty === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {event.difficulty}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="bg-card/95 backdrop-blur border-2 border-accent shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-primary/20 rounded-full border-4 border-accent">
                <div className="text-primary">{event.icon}</div>
              </div>
              <CardTitle className="font-fantasy text-3xl text-primary glow-text">
                {event.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-card-foreground mb-6 leading-relaxed">
                {event.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-secondary/10 border border-secondary">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">
                      Your Party
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {party?.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="font-semibold">{member.name}</span>
                          <span className="text-muted-foreground">
                            {member.class}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border border-accent">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">
                      Encounter Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span
                          className={`font-semibold ${
                            event.difficulty === "Hard"
                              ? "text-red-500"
                              : event.difficulty === "Medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {event.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Party Size:</span>
                        <span className="font-semibold">
                          {party?.members.length} heroes
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Enemy:</span>
                        <span className="font-semibold text-primary">
                          {getEnemyName(event.name)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="max-w-md mx-auto">
                  <Label className="text-sm font-semibold mb-2 block">
                    Current Turn Character
                  </Label>
                  <Select
                    value={currentTurnCharacter}
                    onValueChange={setCurrentTurnCharacter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select character for current turn" />
                    </SelectTrigger>
                    <SelectContent>
                      {party?.members.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name} ({member.class})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleOptimizeActions}
                  disabled={isAnalyzing || !currentTurnCharacter}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-lg font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Optimize Actions
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Analyze your party's best strategy for this encounter
                </p>
              </div>
            </CardContent>
          </Card>

          {analysisResult && (
            <Card className="bg-card/95 backdrop-blur border-2 border-primary shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="font-fantasy text-2xl text-primary flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Strategic Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Success Rate */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Party Success Chance
                  </h3>
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{
                      color:
                        analysisResult.party_success_chance >= 70
                          ? "#22c55e"
                          : analysisResult.party_success_chance >= 40
                          ? "#eab308"
                          : "#ef4444",
                    }}
                  >
                    {analysisResult.party_success_chance}%
                  </div>
                  <Progress
                    value={analysisResult.party_success_chance}
                    className="w-full max-w-md mx-auto h-3"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Encounter Difficulty: {analysisResult.encounter_difficulty}
                  </p>
                </div>

                {/* Individual Character Success Rates - Bar Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Individual Success Rates
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.individual_success_rates.map(
                      (char: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              {char.character}
                            </span>
                            <span
                              className={`font-bold ${getSuccessColor(
                                char.success_rate
                              )}`}
                            >
                              {char.success_rate}%
                            </span>
                          </div>
                          <div className="relative">
                            <Progress
                              value={char.success_rate}
                              className="h-6"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                              {char.recommended_action}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Strategic Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Strategic Recommendations
                  </h3>
                  <div className="space-y-2">
                    {analysisResult.strategic_recommendations.map(
                      (rec: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20"
                        >
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm">{rec}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
