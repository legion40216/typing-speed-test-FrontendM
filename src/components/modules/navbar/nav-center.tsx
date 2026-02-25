import { BookOpen } from "lucide-react";

interface NavCenterProps {
  isNovelMode: boolean;
  onToggleNovelMode: () => void;
}

export default function NavCenter({ isNovelMode, onToggleNovelMode }: NavCenterProps) {
  return (
    <button
      onClick={onToggleNovelMode}
      className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors
        ${isNovelMode
          ? "bg-amber-500 text-neutral-900 font-semibold"
          : "text-neutral-400 hover:text-white"
        }`}
    >
      <BookOpen size={16} />
      Novels
    </button>
  );
}