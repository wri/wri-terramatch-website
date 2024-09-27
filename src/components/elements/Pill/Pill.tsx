import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import { Colors } from "@/types/common";

export interface PillProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  textColor?: Colors;
  children: string | number;
}

const Pill = ({ children, className, textColor = "black", ...props }: PillProps) => {
  return (
    <div
      {...props}
      className={classNames(
        className,
        "flex items-center justify-center rounded-2xl px-3 py-0.5 first-letter:uppercase"
      )}
    >
      <Text variant="text-bold-caption-200" className={classNames(`text-${textColor}`, "flex h-fit items-center")}>
        {children}
      </Text>
    </div>
  );
};

export default Pill;
