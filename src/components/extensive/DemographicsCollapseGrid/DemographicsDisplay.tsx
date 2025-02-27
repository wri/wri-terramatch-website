import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { FC } from "react";

import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_DEFAULT } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import {
  DemographicEntity,
  DemographicGridVariantProps,
  DemographicType
} from "@/components/extensive/DemographicsCollapseGrid/types";
import { useDemographic } from "@/connections/EntityAssocation";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { DemographicDto } from "@/generated/v3/entityService/entityServiceSchemas";

type DemographicsDisplayProps = {
  entity: DemographicEntity;
  uuid: string;
  type: DemographicType;
  collection: string;
  variant?: DemographicGridVariantProps;
};

const DemographicsDisplay: FC<DemographicsDisplayProps> = ({
  entity,
  uuid,
  type,
  collection,
  variant = GRID_VARIANT_DEFAULT
}) => {
  const t = useT();
  const [, { association: demographic }] = useDemographic({ entity, uuid, type, collection });
  const collectionTitles = DemographicCollections.COLLECTION_TITLES[kebabCase(type) as DemographicDto["type"]];
  const title = t(collectionTitles?.[collection as keyof typeof collectionTitles] ?? "Unknown");

  return demographic == null ? null : (
    <DemographicsCollapseGrid {...{ variant, type, title }} entries={demographic.entries} />
  );
};

export default DemographicsDisplay;
