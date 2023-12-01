import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import LinerProgressbar from "@/components/elements/ProgressBar/LinerProgressbar/LinerProgressbar";
import Text from "@/components/elements/Text/Text";

import BaseField from "./BaseField";

export interface ProgressFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: string;
  value: number;
  limit: number;
}

const ProgressField: FC<ProgressFieldProps> = ({ label, value: _val, limit: _limit, className, ...rest }) => {
  const value = _val || 0;
  const limit = _limit || 0;

  return (
    <BaseField {...rest} className={className}>
      <div className="flex items-center justify-between">
        <Text variant="text-bold-subtitle-500">{label}</Text>
        <div className="w-25">
          <Text variant="text-light-subtitle-400">
            {value}/{limit}
          </Text>
          <LinerProgressbar value={limit ? (value / limit) * 100 : 0} />
        </div>
      </div>
    </BaseField>
  );
};

export default ProgressField;
