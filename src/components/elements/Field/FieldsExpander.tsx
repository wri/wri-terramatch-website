import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface FieldsExpanderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  expanded?: boolean;
  children: ReactNode;
}

const FieldsExpander: FC<FieldsExpanderProps> = ({ title, expanded, children, className, ...rest }) => {
  const [open, setOpen] = useState<boolean>(!!expanded);

  const handleToggle = () => {
    setOpen(state => !state);
  };

  return (
    <div {...rest} className={className}>
      <div className="mb-2 flex items-center justify-between rounded-lg bg-primary-100 p-4">
        <Text variant="text-bold-subtitle-500">{title}</Text>

        <button onClick={handleToggle}>
          <Icon
            name={IconNames.CHEVRON_DOWN}
            width={16}
            className={`transform transition-all duration-300 ${open ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      </div>

      {open && <div className="flex flex-col space-y-2">{children}</div>}
    </div>
  );
};

export default FieldsExpander;
