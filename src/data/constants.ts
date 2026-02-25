export const DifficultyOptions = [
  { value: "easy",   label: "Easy"   },
  { value: "medium", label: "Medium" },
  { value: "hard",   label: "Hard"   },
] as const;
export type DifficultyOption = typeof DifficultyOptions[number]["value"];

export const Modes = [
  { value: "timed", label: "Timed (60s)" }, 
  { value: "passage", label: "Passage" }
] as const;
export type Mode = typeof Modes[number]["value"];

export const gameStateOptions = ["idle", "typing", "finished"] as const;
export type GameState = typeof gameStateOptions[number];

export const resultStateOptions = ["baseline", "personal-best", "normal"] as const;
export type ResultState = "baseline" | "personal-best" | "normal";

export type NovelEntry = {
  id: string;
  title: string;
  author: string;
  text: string;
};
export type Novel = NovelEntry[];