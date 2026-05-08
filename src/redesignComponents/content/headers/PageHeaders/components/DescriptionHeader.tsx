import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRightIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

import { useClampedText } from "../hooks/useClampedText";

export interface DescriptionHeaderProps {
  description: string;
  handleEdit?: () => void;
  backgroundColor?: string;
  downloadButtonProps?: IButtonProps;
  maxLines?: number;
  readMoreOnClick?: () => void;
  id?: string;
}

const DescriptionHeader: FC<DescriptionHeaderProps> = ({
  description,
  handleEdit,
  backgroundColor = "secondary.neutral",
  downloadButtonProps = null,
  maxLines = 3,
  readMoreOnClick,
  id
}) => {
  const t = useT();
  const { descriptionRef, isClamped, isExpanded, toggleExpand } = useClampedText(description, maxLines);

  return (
    <>
      <Box position="relative" display="inline-block" width="100%">
        <Text
          ref={descriptionRef}
          textStyle="300"
          color="neutral.900"
          style={{
            marginBottom: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: isExpanded ? "contents" : "-webkit-box",
            WebkitLineClamp: isExpanded ? undefined : maxLines,
            WebkitBoxOrient: isExpanded ? undefined : "vertical",
            lineClamp: isExpanded ? undefined : maxLines
          }}
        >
          {description}
        </Text>
        {isClamped && !isExpanded ? (
          <Text
            textStyle="300"
            color="neutral.900"
            position="absolute"
            bottom="-0.3125rem"
            backgroundColor={backgroundColor}
            right="-0.0625rem"
            style={{
              display: "block",
              lineHeight: "1.25rem",
              verticalAlign: "baseline",
              padding: "0",
              height: "auto"
            }}
          >
            {"..."}
            <Button
              variant="borderless"
              size="small"
              rightIcon={<ChevronRightIcon className={classNames({ "rotate-90": !readMoreOnClick })} />}
              onClick={readMoreOnClick ?? toggleExpand}
            >
              {t("Read More")}
            </Button>
          </Text>
        ) : null}
        {isExpanded ? (
          <Button
            variant="borderless"
            size="small"
            onClick={toggleExpand}
            rightIcon={<ChevronRightIcon className={classNames({ "-rotate-90": !readMoreOnClick })} />}
            style={{
              display: "inline-flex",
              lineHeight: "1.25rem"
            }}
          >
            {t("Read Less")}
          </Button>
        ) : null}
      </Box>
      <Flex gap={1} className="items-center">
        <Text textStyle="300" color="neutral.900">
          {t("ID:")}
        </Text>
        <Text textStyle="300-bold" color="neutral.900">
          {id}
        </Text>
      </Flex>
      <div className="flex w-fit gap-2">
        <Button variant="secondary" size="small" leftIcon={<EditIcon />} className="w-auto" onClick={handleEdit}>
          {t("Edit")}
        </Button>
        {downloadButtonProps != null ? <Button {...downloadButtonProps} /> : null}
      </div>
    </>
  );
};

export default DescriptionHeader;
