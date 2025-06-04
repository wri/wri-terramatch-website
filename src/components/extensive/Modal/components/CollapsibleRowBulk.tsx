import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Text from "@/components/elements/Text/Text";

interface CollapsibleRowBulkProps {
  item: any;
}

const CollapsibleRowBulk = (props: CollapsibleRowBulkProps) => {
  const { item } = props;
  return (
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
          <Checkbox name="" />
        </div>
      </div>
    </div>
  );
};

export default CollapsibleRowBulk;
