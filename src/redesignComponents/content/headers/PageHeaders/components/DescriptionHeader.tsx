import { Box, Text } from "@chakra-ui/react";
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
}

const DescriptionHeader: FC<DescriptionHeaderProps> = ({
  description,
  handleEdit,
  backgroundColor = "secondary.neutral",
  downloadButtonProps = null,
  maxLines = 3,
  readMoreOnClick
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
            bottom="-5px"
            backgroundColor={backgroundColor}
            right="-1px"
            style={{
              display: "block",
              lineHeight: "20px",
              verticalAlign: "baseline",
              padding: "0",
              height: "auto"
            }}
          >
            {"..."}
            <Button
              variant="borderless"
              size="small"
              rightIcon={<ChevronRightIcon className={classNames(readMoreOnClick ? "" : "rotate-90")} />}
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
            rightIcon={<ChevronRightIcon className={classNames(readMoreOnClick ? "" : "-rotate-90")} />}
            style={{
              display: "inline-flex",
              lineHeight: "20px"
            }}
          >
            {t("Read Less")}
          </Button>
        ) : null}
      </Box>
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
