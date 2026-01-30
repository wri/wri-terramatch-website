import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ProgressTag, ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { ChevronRight } from "@/redesignComponents/foundations/Icons";

import DateRange from "./DateRange";
import ProjectDescription from "./ProjectDescription";
import SeparatorDot from "./SeparatorDot";

export interface ProjectInfoProps {
  title: string;
  tag: ProgressTagProps;
  organization: string;
  country: string;
  startDate: string;
  endDate: string;
  description?: string;
}

const ProjectInfo: FC<ProjectInfoProps> = ({ title, tag, organization, country, startDate, endDate, description }) => {
  const t = useT();

  return (
    <Box gap={2} className="flex flex-col">
      <Text fontSize="28px" lineHeight="36px" color="primary.900" fontWeight="bold" className="flex items-center gap-3">
        {title} <ProgressTag {...tag} />
      </Text>
      <Text fontSize="16px" lineHeight="24px" color="neutral.900" className="flex items-center gap-2">
        <b>{organization}</b>
        <SeparatorDot />
        <Text fontSize="14px" lineHeight="24px" color="primary.900">
          {country}
        </Text>
      </Text>
      <DateRange startDate={startDate} endDate={endDate} />
      {description != null ? (
        <ProjectDescription description={description} />
      ) : (
        <div className="w-fit">
          <Button variant="secondary" size="small" rightIcon={<ChevronRight />} className="w-auto">
            {t("Add Project Information")}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default ProjectInfo;
