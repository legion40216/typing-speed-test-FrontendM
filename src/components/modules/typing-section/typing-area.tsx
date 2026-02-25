// components/modules/typing-section/typing-area.tsx
import { Button } from "@/components/ui/button";
import type { GameState } from "@/data/constants";
import PassageDisplay from "./typing-area/passage-display";

interface TypingAreaProps {
  passage: string;
  typedText: string;
  gameState: GameState;
  onStart: () => void;
  onReset: () => void;
}

export default function TypingArea({ 
  passage, 
  typedText, 
  gameState,
  onStart,
  onReset,
}: TypingAreaProps) {

if (gameState === "idle") {
    return (
      <div className="relative" onClick={onStart}>
        <div className="blur pointer-events-none select-none">
          <PassageDisplay 
            passage={passage} 
            typedText={typedText} 
            onReset={onReset}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-style-neutral-0">
            <Button
              className="bg-style-blue-600 hover:bg-style-blue-400/90"
            >
              Start Typing Test
            </Button>
            <p className="text-sm mt-2">Click here or start typing to begin the test</p>
          </div>
        </div>
      </div>
    );
  }

  return <PassageDisplay 
            passage={passage} 
            typedText={typedText} 
            onReset={onReset}
         />;
}
