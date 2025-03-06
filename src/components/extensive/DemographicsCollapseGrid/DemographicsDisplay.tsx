import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { FC } from "react";

import { getDemographicTitle } from "@/components/extensive/DemographicsCollapseGrid/constants";
import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_DEFAULT } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import {
  DemographicEntity,
  DemographicGridVariantProps,
  DemographicType
} from "@/components/extensive/DemographicsCollapseGrid/types";
import { useDemographic } from "@/connections/EntityAssocation";

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
  const [loaded, { association: demographic }] = useDemographic({ entity, uuid, type: kebabCase(type), collection });
  const title = t(getDemographicTitle(type, collection));

  return !loaded ? null : (
    <DemographicsCollapseGrid {...{ variant, type, title }} entries={demographic?.entries ?? []} />
  );
};

export default DemographicsDisplay;
