// components/modules/typing-section/typing-area/passage-display.tsx
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCcwIcon } from "lucide-react";

interface PassageDisplayProps {
  passage: string;
  typedText: string;
  onReset: () => void;
}

export default function PassageDisplay({
  passage,
  typedText,
  onReset,
}: PassageDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container || !cursor) return;

    // 1. Scroll the INTERNAL container so cursor stays visible within the box
    const containerRect = container.getBoundingClientRect();
    const cursorRect = cursor.getBoundingClientRect();
    const offset = cursorRect.top - containerRect.top;

    if (offset > container.clientHeight - 40 || offset < 0) {
      container.scrollTop += offset - container.clientHeight / 2;
    }

    // 2. Scroll the WINDOW so the container/cursor stays above the mobile keyboard
    // window.visualViewport.height gets the true screen height excluding the keyboard
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    
    // Check if the cursor is hidden behind the keyboard (within 40px of the bottom)
    if (cursorRect.bottom > viewportHeight - 40) {
      window.scrollBy({
        top: cursorRect.bottom - viewportHeight + 100, // 100px of breathing room
        behavior: "smooth",
      });
    }
  }, [typedText]);

  return (
    <div>
      {/* Fixed height container — scrolls internally, page stays still */}
      <div
        ref={containerRef}
        className="relative text-2xl leading-relaxed py-6 cursor-text focus:outline-none overflow-y-auto h-64"
        tabIndex={0}
      >
        {passage.split("").map((char, index) => {
          let colorClass = "text-neutral-500";
          if (index < typedText.length) {
            colorClass =
              typedText[index] === char ? "text-green-500" : "text-red-500";
          }
          const isCursor = index === typedText.length;

          return (
            <span
              key={index}
              ref={isCursor ? cursorRef : null}
              className={`${colorClass} ${
                isCursor ? "border-b-2 border-blue-400" : ""
              }`}
            >
              {char}
            </span>
          );
        })}
      </div>

      <div>
        <Separator className="my-6 bg-neutral-500" />
        <div className="flex justify-center">
          <Button
            className="bg-neutral-800 hover:bg-neutral-800/90 font-extrabold"
            onClick={() => onReset()}
          >
            Restart Test
            <RefreshCcwIcon className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}