import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
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
}

const DescriptionHeader: FC<DescriptionHeaderProps> = ({
  description,
  handleEdit,
  backgroundColor = "secondary.neutral",
  downloadButtonProps = null,
  maxLines = 3
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
            display: isExpanded ? "block" : "-webkit-box",
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
            <Button variant="borderless" size="small" rightIcon={<ChevronRightIcon />} onClick={toggleExpand}>
              {t("Read More")}
            </Button>
          </Text>
        ) : null}
        {isClamped && isExpanded ? (
          <Button
            variant="borderless"
            size="small"
            onClick={toggleExpand}
            style={{
              display: "inline-flex",
              lineHeight: "20px",
              marginTop: "4px"
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
