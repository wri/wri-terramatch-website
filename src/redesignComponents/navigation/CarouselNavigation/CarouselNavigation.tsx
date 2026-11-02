import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useCallback } from "react";

import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

export interface CarouselNavigationProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

const CarouselNavigation: FC<CarouselNavigationProps> = ({ total, current, onChange }) => {
  const t = useT();
  const isFirst = current === 0;
  const isLast = current === total - 1;

  const goToPrevious = useCallback(() => onChange(current - 1), [current, onChange]);
  const goToNext = useCallback(() => onChange(current + 1), [current, onChange]);

  return (
    <Flex align="center" gap={4}>
      <IconButton
        variant="borderless"
        size="small"
        aria-label={t("Previous")}
        disabled={isFirst}
        onClick={goToPrevious}
        icon={<ChevronRightIcon className="!rotate-180" boxSize={4} color={isFirst ? "neutral.500" : "primary.600"} />}
      />
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={t("Go to update {step} of {total}", { step: index + 1, total })}
          aria-current={index === current ? "step" : undefined}
          className={classNames("h-2.5 w-2.5 cursor-pointer rounded-full", {
            "bg-theme-primary-600": index === current,
            "bg-theme-neutral-400": index !== current
          })}
          onClick={() => onChange(index)}
        />
      ))}
      <IconButton
        variant="borderless"
        size="small"
        aria-label={t("Next")}
        disabled={isLast}
        onClick={goToNext}
        icon={<ChevronRightIcon boxSize={4} color={isLast ? "neutral.500" : "primary.600"} />}
      />
    </Flex>
  );
};

export default CarouselNavigation;
