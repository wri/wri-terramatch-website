import { FC } from "react";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Text from "@/components/elements/Text/Text";

interface CollapsibleRowBulkProps {
  item: any;
  selected: boolean;
  onSelect: (id: string, selected: boolean, type: string, dateSubmitted: string, name: string) => void;
}

const CollapsibleRowBulk: FC<CollapsibleRowBulkProps> = ({ item, selected, onSelect }) => (
  <div className="flex flex-col border-b border-grey-750 px-4 py-2 last:border-0">
    <div className="flex items-center ">
      <Text variant="text-12" className="flex-[2]">
        {item.name}
      </Text>

      <Text variant="text-12" className="flex-1">
        {item.type}
      </Text>
      <Text variant="text-12" className="flex-1">
        {item.dateSubmitted}
      </Text>
      <div className="flex flex-1 items-center justify-center">
        <Checkbox
          name=""
          checked={selected}
          onClick={() => onSelect(item.id, !selected, item.type, item.dateSubmitted, item.name)}
        />
      </div>
    </div>
  </div>
);

export default CollapsibleRowBulk;
