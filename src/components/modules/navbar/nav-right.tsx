import ConfirmModal from "@/components/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trophy, Trash2 } from "lucide-react";

interface NavRightProps {
  personalBest: number;
  onClearPersonalBest: () => void;
}

export default function NavRight({
  personalBest,
  onClearPersonalBest,
}: NavRightProps) {
  return (
    <div className="flex items-center gap-2">
      <Trophy size={20} className="text-style-yellow-400" />
      <span className="text-style-neutral-400 text-sm">
        Personal best:{" "}
        <span className="text-style-neutral-0">{personalBest} WPM</span>
      </span>
      {personalBest > 0 ? (
        <>
          <ConfirmModal onConfirm={onClearPersonalBest}>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-style-neutral-500 hover:text-style-red-500"
              title="Clear personal best"
            >
              <Trash2 size={14} />
            </Button>
          </ConfirmModal>
        </>
      ) : null}
    </div>
  );
}
