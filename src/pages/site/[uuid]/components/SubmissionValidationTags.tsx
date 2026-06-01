import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import MappedTag from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import {
  mapSitePolygonStatusToMappedTagState,
  mapSiteValidationStatusToTagState
} from "@/utils/mapStatusToTagStateEntity";

export type SubmissionValidationTagsProps = {
  polygon?: SitePolygonLightDto;
};

const SubmissionValidationTags: FC<SubmissionValidationTagsProps> = ({ polygon }) => {
  const t = useT();
  return (
    <Flex className="h-fit w-full gap-6">
      <Flex className="items-center gap-1">
        <Text textStyle="200" color="neutral.800">
          {t("Submission:")}
        </Text>
        <MappedTag state={mapSitePolygonStatusToMappedTagState(polygon?.status ?? "draft")} />
      </Flex>
      <Flex className="items-center gap-1">
        <Text textStyle="200" color="neutral.800">
          {t("Validation:")}
        </Text>
        <ValidationTag status={mapSiteValidationStatusToTagState(polygon?.validationStatus ?? null)} />
      </Flex>
    </Flex>
  );
};

export default SubmissionValidationTags;
