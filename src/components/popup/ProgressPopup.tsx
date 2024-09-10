import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ProgressPopupProps {
  progress: string | null;
}

const ProgressPopup: React.FC<ProgressPopupProps> = ({ progress }) => {
  if (!progress) return null;

  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm select-none cursor-pointer">
      <div className={`p-4 rounded shadow-lg max-w-md w-full ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center p-2">
          <p>{progress}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPopup;