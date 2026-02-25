// components/modules/stats-bar.tsx
import {
  DifficultyOptions,
  Modes,
  type Mode,
  type DifficultyOption,
  type NovelEntry,
  type Novel,
} from "@/data/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  time: number;
  difficulty: DifficultyOption;
  mode: Mode;
  onDifficultyChange: (d: DifficultyOption) => void;
  onModeChange: (m: Mode) => void;
  isNovelMode: boolean;
  novels: Novel;
  selectedNovel: NovelEntry;
  onNovelChange: (novel: NovelEntry) => void;
}

export default function StatsBar({
  wpm,
  accuracy,
  time,
  difficulty,
  mode,
  onDifficultyChange,
  onModeChange,
  isNovelMode,
  novels,
  selectedNovel,
  onNovelChange,
}: StatsBarProps) {
  function accuracyColor(accuracy: number) {
  if (accuracy >= 90) return "text-style-green-500";
  if (accuracy >= 70) return "text-style-yellow-400";
  return "text-style-red-500";
}

function timeColor(time: number) {
  if (time > 30) return "text-style-green-500";
  if (time > 15) return "text-style-yellow-400";
  return "text-style-red-500";
}
return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-style-neutral-400">
        <span>WPM: <strong className="text-style-neutral-0 text-xl font-bold">{wpm}</strong></span>
        <span className="text-style-neutral-500">|</span>
        <span>
          Accuracy:{" "}
          <strong className={`${accuracyColor(accuracy)} text-xl font-bold`}>
            {accuracy}%
          </strong>
        </span>

        {mode === "timed" && (
          <span>
            Time:{" "}
            <strong className={`${timeColor(time)} text-xl font-bold`}>
              0:{String(time).padStart(2, "0")}
            </strong>
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 text-sm text-style-neutral-400">
        
        {/* Difficulty / Novel — Select on mobile, ToggleGroup on md+ */}
        {isNovelMode ? (
          <Select
            value={selectedNovel.id}
            onValueChange={(val) => {
              const novel = novels.find((n) => n.id === val)!;
              onNovelChange(novel);
            }}
          >
            <SelectTrigger className="bg-transparent border-style-neutral-500 text-style-neutral-0 text-sm w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-style-neutral-800 border-style-neutral-500">
              {novels.map((novel) => (
                <SelectItem key={novel.id} value={novel.id} className="text-style-neutral-0 cursor-pointer">
                  {novel.title} — {novel.author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <>
            {/* Mobile: Select */}
            <Select
              value={difficulty}
              onValueChange={(val) => onDifficultyChange(val as DifficultyOption)}
            >
              <SelectTrigger className="md:hidden bg-transparent border-style-neutral-500 text-style-neutral-0 text-sm w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-style-neutral-800 border-style-neutral-500">
                {DifficultyOptions.map((d) => (
                  <SelectItem key={d.value} value={d.value} className="text-style-neutral-0 cursor-pointer">
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Desktop: ToggleGroup */}
            <div className="hidden md:flex items-center gap-2">
              <span>Difficulty:</span>
              <ToggleGroup
                type="single"
                value={difficulty}
                variant="outline"
                spacing={2}
                onValueChange={(val) => val && onDifficultyChange(val as DifficultyOption)}
              >
                {DifficultyOptions.map((d) => (
                  <ToggleGroupItem
                    key={d.value}
                    value={d.value}
                    className={`bg-transparent! ${
                      difficulty === d.value
                        ? "text-style-blue-400! border border-style-blue-400"
                        : "text-style-neutral-400 hover:bg-transparent hover:text-style-neutral-0"
                    }`}
                  >
                    {d.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </>
        )}

        {/* Mode — same pattern */}
        <>
          {/* Mobile: Select */}
          <Select
            value={mode}
            onValueChange={(val) => onModeChange(val as Mode)}
          >
            <SelectTrigger className="md:hidden bg-transparent border-style-neutral-500 text-style-neutral-0 text-sm w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-style-neutral-800 border-style-neutral-500">
              {Modes.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-style-neutral-0 cursor-pointer">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Desktop: ToggleGroup */}
          <div className="hidden md:flex items-center gap-2">
            <span>Mode:</span>
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(val) => val && onModeChange(val as Mode)}
            >
              {Modes.map((m) => (
                <ToggleGroupItem
                  key={m.value}
                  value={m.value}
                  className={`bg-transparent! ${
                    mode === m.value
                      ? "text-style-blue-400! border border-style-blue-400"
                      : "text-style-neutral-400 hover:bg-transparent hover:text-style-neutral-0"
                  }`}
                >
                  {m.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </>

      </div>
    </div>
  );
}

