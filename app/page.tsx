"use client";

import type React from "react";
// --- MUSIC: Import useRef ---
import { useState, useRef } from "react";
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
  Edit,
  Wand2,
} from "lucide-react";

// --- CLIENT-SIDE INTERFACES ---
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

const CLASS_TEMPLATES: Record<
  CharacterClass,
  Omit<Character, "id" | "name" | "class">
> = {
  Barbarian: {
    strength: 25,
    agility: 10,
    mana: 5,
    dexterity: 10,
    wisdom: 5,
    health: 25,
  },
  Mage: {
    strength: 5,
    agility: 10,
    mana: 25,
    dexterity: 10,
    wisdom: 25,
    health: 5,
  },
  Rogue: {
    strength: 10,
    agility: 25,
    mana: 5,
    dexterity: 25,
    wisdom: 10,
    health: 5,
  },
  Bandit: {
    strength: 15,
    agility: 20,
    mana: 5,
    dexterity: 20,
    wisdom: 5,
    health: 15,
  },
};

const getDifficultyColor = (
  difficulty: "Easy" | "Medium" | "Hard" | string
) => {
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

const D20Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L2 8.5V15.5L12 22L22 15.5V8.5L12 2Z" />
    <path d="M2 8.5L12 12L22 8.5" />
    <path d="M12 2V12" />
    <path d="M2 15.5L7 13.75" />
    <path d="M22 15.5L17 13.75" />
    <path d="M12 22L7 19.25" />
    <path d="M12 22L17 19.25" />
  </svg>
);

export default function HomePage() {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    "home" | "party" | "events"
  >("home");
  const [party, setParty] = useState<Party | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  // --- MUSIC: Create a ref for the audio element ---
  const audioRef = useRef<HTMLAudioElement>(null);

  const rollDice = () => {
    if (isSpinning || isRevealing) return;

    setIsSpinning(true);
    setDiceValue(null);

    setTimeout(() => {
      setIsSpinning(false);
      setIsRevealing(true);

      setTimeout(() => {
        const roll = Math.floor(Math.random() * 20) + 1;
        setDiceValue(roll);
        setIsRevealing(false);
      }, 1500);
    }, 2000);
  };

  // --- MUSIC: Update the toggleMusic function to control playback ---
  const toggleMusic = () => {
    const newMusicPlaying = !musicPlaying;
    setMusicPlaying(newMusicPlaying);
    if (audioRef.current) {
      if (newMusicPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
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
      {/* --- MUSIC: Add the audio element here --- */}
      <audio ref={audioRef} src="/music/fantasy-theme.mp3" loop />

      <div className="absolute inset-0 opacity-10 bg-[url('/medieval-parchment-texture-with-faint-castle-illus.jpg')] bg-cover bg-center" />
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
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent/80 text-accent-foreground rounded-full p-2"
            size="sm"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            Learn D&D
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-card border-2 border-border">
          <DialogHeader>
            <DialogTitle className="font-fantasy text-2xl text-primary glow-text">
              Dungeons & Dragons Guide
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-card-foreground leading-relaxed max-h-[70vh] overflow-y-auto pr-6">
            <p>
              Dungeons & Dragons (D&D) is a tabletop role-playing game where
              players create characters and embark on adventures guided by a
              Dungeon Master (DM). It's a game of imagination, strategy, and
              collaborative storytelling.
            </p>

            <div>
              <h3 className="font-fantasy text-lg text-primary mb-2">
                Core Concepts
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>
                  <strong>Characters:</strong> Players create heroes with unique
                  abilities, backgrounds, and personalities.
                </li>
                <li>
                  <strong>Classes:</strong> Different character types like
                  Warriors, Mages, Rogues, and Clerics.
                </li>
                <li>
                  <strong>Stats:</strong> Numerical values representing
                  character abilities (Strength, Agility, Health, etc.).
                </li>
                <li>
                  <strong>Encounters:</strong> Challenges and battles that test
                  the party's skills and teamwork.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-fantasy text-lg text-primary mb-2">
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
              <h3 className="font-fantasy text-lg text-primary mb-2">
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="font-fantasy text-6xl md:text-8xl font-bold text-primary mb-8 text-center glow-text">
          Hero Squad Optimizer
        </h1>
        <div className="mb-12 text-center h-16 flex items-center justify-center">
          <div
            onClick={rollDice}
            className="relative overflow-hidden inline-flex items-center justify-center p-4 rounded-lg bg-card/50 hover:bg-card/80 cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-accent shadow-lg min-w-[300px] h-full"
          >
            {isSpinning ? (
              <div className="flex items-center gap-3 text-secondary-foreground">
                <D20Icon className="h-6 w-6 animate-spin text-primary" />
                <span className="font-semibold text-lg">
                  Deciding your fate...
                </span>
              </div>
            ) : isRevealing ? (
              <>
                <Wand2 className="h-8 w-8 text-primary absolute animate-sweep" />
                <span className="font-semibold text-lg text-secondary-foreground/50">
                  Revealing...
                </span>
              </>
            ) : diceValue !== null ? (
              <p className="font-fantasy text-2xl text-primary animate-in fade-in zoom-in-50 duration-500">
                Fate has decided: {diceValue}
              </p>
            ) : (
              <div className="flex items-center gap-3 text-secondary-foreground">
                <D20Icon className="h-6 w-6" />
                <span className="font-semibold text-lg">
                  Click to discover your fate
                </span>
              </div>
            )}
          </div>
        </div>
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

// ... (PartySection and EventsSection components remain the same) ...
function PartySection({
  onBack,
  party,
  setParty,
}: {
  onBack: () => void;
  party: Party | null;
  setParty: (party: Party | null) => void;
}) {
  const [partyName, setPartyName] = useState(party?.name || "");
  const [memberCount, setMemberCount] = useState(party?.members.length || 1);
  const [characters, setCharacters] = useState<Character[]>(
    party?.members || []
  );
  const [isCreating, setIsCreating] = useState(!party);

  const createNewCharacter = (
    charClass: CharacterClass = "Mage"
  ): Character => ({
    id: Math.random().toString(36).substr(2, 9),
    name: "",
    class: charClass,
    ...CLASS_TEMPLATES[charClass],
  });

  const handleMemberCountChange = (count: number) => {
    setMemberCount(count);
    const newCharacters = Array.from(
      { length: count },
      (_, i) => characters[i] || createNewCharacter()
    );
    setCharacters(newCharacters.slice(0, count));
  };

  const updateCharacterStat = (
    index: number,
    field: keyof Character,
    value: string | number
  ) => {
    const updated = [...characters];
    updated[index] = { ...updated[index], [field]: value };
    setCharacters(updated);
  };

  const handleCharacterClassChange = (
    index: number,
    newClass: CharacterClass
  ) => {
    const updated = [...characters];
    updated[index] = {
      ...updated[index],
      class: newClass,
      ...CLASS_TEMPLATES[newClass],
    };
    setCharacters(updated);
  };

  const getTotalPoints = (character: Character): number =>
    character.strength +
    character.agility +
    character.mana +
    character.dexterity +
    character.wisdom +
    character.health;

  const isValidPointAllocation = (character: Character): boolean =>
    getTotalPoints(character) <= 80;

  const saveParty = () => {
    if (!partyName.trim()) {
      alert("Please enter a name for your party.");
      return;
    }

    if (characters.length === 0) {
      alert("A party must have at least one member.");
      return;
    }

    for (const char of characters) {
      if (!char.name.trim()) {
        alert("Please make sure every character has a name.");
        return;
      }
      if (!isValidPointAllocation(char)) {
        alert(
          `Character "${
            char.name || "Unnamed"
          }" has a total of ${getTotalPoints(
            char
          )} points, which exceeds the maximum of 80.`
        );
        return;
      }
    }

    setParty({ name: partyName, members: characters });
    setIsCreating(false);
  };

  const deleteParty = () => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      setParty(null);
      setIsCreating(true);
      setPartyName("");
      setCharacters([]);
      setMemberCount(1);
    }
  };

  const editParty = () => {
    setIsCreating(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/medieval-parchment-texture-with-faint-castle-illus.jpg')] bg-cover bg-center" />
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            ← Back to Home
          </Button>
        </div>

        {isCreating ? (
          <>
            <h1 className="font-fantasy text-4xl md:text-6xl text-primary mb-8 text-center glow-text">
              {party ? "Edit Your Party" : "Create Your Party"}
            </h1>
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="bg-card/90 backdrop-blur border-2 border-accent shadow-xl">
                <CardHeader>
                  <CardTitle className="font-fantasy text-xl text-primary">
                    Party Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label className="font-semibold flex items-center gap-1 mb-2">
                      <Users className="h-4 w-4" /> Party Name
                    </Label>
                    <Input
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      placeholder="Name your legendary party..."
                    />
                  </div>
                  <div>
                    <Label className="font-semibold flex items-center gap-1 mb-2">
                      <Users className="h-4 w-4" /> Number of Members
                    </Label>
                    <Select
                      value={String(memberCount)}
                      onValueChange={(value) =>
                        handleMemberCountChange(Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Member</SelectItem>
                        <SelectItem value="2">2 Members</SelectItem>
                        <SelectItem value="3">3 Members</SelectItem>
                        <SelectItem value="4">4 Members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

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
                            updateCharacterStat(index, "name", e.target.value)
                          }
                          placeholder="Character name..."
                        />
                      </div>
                      <div>
                        <Label className="font-semibold">Class</Label>
                        <Select
                          value={character.class}
                          onValueChange={(value) =>
                            handleCharacterClassChange(
                              index,
                              value as CharacterClass
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Barbarian">Barbarian</SelectItem>
                            <SelectItem value="Mage">Mage</SelectItem>
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
                            {icon} {label}
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="80"
                            value={
                              character[
                                key as keyof Omit<
                                  Character,
                                  "id" | "name" | "class"
                                >
                              ]
                            }
                            onChange={(e) =>
                              updateCharacterStat(
                                index,
                                key as keyof Character,
                                Number.parseInt(e.target.value) || 1
                              )
                            }
                            className={
                              !isValidPointAllocation(character)
                                ? "border-destructive ring-destructive"
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
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="text-center">
                <Button
                  onClick={saveParty}
                  disabled={!partyName || characters.length === 0}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-lg font-semibold"
                >
                  {party ? "Save Changes" : "Create Party"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-fantasy text-4xl md:text-6xl text-primary glow-text">
                Party: {party?.name}
              </h1>
              <div className="flex gap-4">
                <Button
                  onClick={editParty}
                  variant="outline"
                  className="border-accent text-accent-foreground hover:bg-accent/80"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Party
                </Button>
                <Button
                  onClick={deleteParty}
                  className="bg-destructive hover:bg-destructive/80"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Party
                </Button>
              </div>
            </div>

            {party?.members.map((member) => (
              <Card
                key={member.id}
                className="bg-card/90 backdrop-blur border-2 border-primary shadow-xl"
              >
                <CardHeader>
                  <CardTitle className="font-fantasy text-xl text-primary flex justify-between items-center">
                    <span>{member.name}</span>
                    <span className="text-sm font-sans font-medium bg-secondary/20 border border-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      {member.class}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Sword className="h-4 w-4 text-muted-foreground" />{" "}
                    <strong>Strength:</strong> {member.strength}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />{" "}
                    <strong>Agility:</strong> {member.agility}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />{" "}
                    <strong>Mana:</strong> {member.mana}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />{" "}
                    <strong>Dexterity:</strong> {member.dexterity}
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />{" "}
                    <strong>Wisdom:</strong> {member.wisdom}
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />{" "}
                    <strong>Health:</strong> {member.health}
                  </div>
                </CardContent>
              </Card>
            ))}
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
    setTimeout(() => setIsLoading(false), 3000);
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
              </CardContent>
            </Card>
          ))}
        </div>
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

  const handleOptimizeActions = () => {
    if (!party || party.members.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const encounterData: Encounter = {
      event_type: event.name,
      enemy: {
        name: getEnemyName(event.name),
        health: getEnemyHealth(event.name),
      },
    };

    const partyData: AnalysisCharacter[] = party.members.map((member) => ({
      name: member.name,
      type: member.class,
      strength: member.strength,
      agility: member.agility,
      health: member.health,
      mana: member.mana,
      dexterity: member.dexterity,
      wisdom: member.wisdom,
    }));

    setTimeout(() => {
      const result = analyzePartyVsEncounter(partyData, encounterData);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 1500);
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
              className={`text-sm font-semibold ${getDifficultyColor(
                event.difficulty
              )}`}
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
                          className={`font-semibold ${getDifficultyColor(
                            event.difficulty
                          )}`}
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
                  <TrendingUp className="h-6 w-6" /> Strategic Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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

// --- START OF INTEGRATED ANALYSIS LOGIC ---
// This entire section was moved from the API route into the client-side page.

// --- INTERFACES FOR ANALYSIS LOGIC ---
interface AnalysisCharacter {
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

// --- CONTEXTUAL MONTE CARLO SIMULATION ---
function simulateSingleEncounter(
  party: AnalysisCharacter[],
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
  party: AnalysisCharacter[],
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
function analyzePartyVsEncounter(
  party: AnalysisCharacter[],
  encounter: Encounter
) {
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
  party: AnalysisCharacter[],
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

function getRecommendedAction(
  character: AnalysisCharacter,
  eventType: string
): string {
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
  party: AnalysisCharacter[],
  encounter: Encounter,
  successChance: number
): string[] {
  const recs: string[] = [];
  const findBest = (stat: keyof Omit<AnalysisCharacter, "name" | "type">) =>
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

// --- END OF INTEGRATED ANALYSIS LOGIC ---
