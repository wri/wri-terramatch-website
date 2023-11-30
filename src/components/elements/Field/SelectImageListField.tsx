import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import SelectImageList, { SelectImageListProps } from "@/components/elements/SelectImageList/SelectImageList";
import Text from "@/components/elements/Text/Text";
import { Option } from "@/types/common";

export interface SelectImageListFieldProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    SelectImageListProps {
  title: string;
  options: Option[];
  selectedValues: string[];
}

const SelectImageListField: FC<SelectImageListFieldProps> = ({ title, options, selectedValues, ...rest }) => {
  return (
    <div {...rest}>
      <Text variant="text-bold-subtitle-400" className="mb-2">
        {title}
      </Text>
      {selectedValues?.length > 0 ? (
        <SelectImageList options={options} selectedValues={selectedValues} selectable={false} />
      ) : (
        <Text variant="text-light-subtitle-400" className="mb-2">
          N/A
        </Text>
      )}
    </div>
  );
};

export default SelectImageListField;
