import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';

interface ProgressPopupProps {
  progress: string | null;
  onClose: () => void;
}

const ProgressPopup: React.FC<ProgressPopupProps> = ({ progress, onClose }) => {
  if (!progress) return null;

  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className={`p-4 rounded shadow-lg max-w-md w-full ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center p-2">
          <p>{progress}</p>
          <Button
            type="button"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressPopup;