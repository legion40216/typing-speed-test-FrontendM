// components/modules/typing-section.tsx
import type {
  DifficultyOption,
  GameState,
  Mode,
  Novel,
  NovelEntry,
} from "@/data/constants";
import type { RefObject } from "react";

import { Separator } from "@/components/ui/separator";
import StatsBar from "./typing-section/statsbar";
import TypingArea from "./typing-section/typing-area";

interface TypingSectionProps {
  wpm: number;
  accuracy: number;
  time: number;
  difficulty: DifficultyOption;
  mode: Mode;
  passage: string;
  typedText: string;
  gameState: GameState;
  onDifficultyChange: (difficulty: DifficultyOption) => void;
  onModeChange: (mode: Mode) => void;
  onReset: () => void;
  onStart: () => void;
  isNovelMode: boolean;
  novels: Novel;
  selectedNovel: NovelEntry;
  onNovelChange: (novel: NovelEntry) => void;
  inputRef: RefObject<HTMLInputElement>;
}

export default function TypingSection({
  wpm,
  accuracy,
  time,
  difficulty,
  mode,
  passage,
  typedText,
  gameState,
  onDifficultyChange,
  onModeChange,
  onReset,
  onStart,
  isNovelMode,
  novels,
  selectedNovel,
  onNovelChange,
  inputRef,
}: TypingSectionProps) {
  return (
    <div className="">
      <StatsBar
        wpm={wpm}
        accuracy={accuracy}
        time={time}
        difficulty={difficulty}
        mode={mode}
        onDifficultyChange={onDifficultyChange}
        onModeChange={onModeChange}
        isNovelMode={isNovelMode}
        novels={novels}
        selectedNovel={selectedNovel}
        onNovelChange={onNovelChange}
      />

      <Separator className="my-6 bg-neutral-500" />

      <TypingArea
        passage={passage}
        typedText={typedText}
        gameState={gameState}
        onStart={onStart}
        onReset={onReset}
        inputRef={inputRef}
      />
    </div>
  );
}