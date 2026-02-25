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

    // Scroll the container (not the page) so cursor stays visible
    const containerTop = container.getBoundingClientRect().top;
    const cursorTop = cursor.getBoundingClientRect().top;
    const offset = cursorTop - containerTop;

    // Only scroll if cursor is outside the visible area of the container
    if (offset > container.clientHeight - 40 || offset < 0) {
      container.scrollTop += offset - container.clientHeight / 2;
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
              className={`${colorClass} ${isCursor ? "border-b-2 border-blue-400" : ""}`}
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
            onClick={()=> onReset()}
          >
            Restart Test
            <RefreshCcwIcon className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}