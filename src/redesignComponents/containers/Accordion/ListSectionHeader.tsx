import { Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { FC, MouseEvent } from "react";

import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";

import type { ListSectionHeaderLevel, ListSectionHeaderProps } from "./types";

const levelStyles: Record<
  ListSectionHeaderLevel,
  {
    gap: number;
  }
> = {
  "top-level": {
    gap: 3
  },
  "sub-level": {
    gap: 4
  }
};

const ListSectionHeader: FC<ListSectionHeaderProps> = ({
  level = "top-level",
  label,
  title,
  titleHref,
  onTitleClick,
  caption,
  captionHref,
  statusLabels,
  icon,
  className,
  dueDate,
  dueIcon,
  dueDateType = "info-white"
}) => {
  const gap = levelStyles[level].gap;
  const isTopLevelLink = titleHref != null;
  const isCaptionLink = captionHref != null;

  const router = useRouter();

  const handleTitleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onTitleClick?.(event as MouseEvent<HTMLAnchorElement>);

    if (!titleHref) return;

    event.preventDefault();

    router?.push(titleHref);
  };

  const handleCaptionClick = (event: MouseEvent) => {
    event.stopPropagation();
    if (!captionHref) return;
    event.preventDefault();
    router?.push(captionHref);
  };

  const titleClassName = classNames("truncate", {
    "text-decoration-solid underline underline-offset-2": level === "top-level"
  });

  const titleLinkClassName = classNames(
    "min-w-0 truncate rounded-[6px] leading-[normal]",
    "text-theme-primary-900",
    "hover:text-theme-primary-700",
    "active:text-theme-primary-800",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-primary-700"
  );

  return (
    <Flex alignItems="center" justifyContent="space-between" width="100%" gap={3} className={className}>
      <Flex alignItems="baseline" gap={gap} minWidth={0} flex={1}>
        {icon}
        <Flex direction="column" minWidth={0} alignItems="flex-start">
          <Flex alignItems="center" gap={1}>
            {label && (
              <Text textStyle="300" color="neutral.800">
                {label}:
              </Text>
            )}
            {isTopLevelLink ? (
              <NextLink href={titleHref} className={titleLinkClassName} onClick={handleTitleClick}>
                <Text as="span" textStyle="500-bold" className={titleClassName}>
                  {title}
                </Text>
              </NextLink>
            ) : (
              <Text
                color="primary.900"
                textStyle={level === "top-level" ? "500-bold" : "400-bold"}
                className={titleClassName}
              >
                {title}
              </Text>
            )}
          </Flex>
          {caption != null &&
            (isCaptionLink ? (
              <NextLink href={captionHref} className={titleLinkClassName} onClick={handleCaptionClick}>
                <Text as="span" textStyle="300" className="truncate underline underline-offset-2">
                  {caption}
                </Text>
              </NextLink>
            ) : (
              <Text textStyle="300" className="truncate">
                {caption}
              </Text>
            ))}
        </Flex>
        {dueDate && <FeedbackTag icon={dueIcon} label={dueDate} onClose={() => {}} size="default" type={dueDateType} />}
      </Flex>
      {statusLabels != null && (
        <Flex alignItems="center" gap={2} flexShrink={0}>
          {statusLabels}
        </Flex>
      )}
    </Flex>
  );
};

export default ListSectionHeader;
