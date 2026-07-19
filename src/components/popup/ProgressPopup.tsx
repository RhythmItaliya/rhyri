import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface ProgressPopupProps {
  progress: string | null;
}

const ProgressPopup: React.FC<ProgressPopupProps> = ({ progress }) => {
  const { theme } = useTheme();
  if (!progress) return null;

  const isDarkTheme = theme === "dark";

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2 select-none">
      <div
        className={`w-[min(420px,calc(100vw-2rem))] rounded-md border px-4 py-3 shadow-lg ${
          isDarkTheme
            ? "border-white/10 bg-black text-white"
            : "border-border bg-white text-black"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{progress}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPopup;
