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
      className={`hover:text-red-600 shadow-md rounded-sm border border-neutral-175 bg-white p-2.5 transition-colors duration-200 hover:bg-neutral-200 ${className} text-darkCustom-100`}
      onClick={onClick}
      title="Delete vertex of polygon"
    >
      <Icon name={IconNames.TRASH_PA} className="h-5 w-5 lg:h-6 lg:w-6" />
    </button>
  );
};

export default TrashButton;
