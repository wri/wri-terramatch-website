import { T, useT } from "@transifex/react";
import { useMemo } from "react";

import LinerProgressbar from "@/components/elements/ProgressBar/LinerProgressbar/LinerProgressbar";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Colors } from "@/types/common";

import { usePasswordStrength } from "./hooks/usePasswordStrength";

export type PasswordStrengthValue = "Very Weak" | "Weak" | "Fair" | "Strong";

export type PasswordStrengthProps = {
  password: string;
};

const PasswordText = ({ text = "", hasPassed = false }) => {
  return (
    <li className="mt-2 flex gap-4">
      <Icon name={hasPassed ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS} width={16} />
      <Text variant="text-body-600">{text}</Text>
    </li>
  );
};

const PasswordStrength = ({ password = "" }: PasswordStrengthProps) => {
  const t = useT();
  const { strength, values: passwordValues, validationCount } = usePasswordStrength({ password });

  const progressValue = validationCount * 25;

  const progressColor: Colors = useMemo(() => {
    switch (strength) {
      case "Very Weak":
      case "Weak":
        return "error";
      case "Fair":
        return "tertiary";
      default:
        return "success";
    }
  }, [strength]);

  return (
    <div>
      <Text variant="text-bold-body-300">
        <T _str="Password Strength: {strength}" strength={strength} />
      </Text>
      <LinerProgressbar value={progressValue} color={progressColor} className="my-2" />
      <div>
        <Text variant="text-light-body-300">
          <T _str="Password must:" />
        </Text>
        <ul className="mt-2 ml-0">
          <PasswordText text={t("Use a minimum of 8 characters")} hasPassed={passwordValues.hasCorrectLength} />
          <PasswordText text={t("Use an uppercase letter")} hasPassed={passwordValues.hasUppercase} />
          <PasswordText text={t("Use a lowercase letter")} hasPassed={passwordValues.hasLowercase} />
          <PasswordText text={t("Use a number")} hasPassed={passwordValues.hasNumber} />
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrength;
