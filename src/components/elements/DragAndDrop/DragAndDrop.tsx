import { ReactNode } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface DragAndDropProps {
  description: ReactNode;
}

const DragAndDrop = (props: DragAndDropProps) => {
  return (
    <div className="mb-8 flex flex-col items-center justify-center rounded-lg border border-grey-750 py-8">
      <Icon name={IconNames.UPLOAD_CLOUD} className="mb-4 h-5 w-5" />
      <div className="flex flex-col">{props.description}</div>
    </div>
  );
};

export default DragAndDrop;
