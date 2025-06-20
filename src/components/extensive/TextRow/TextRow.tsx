import cn from "classnames";
import classNames from "classnames";

import Text from "@/components/elements/Text/Text";
import { TextVariants } from "@/types/common";

export type TextRowProps = {
  name: string;
  nameVariant?: TextVariants;
  nameClassName?: string;
  value?: string | number;
  valueVariant?: TextVariants;
  valueClassName?: string;
  className?: string;
};

const TextRow = ({
  name,
  nameVariant = "text-body-900",
  nameClassName,
  value,
  valueVariant = "text-body-800",
  valueClassName,
  className
}: TextRowProps) => {
  return (
    <div className={cn("flex gap-2", { className })}>
      <Text as="span" variant={nameVariant} className={nameClassName}>
        {name}
      </Text>
      <Text as="span" variant={valueVariant} className={classNames(valueClassName, "flex-1")}>
        {value ?? "-"}
      </Text>
    </div>
  );
};

export default TextRow;
