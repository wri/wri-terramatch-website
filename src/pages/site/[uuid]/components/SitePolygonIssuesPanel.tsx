import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";

import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";

type IssueSelectLinkProps = {
  label: string;
  onClick: () => void;
};

const IssueSelectLink: FC<IssueSelectLinkProps> = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="cursor-pointer">
    <Text as="span" textStyle="300-bold" color="error.900" textDecoration="underline">
      {label}
    </Text>
  </button>
);

export type SitePolygonIssuesPanelProps = {
  overlapCount: number;
  disturbanceCount: number;
  onSelectOverlapPolygons: () => void;
  onSelectDisturbancePolygons: () => void;
};

const SitePolygonIssuesPanel: FC<SitePolygonIssuesPanelProps> = ({
  overlapCount,
  disturbanceCount,
  onSelectOverlapPolygons,
  onSelectDisturbancePolygons
}) => {
  const t = useT();
  const totalIssueCount = overlapCount + disturbanceCount;

  if (totalIssueCount === 0) {
    return null;
  }

  return (
    <Flex
      direction="column"
      gap={1}
      bg="error.100"
      borderWidth="0.0625rem"
      borderColor="error.300"
      className="w-max shrink-0 rounded px-4 py-2"
    >
      <Flex className="items-center gap-2">
        <InformationRequiredIcon boxSize="1rem" color="error.500" />
        <Text textStyle="300-bold" color="error.900">
          {totalIssueCount === 1 ? t("1 issue detected") : t("{count} issues detected", { count: totalIssueCount })}
        </Text>
      </Flex>
      <Flex className="items-center gap-4 pl-6">
        {overlapCount > 0 && (
          <IssueSelectLink
            label={overlapCount === 1 ? t("1 Overlap") : t("{count} Overlaps", { count: overlapCount })}
            onClick={onSelectOverlapPolygons}
          />
        )}
        {disturbanceCount > 0 && (
          <IssueSelectLink
            label={disturbanceCount === 1 ? t("1 Disturbance") : t("{count} Disturbances", { count: disturbanceCount })}
            onClick={onSelectDisturbancePolygons}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default SitePolygonIssuesPanel;
