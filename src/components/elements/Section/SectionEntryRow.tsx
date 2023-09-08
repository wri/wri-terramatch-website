import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Text from "@/components/elements/Text/Text";

interface SectionEntryRowProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  title: string;
  isEmpty?: boolean;
}

const SectionEntryRow = ({ title, isEmpty, children, className, ...divProps }: SectionEntryRowProps) => {
  const t = useT();
  return (
    <div {...divProps} className={classNames(className, "flex first-letter:uppercase")}>
      <Text variant="text-heading-300" className="flex-[2] pr-4.5">
        {title}
      </Text>
      <div className="flex-[3] space-y-8">
        {isEmpty ? <Text variant="text-heading-100">{t("Not provided")}</Text> : children}
      </div>
    </div>
  );
};

export default SectionEntryRow;
