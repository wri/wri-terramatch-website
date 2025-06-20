import { DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren } from "react";

import ReadMoreText from "@/components/elements/ReadMoreText/ReadMoreText";
import Text from "@/components/elements/Text/Text";
import { withFrameworkShow } from "@/context/framework.provider";

export interface LongTextFieldProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  title: string;
}

const LongTextField: FC<LongTextFieldProps> = ({ title, children, ...rest }) => (
  <div {...rest}>
    <Text variant="text-bold-subtitle-400" className="mb-2">
      {title}
    </Text>
    <ReadMoreText variant="text-light-subtitle-400" defaultVisibleLinesNumber={3}>
      {children || "N/A"}
    </ReadMoreText>
  </div>
);

export default withFrameworkShow(LongTextField);
