import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { FC, useMemo } from "react";

import { CollectionTitleSet } from "@/components/extensive/DemographicsCollapseGrid/constants";
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

const useGetDemographicTitle = (type: DemographicType, collection: string) => {
  const t = useT();

  const COLLECTION_TITLES: CollectionTitleSet = useMemo(
    () => ({
      workdays: {
        "paid-project-management": t("Paid Project Management"),
        "volunteer-project-management": t("Volunteer Project Management"),
        "paid-nursery-operations": t("Paid Nursery Operations"),
        "volunteer-nursery-operations": t("Volunteer Nursery Operations"),
        "paid-other-activities": t("Paid Other Activities"),
        "volunteer-other-activities": t("Volunteer Other Activities"),
        direct: t("Direct Workdays"),
        convergence: t("Convergence Workdays"),
        "paid-site-establishment": t("Paid Site Establishment"),
        "volunteer-site-establishment": t("Volunteer Site Establishment"),
        "paid-planting": t("Paid Planting"),
        "volunteer-planting": t("Volunteer Planting"),
        "paid-site-maintenance": t("Paid Site Maintenance"),
        "volunteer-site-maintenance": t("Volunteer Site Maintenance"),
        "paid-site-monitoring": t("Paid Site Monitoring"),
        "volunteer-site-monitoring": t("Volunteer Site Monitoring")
      },
      restorationPartners: {
        "direct-income": t("Direct Income"),
        "indirect-income": t("Indirect Income"),
        "direct-benefits": t("Direct In-kind Benefits"),
        "indirect-benefits": t("Indirect In-kind Benefits"),
        "direct-conservation-payments": t("Direct Conservation Agreement Payments"),
        "indirect-conservation-payments": t("Indirect Conservation Agreement Payments"),
        "direct-market-access": t("Direct Increased Market Access"),
        "indirect-market-access": t("Indirect Increased Market Access"),
        "direct-capacity": t("Direct Increased Capacity"),
        "indirect-capacity": t("Indirect Increased Capacity"),
        "direct-training": t("Direct Training"),
        "indirect-training": t("Indirect Training"),
        "direct-land-title": t("Direct Newly Secured Land Title"),
        "indirect-land-title": t("Indirect Newly Secured Land Title"),
        "direct-livelihoods": t("Direct Traditional Livelihoods or Customer Rights"),
        "indirect-livelihoods": t("Indirect Traditional Livelihoods or Customer Rights"),
        "direct-productivity": t("Direct Increased Productivity"),
        "indirect-productivity": t("Indirect Increased Productivity"),
        "direct-other": t("Direct Other"),
        "indirect-other": t("Indirect Other")
      },
      jobs: {
        "full-time": t("Full-time"),
        "part-time": t("Part-time")
      },
      volunteers: {
        volunteer: t("Volunteer")
      },
      allBeneficiaries: {
        all: t("All Beneficiaries")
      },
      trainingBeneficiaries: {
        training: t("Training Beneficiaries")
      }
    }),
    [t]
  );

  const collectionTitles = COLLECTION_TITLES[type];
  return collectionTitles?.[collection as keyof typeof collectionTitles] ?? t("Unknown");
};

const DemographicsDisplay: FC<DemographicsDisplayProps> = ({
  entity,
  uuid,
  type,
  collection,
  variant = GRID_VARIANT_DEFAULT
}) => {
  const [loaded, { association: demographic }] = useDemographic({ entity, uuid, type: kebabCase(type), collection });
  const title = useGetDemographicTitle(type, collection);

  return !loaded ? null : (
    <DemographicsCollapseGrid {...{ variant, type, title }} entries={demographic?.entries ?? []} />
  );
};

export default DemographicsDisplay;
