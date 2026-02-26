import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRightIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

import { useClampedText } from "../hooks/useClampedText";

export interface ProjectDescriptionProps {
  description: string;
}

const ProjectDescription: FC<ProjectDescriptionProps> = ({ description }) => {
  const t = useT();
  const { descriptionRef, isClamped, isExpanded, toggleExpand } = useClampedText(description);

  const handleToggleExpand = useCallback(() => {
    toggleExpand();
  }, [toggleExpand]);

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
            WebkitLineClamp: isExpanded ? undefined : 3,
            WebkitBoxOrient: isExpanded ? undefined : "vertical",
            lineClamp: isExpanded ? undefined : 3
          }}
        >
          {description}
        </Text>
        {isClamped && !isExpanded && (
          <Text
            textStyle="300"
            color="neutral.900"
            position="absolute"
            bottom="-5px"
            backgroundColor="secondary.neutral"
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
            <Button variant="borderless" size="small" rightIcon={<ChevronRightIcon />} onClick={handleToggleExpand}>
              {t("Read More")}
            </Button>
          </Text>
        )}
        {isClamped && isExpanded && (
          <Button
            variant="borderless"
            size="small"
            onClick={handleToggleExpand}
            style={{
              display: "inline-flex",
              lineHeight: "20px",
              marginTop: "4px"
            }}
          >
            {t("Read Less")}
          </Button>
        )}
      </Box>
      <div className="w-fit">
        <Button variant="secondary" size="small" leftIcon={<EditIcon />} className="w-auto">
          {t("Edit")}
        </Button>
      </div>
    </>
  );
};

export default ProjectDescription;
