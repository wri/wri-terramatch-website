import { ReactNode } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

type TreeSpeciesModalProps = {
  title: string;
  content: string;
  buttons: ReactNode;
};

const TreeSpeciesModal = ({ title, content, buttons }: TreeSpeciesModalProps) => (
  <div className="margin-4 z-50 m-auto flex max-h-full flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white">
    <div className="flex w-full items-center justify-center gap-1 border-b-2 border-neutral-100 py-1">
      <Icon name={IconNames.EXCLAMATION_CIRCLE_FILL} className="mb-1 h-4 min-h-4 w-4 min-w-4 text-tertiary-600" />
      <Text variant="text-16-semibold" className="mb-1 text-blueCustom-700">
        {title}
      </Text>
    </div>
    <div className="w-full p-4">
      <div className="w-full rounded-lg border border-dashed bg-neutral-250 p-2">
        <div className="flex items-center gap-1">
          <Text variant="text-14-light" className="text-blueCustom-700">
            {content}
          </Text>
        </div>
      </div>
      <div className="mt-4 flex w-full justify-end gap-3">{buttons}</div>
    </div>
  </div>
);

export default TreeSpeciesModal;
