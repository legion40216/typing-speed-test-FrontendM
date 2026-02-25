import { useEffect, useRef, useState, useCallback } from "react";
import data from "./data/data.json";
import type {
  DifficultyOption,
  GameState,
  Mode,
  ResultState,
} from "./data/constants";
import novelsData from "./data/novels.json";
import type { NovelEntry } from "./data/constants";

import Navbar from "./components/modules/navbar";
import ResultsBaseline from "./components/modules/results-baseline";
import ResultsPersonalBest from "./components/modules/results-personal_best";
import Results from "./components/modules/results";
import TypingSection from "./components/modules/typing-section";

const TIMER_DURATION = 60;

function getRandomPassage(difficulty: DifficultyOption): string {
  const key = difficulty.toLowerCase() as keyof typeof data;
  const list = data[key];
  return list[Math.floor(Math.random() * list.length)].text;
}

function calcWpm(
  typedText: string,
  passage: string,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds === 0) return 0;
  const correctChars = typedText
    .split("")
    .filter((char, i) => char === passage[i]).length;
  const minutes = elapsedSeconds / 60;
  return Math.round(correctChars / 5 / minutes);
}

function calcAccuracy(typedText: string, passage: string): number {
  if (typedText.length === 0) return 100;
  const correctChars = typedText
    .split("")
    .filter((char, i) => char === passage[i]).length;
  return Math.round((correctChars / typedText.length) * 100);
}

export default function App() {
  const [difficulty, setDifficulty] = useState<DifficultyOption>("easy");
  const [mode, setMode] = useState<Mode>("timed");
  const [passage, setPassage] = useState(() => getRandomPassage("easy"));
  const [typedText, setTypedText] = useState("");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [time, setTime] = useState(TIMER_DURATION);
  const [resultState, setResultState] = useState<ResultState>("normal");
  const [personalBest, setPersonalBest] = useState<number>(() =>
    Number(localStorage.getItem("personalBest") ?? 0),
  );
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Tracks latest typedText synchronously to avoid stale closures ─────────
  const typedTextRef = useRef("");
  // ── Prevents double-fire when physical keyboard triggers both window keydown + onInput ──
  const lastKeyWasPhysical = useRef(false);

  const [isNovelMode, setIsNovelMode] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState<NovelEntry>(
    novelsData.novels[0] as NovelEntry,
  );

  // ── Reset everything ──────────────────────────────────────────────────────
  const reset = useCallback(
    (newDifficulty: DifficultyOption = difficulty, shouldFocus = true) => {
      // 👈 add param
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = null;
      startTimeRef.current = null;
      typedTextRef.current = "";
      lastKeyWasPhysical.current = false;
      setTypedText("");
      setGameState("idle");
      setWpm(0);
      setAccuracy(100);
      setTime(TIMER_DURATION);
      setResultState("normal");
      setCorrectChars(0);
      setIncorrectChars(0);
      setTimeTaken(0);
      setPassage((currentPassage) =>
        isNovelMode ? currentPassage : getRandomPassage(newDifficulty),
      );
      if (shouldFocus) {
        // 👈 guard focus
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [difficulty, isNovelMode],
  );

  const handleDifficultyChange = (d: DifficultyOption) => {
    setDifficulty(d);
    reset(d);
  };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    reset();
  };

  // ── Finish the game ───────────────────────────────────────────────────────
  const finish = useCallback(
    (finalWpm: number, correct: number, incorrect: number) => {
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = null;
      setGameState("finished");

      const elapsed = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : 0;
      setTimeTaken(elapsed);
      setCorrectChars(correct);
      setIncorrectChars(incorrect);

      const hasPlayed = localStorage.getItem("hasPlayed") === "true";
      const prevBest = Number(localStorage.getItem("personalBest") ?? 0);

      if (!hasPlayed) {
        setResultState("baseline");
        setPersonalBest(finalWpm);
        localStorage.setItem("hasPlayed", "true");
        localStorage.setItem("personalBest", String(finalWpm));
      } else if (finalWpm > prevBest) {
        setResultState("personal-best");
        setPersonalBest(finalWpm);
        localStorage.setItem("personalBest", String(finalWpm));
      } else {
        setResultState("normal");
      }
    },
    [],
  );

  // ── Core typing logic ─────────────────────────────────────────────────────
  const processTyping = useCallback(
    (next: string) => {
      if (gameState === "idle") {
        setGameState("typing");
        startTimeRef.current = Date.now();
        if (mode === "timed") {
          timerRef.current = setInterval(() => {
            setTime((prev) => (prev <= 1 ? 0 : prev - 1));
          }, 1000);
        }
      }

      const elapsed = startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000
        : 0;
      const newWpm = calcWpm(next, passage, elapsed);
      const newAccuracy = calcAccuracy(next, passage);
      setWpm(newWpm);
      setAccuracy(newAccuracy);
      typedTextRef.current = next;
      setTypedText(next);

      if (next === passage) {
        const correct = next
          .split("")
          .filter((c, i) => c === passage[i]).length;
        finish(newWpm, correct, next.length - correct);
      }
    },
    [gameState, mode, passage, finish],
  );

  // ── Desktop: physical keyboard via window listener ────────────────────────
  const handleWindowKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState === "finished") return;
      let next: string;
      if (e.key === "Backspace") {
        next = typedTextRef.current.slice(0, -1);
      } else if (e.key.length === 1) {
        next = typedTextRef.current + e.key;
      } else {
        return;
      }
      lastKeyWasPhysical.current = true;
      processTyping(next);
    },
    [gameState, processTyping],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [handleWindowKeyDown]);

  // ── Mobile: backspace on hidden input ────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (gameState === "finished") return;
      if (e.key === "Backspace") {
        e.preventDefault();
        // If physical keyboard flagged this, it's already handled
        if (lastKeyWasPhysical.current) {
          lastKeyWasPhysical.current = false;
          return;
        }
        processTyping(typedTextRef.current.slice(0, -1));
      }
    },
    [gameState, processTyping],
  );

  // ── Mobile: character input via IME / virtual keyboard ───────────────────
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (gameState === "finished") return;
      // Physical keyboard already handled this keystroke via window listener
      if (lastKeyWasPhysical.current) {
        lastKeyWasPhysical.current = false;
        e.currentTarget.value = "";
        return;
      }
      const value = e.currentTarget.value;
      if (!value) return;
      e.currentTarget.value = "";
      processTyping(typedTextRef.current + value);
    },
    [gameState, processTyping],
  );

  // ── Watch timer hit zero (timed mode) ─────────────────────────────────────
  useEffect(() => {
    if (mode === "timed" && time === 0 && gameState === "typing") {
      const elapsed = startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000
        : TIMER_DURATION;
      const finalWpm = calcWpm(typedText, passage, elapsed);
      const correct = typedText
        .split("")
        .filter((c, i) => c === passage[i]).length;
      finish(finalWpm, correct, typedText.length - correct);
    }
  }, [time, mode, gameState, typedText, passage, finish]);

  // ── Focus the hidden input on mount ──────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Cleanup timer on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  const startGame = useCallback(() => {
    setGameState("typing");
    startTimeRef.current = Date.now();
    inputRef.current?.focus();

    if (mode === "timed") {
      timerRef.current = setInterval(() => {
        setTime((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
  }, [mode]);

  const handleClearPersonalBest = useCallback(() => {
    localStorage.removeItem("personalBest");
    localStorage.removeItem("hasPlayed");
    setPersonalBest(0);
    setGameState("idle");
    reset();
  }, [reset]);

  const novels = novelsData.novels as NovelEntry[];

  const handleToggleNovelMode = useCallback(() => {
    setIsNovelMode((prev) => {
      const next = !prev;
      if (next) {
        setPassage(novels[0].text.trim());
        setSelectedNovel(novels[0]);
      } else {
        setPassage(getRandomPassage(difficulty));
      }
      reset(difficulty, false); // 👈 skip focus
      return next;
    });
  }, [difficulty, reset]);

  const handleNovelChange = useCallback(
    (novel: NovelEntry) => {
      setSelectedNovel(novel);
      setPassage(novel.text.trim());
      reset(difficulty, false); // 👈 skip focus
    },
    [reset, difficulty],
  );

  return (
    <div className="min-h-screen bg-neutral-900">
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onChange={handleInput}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        aria-hidden="true"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        readOnly={gameState === "finished"}
      />

      <div className="container mx-auto px-6">
        <header className="py-6">
          <Navbar
            personalBest={personalBest}
            onClearPersonalBest={handleClearPersonalBest}
            isNovelMode={isNovelMode}
            onToggleNovelMode={handleToggleNovelMode}
          />
        </header>

        <main>
          {gameState !== "finished" && (
            <TypingSection
              wpm={wpm}
              accuracy={accuracy}
              time={time}
              difficulty={difficulty}
              mode={mode}
              passage={passage}
              typedText={typedText}
              gameState={gameState}
              onDifficultyChange={handleDifficultyChange}
              onModeChange={handleModeChange}
              onReset={reset}
              onStart={startGame}
              isNovelMode={isNovelMode}
              novels={novels}
              selectedNovel={selectedNovel}
              onNovelChange={handleNovelChange}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
            />
          )}

          {gameState === "finished" && resultState === "baseline" && (
            <ResultsBaseline
              wpm={wpm}
              accuracy={accuracy}
              timeTaken={timeTaken}
              correctChars={correctChars}
              incorrectChars={incorrectChars}
              onReset={() => reset()}
            />
          )}

          {gameState === "finished" && resultState === "personal-best" && (
            <ResultsPersonalBest
              wpm={wpm}
              accuracy={accuracy}
              timeTaken={timeTaken}
              correctChars={correctChars}
              incorrectChars={incorrectChars}
              onReset={() => reset()}
            />
          )}

          {gameState === "finished" && resultState === "normal" && (
            <Results
              wpm={wpm}
              accuracy={accuracy}
              timeTaken={timeTaken}
              correctChars={correctChars}
              incorrectChars={incorrectChars}
              onReset={() => reset()}
            />
          )}
        </main>
      </div>
    </div>
  );
}
