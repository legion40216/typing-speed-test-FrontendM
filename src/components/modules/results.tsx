import iconCompleted from "../../assets/icon-completed.svg";
import { RefreshCcwIcon } from "lucide-react";
import { Button } from "../ui/button";

interface ResultsProps {
  wpm: number;
  accuracy: number;
  timeTaken: number;
  correctChars: number;
  incorrectChars: number;
  onReset: () => void;
}

export default function Results({
  wpm,
  accuracy,
  timeTaken,
  correctChars,
  incorrectChars,
  onReset
}: ResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-20">
      <div className="flex flex-col items-center space-y-4">
        <img src={iconCompleted} alt="Test completed" />
        <h1 className="text-4xl font-bold mt-4 text-style-neutral-0">
          Test Completed!
        </h1>
        <p className="text-2xl text-style-neutral-400">
          Solid run, keep pusing to beat your high score!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-style-neutral-400">
        <div
          className="flex flex-col border border-style-neutral-400 rounded-lg p-4 aspect-video
              text-style-neutral-400"
        >
          <h2>WPM</h2>
          <p className="text-style-neutral-0 font-bold">{wpm}</p>
        </div>

        <div className="flex flex-col border border-style-neutral-400 rounded-lg p-4 aspect-video">
          <h2>Accuracy</h2>
          <p
            className={`font-bold ${accuracy >= 90 ? "text-style-green-500" : "text-style-red-500"}`}
          >
            {accuracy.toFixed(2)}%
          </p>
        </div>

        <div className="flex flex-col border border-style-neutral-400 rounded-lg p-4 aspect-video">
          <h2>Characters</h2>
          <p className="font-bold">
            <span className="text-style-green-500">{correctChars}</span>
            <span className="text-style-neutral-400">/</span>
            <span className="text-style-red-500">{incorrectChars}</span>
          </p>
        </div>

        <div className="flex flex-col border border-style-neutral-400 rounded-lg p-4 aspect-video">
          <h2>Time</h2>
          <p className="text-style-neutral-0 font-bold">{timeTaken}s</p>
        </div>
      </div>

      <div>
        <Button
          className="font-extrabold"
          onClick={onReset}
          variant={"secondary"}
        >
          Go Again
          <RefreshCcwIcon className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
