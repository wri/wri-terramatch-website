import classNames from "classnames";

import Text from "@/components/elements/Text/Text";

type SelectImageLabelProps = {
  variant?: "primary" | "secondary";
  isSelected?: boolean;
  title?: string;
  imageUrl?: string;
  clickable?: boolean;
};

const SelectImageLabel = ({ variant = "primary", clickable = true, ...props }: SelectImageLabelProps) => {
  return (
    <div className={classNames("flex flex-col items-center gap-2", clickable && "cursor-pointer")}>
      <div
        className={classNames(
          variant === "primary" && "border-4 border-neutral-900",
          "aspect-square h-[6.375rem] rounded-lg bg-cover bg-center transition-all duration-200",
          {
            "border-primary-500": props.isSelected
          }
        )}
        style={{
          backgroundImage: `url('${props.imageUrl}')`
        }}
      ></div>
      {props.title && (
        <Text variant="text-light-body-300" className="max-w-[96px] text-center leading-4">
          {props.title}
        </Text>
      )}
    </div>
  );
};

export default SelectImageLabel;
