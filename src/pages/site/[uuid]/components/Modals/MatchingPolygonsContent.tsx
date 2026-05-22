import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import { useAllSitePolygons } from "@/connections/SitePolygons";

import type { GeometryUploadComparisonResult } from "../../hooks/useUploadPolygons";

export interface MatchingPolygonsContentProps {
  siteUuid: string;
  comparison: GeometryUploadComparisonResult;
}

const MatchingPolygonsContent: FC<MatchingPolygonsContentProps> = ({ siteUuid, comparison }) => {
  const t = useT();
  const { existingUuids, featuresForVersioning, featuresForCreation } = comparison;

  const { data: sitePolygonData = [] } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: siteUuid != null && siteUuid !== ""
  });

  const versionedPolygons = useMemo(
    () =>
      existingUuids.map(uuid => {
        const polygon = sitePolygonData.find(p => p.uuid === uuid);
        const name = polygon?.name ?? polygon?.versionName ?? t("Unnamed Polygon");
        return { uuid, name, isKnown: polygon != null };
      }),
    [existingUuids, sitePolygonData, t]
  );

  const hasVersioning = featuresForVersioning > 0;
  const hasCreation = featuresForCreation > 0;

  return (
    <Box px={4}>
      <Text textStyle="400" color="neutral.900" mb={3}>
        {t(
          "Based on the recent upload, the following polygons were identified. Polygons within the site that are not shown have not been uploaded and will not be affected."
        )}
      </Text>

      {hasVersioning && versionedPolygons.length > 0 ? (
        <>
          <Text textStyle="400-bold" color="neutral.900" display="flex" mb={3} gap={0.5}>
            {t("New versions")}
            <Text as="span" textStyle="400" color="neutral.900">
              {t(" will be created for:")}
            </Text>
          </Text>
          <Flex flexDirection="column" gap={4} bg="primary.100" py={2} px={3} rounded={4} mb={3}>
            <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
              {versionedPolygons.map(({ uuid, name, isKnown }) => (
                <List.Item key={uuid} _marker={{ color: "neutral.900" }}>
                  <Text textStyle="400" color="neutral.900">
                    {isKnown ? name : uuid}
                  </Text>
                </List.Item>
              ))}
            </List.Root>
          </Flex>
        </>
      ) : hasVersioning ? (
        <Text textStyle="400" color="neutral.700" mb={3}>
          {t(
            "Matching polygon names could not be resolved. The upload will still create new versions where UUIDs match."
          )}
        </Text>
      ) : null}

      {!hasVersioning && hasCreation ? (
        <Text textStyle="400" color="neutral.900">
          {t("No existing polygons were matched. All features in this file will be created as new polygons.")}
        </Text>
      ) : null}

      {hasCreation && hasVersioning ? (
        <Text textStyle="300" color="neutral.700">
          {featuresForCreation === 1
            ? t("1 feature does not match an existing polygon and will be created as a new polygon.")
            : t("{count} features do not match existing polygons and will be created as new polygons.", {
                count: featuresForCreation
              })}
        </Text>
      ) : null}
    </Box>
  );
};

export default MatchingPolygonsContent;
