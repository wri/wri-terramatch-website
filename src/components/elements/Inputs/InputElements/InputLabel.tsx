import { useT } from "@transifex/react";
import classNames from "classnames";
import { HTMLProps } from "react";
import { When } from "react-if";

import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";

export interface InputLabelProps extends HTMLProps<HTMLLabelElement> {
  required?: boolean;
  children?: string | number;
  feedbackRequired?: boolean;
}

const InputLabel = (props: InputLabelProps) => {
  const t = useT();
  const { feedbackRequired, required, children, className, ...labelProps } = props;

  return (
    <When condition={!!props.children}>
      <Text<HTMLLabelElement>
        {...labelProps}
        as="label"
        variant="text-bold-body-300"
        className={classNames("mr-2 inline uppercase", className)}
      >
        {`${children} ${required ? "*" : ""}`}
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
