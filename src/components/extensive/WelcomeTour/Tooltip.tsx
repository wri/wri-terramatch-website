import { T } from "@transifex/react";
import { FC } from "react";
import { When } from "react-if";
import { TooltipRenderProps } from "react-joyride";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

const ToolTip: FC<TooltipRenderProps> = ({
  backProps,
  closeProps,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps,
  ...rest
}) => {
  return (
    <div {...tooltipProps} className="relative">
      <div className="absolute left-[50%] top-0 z-20 w-[400px]  translate-x-[-50%] rounded-lg border-t-[12px] border-primary-400 bg-white px-8 py-6 text-center">
        <div className="flex flex-col justify-center gap-3">
          <Text variant="text-bold-subtitle-500">
            <T _str="{current} of {count}" current={rest.index + 1} count={rest.size} />
          </Text>
          <Text variant="text-bold-subtitle-500">{step.title}</Text>
          <Text variant="text-light-subtitle-400">{step.content}</Text>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <When condition={rest.index !== 0}>
            <Button {...backProps} variant="secondary">
              <T _str="Back" />
            </Button>
          </When>
          <Button {...primaryProps}>
            <T _str={rest.index + 1 === rest.size ? "Finish" : "Got it"} />
          </Button>
        </div>
      </div>
      {/* Arrow */}
      <div className="absolute left-[50%] top-[-27px] z-10 h-[54px] w-[54px] translate-x-[-50%] rotate-45 rounded bg-primary-400"></div>
    </div>
  );
};

export default ToolTip;
