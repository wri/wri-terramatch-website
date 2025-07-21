import React from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface TrashButtonProps {
  onClick: () => void;
  className?: string;
}

const TrashButton: React.FC<TrashButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      type="button"
      className={`text-red-500 hover:bg-red-50 hover:text-red-600 shadow-md rounded-lg bg-white p-2.5 transition-colors duration-200 ${className}`}
      onClick={onClick}
      title="Delete polygon"
    >
      <Icon name={IconNames.TRASH_PA} className="h-5 w-5 lg:h-6 lg:w-6" />
    </button>
  );
};

export default TrashButton;
