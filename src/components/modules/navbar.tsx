import NavLeft from "./navbar/nav-left";
import NavCenter from "./navbar/nav-center";
import NavRight from "./navbar/nav-right";

interface NavbarProps {
  personalBest: number;
  onClearPersonalBest: () => void;
  isNovelMode: boolean;
  onToggleNovelMode: () => void;
}

export default function Navbar({ 
  personalBest, 
  onClearPersonalBest, 
  isNovelMode, 
  onToggleNovelMode 
}: NavbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <NavLeft />

      <NavCenter isNovelMode={isNovelMode} onToggleNovelMode={onToggleNovelMode} />
      
      <NavRight personalBest={personalBest} onClearPersonalBest={onClearPersonalBest} />
    </div>
  );
}