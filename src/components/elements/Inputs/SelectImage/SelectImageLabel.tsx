import classNames from "classnames";

import Text from "@/components/elements/Text/Text";

type SelectImageLabelProps = {
  isSelected?: boolean;
  title: string;
  imageUrl?: string;
};

const SelectImageLabel = (props: SelectImageLabelProps) => {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-2">
      <div
        className={classNames(
          "aspect-square h-24 rounded-lg border-4 border-neutral-900  bg-cover bg-center transition-all duration-200",
          {
            "border-primary-500": props.isSelected
          }
        )}
        style={{
          backgroundImage: `url('${props.imageUrl}')`
        }}
      ></div>
      <Text variant="text-body-400" className="max-w-[96px] text-center leading-4">
        {props.title}
      </Text>
    </div>
  );
};

export default SelectImageLabel;
