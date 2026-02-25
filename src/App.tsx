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

  const [isNovelMode, setIsNovelMode] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState<NovelEntry>(
    novelsData.novels[0] as NovelEntry,
  );

  // ── Reset everything ──────────────────────────────────────────────────────
  const reset = useCallback(
    (newDifficulty: DifficultyOption = difficulty) => {
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = null;
      startTimeRef.current = null;
      setTypedText("");
      setGameState("idle");
      setWpm(0);
      setAccuracy(100);
      setTime(TIMER_DURATION);
      setResultState("normal");
      setCorrectChars(0);
      setIncorrectChars(0);
      setTimeTaken(0);
      // only pick a new random passage if NOT in novel mode
      setPassage((currentPassage) =>
        isNovelMode ? currentPassage : getRandomPassage(newDifficulty),
      );
    },
    [difficulty, isNovelMode],
  );

  // ── Handle difficulty change ──────────────────────────────────────────────
  const handleDifficultyChange = (d: DifficultyOption) => {
    setDifficulty(d);
    reset(d);
  };

  // ── Handle mode change ────────────────────────────────────────────────────
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

  // ── Keydown handler ───────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState === "finished") return;

      if (gameState === "idle" && e.key.length === 1) {
        setGameState("typing");
        startTimeRef.current = Date.now();

        if (mode === "timed") {
          timerRef.current = setInterval(() => {
            setTime((prev) => {
              if (prev <= 1) return 0;
              return prev - 1;
            });
          }, 1000);
        }
      }

      setTypedText((prev) => {
        let next: string;
        if (e.key === "Backspace") {
          next = prev.slice(0, -1);
        } else if (e.key.length === 1) {
          next = prev + e.key;
        } else {
          return prev;
        }

        const elapsed = startTimeRef.current
          ? (Date.now() - startTimeRef.current) / 1000
          : 0;
        const newWpm = calcWpm(next, passage, elapsed);
        const newAccuracy = calcAccuracy(next, passage);
        setWpm(newWpm);
        setAccuracy(newAccuracy);

        if (next === passage) {
          // ← remove the mode check
          const correct = next
            .split("")
            .filter((c, i) => c === passage[i]).length;
          finish(newWpm, correct, next.length - correct);
        }

        return next;
      });
    },
    [gameState, mode, passage, finish],
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

  // ── Attach / detach keydown listener ─────────────────────────────────────
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Cleanup timer on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  const startGame = useCallback(() => {
    setGameState("typing");
    startTimeRef.current = Date.now();

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

  // toggle handler
  const handleToggleNovelMode = useCallback(() => {
    setIsNovelMode((prev) => {
      const next = !prev;
      if (next) {
        // switching INTO novel mode — use first novel
        setPassage(novels[0].text.trim());
        setSelectedNovel(novels[0]);
      } else {
        // switching OUT — go back to difficulty-based
        setPassage(getRandomPassage(difficulty));
      }
      reset();
      return next;
    });
  }, [difficulty, reset]);

  // novel selection handler
  const handleNovelChange = useCallback(
    (novel: NovelEntry) => {
      setSelectedNovel(novel);
      setPassage(novel.text.trim());
      reset();
    },
    [reset],
  );

  return (
    <div className="min-h-screen bg-neutral-900">
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
          {/* ── Typing area: shown while idle or actively typing ── */}
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
            />
          )}

          {/* ── Result screens ── */}
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
