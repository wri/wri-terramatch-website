import { useT } from "@transifex/react";
import classNames from "classnames";
import { isNumber } from "lodash";
import { HTMLProps } from "react";
import { When } from "react-if";

import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { TextVariants } from "@/types/common";

export interface InputLabelProps extends HTMLProps<HTMLLabelElement> {
  required?: boolean;
  children?: string | number;
  feedbackRequired?: boolean;
  labelVariant?: TextVariants;
  suffixLabelView?: boolean;
}

const InputLabel = (props: InputLabelProps) => {
  const t = useT();
  const {
    feedbackRequired,
    required,
    children,
    className,
    labelVariant,
    suffixLabelView = true,
    ...labelProps
  } = props;

  return (
    <When condition={!!props.children}>
      <Text<HTMLLabelElement>
        {...labelProps}
        as="label"
        variant={labelVariant ?? "text-bold-body-300"}
        className={classNames("mr-2 inline uppercase", className)}
      >
        {`${isNumber(children) ? children : t(children)} ${required && suffixLabelView ? "*" : ""}`}
      </Text>

      <When condition={feedbackRequired}>
        <StatusPill status="warning" className="inline-flex w-fit">
          <Text variant="text-bold-caption-100">{t("More Info Requested")}</Text>
        </StatusPill>
      </When>
    </When>
  );
};

export default InputLabel;
