// components/modules/typing-section/typing-area/passage-display.tsx
import React from "react";

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
  return (
  <div>
    <div
      className="relative text-2xl leading-relaxed py-6 
       cursor-text focus:outline-none h-full overflow-y-auto"
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
            className={`${colorClass} ${isCursor ? "border-b-2 border-blue-400" : ""}`}
          >
            {char}
          </span>
        );
      })}
    </div>

    <div className="">
      <Separator className="my-6 bg-neutral-500" />

      <div className="flex justify-center">
        <Button
          className="bg-neutral-800 hover:bg-neutral-800/90 font-extrabold"
          onClick={onReset}
        >
          Restart Test
          <RefreshCcwIcon className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  </div>
  );
}
