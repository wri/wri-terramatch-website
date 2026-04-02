import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { FC, useMemo } from "react";

import { CollectionTitleSet } from "@/components/extensive/TrackingCollapseGrid/constants";
import TrackingCollapseGrid from "@/components/extensive/TrackingCollapseGrid/TrackingCollapseGrid";
import { GRID_VARIANT_DEFAULT } from "@/components/extensive/TrackingCollapseGrid/TrackingVariant";
import {
  TrackingDomain,
  TrackingEntity,
  TrackingGridVariantProps,
  TrackingType
} from "@/components/extensive/TrackingCollapseGrid/types";
import { useTracking } from "@/connections/EntityAssociation";

type TrackingDisplayProps = {
  entity: TrackingEntity;
  uuid: string;
  domain: TrackingDomain;
  type: TrackingType;
  collection: string;
  variant?: TrackingGridVariantProps;
};

const useGetTrackingTitle = (type: TrackingType, collection: string) => {
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
        all: t("All"),
        "full-time": t("Full-time"),
        "full-time-clt": t("Full-time CLT"),
        "part-time": t("Part-time"),
        "part-time-clt": t("Part-time CLT")
      },
      employees: {
        all: t("All"),
        "full-time": t("Full-time"),
        "full-time-clt": t("Full-time CLT"),
        "part-time": t("Part-time"),
        "part-time-clt": t("Part-time CLT"),
        temp: t("Temp")
      },
      volunteers: {
        volunteer: t("Volunteer")
      },
      allBeneficiaries: {
        all: t("All Beneficiaries")
      },
      trainingBeneficiaries: {
        training: t("Training Beneficiaries")
      },
      indirectBeneficiaries: {
        indirect: t("Indirect Beneficiaries")
      },
      associates: {
        all: t("All Associates")
      },
      elpBeneficiaries: {
        elp: t("ELP Beneficiaries")
      },
      livelihoodActivities: {
        all: t("Livelihood Activity")
      },
      hectaresGoal: {
        all: t("Hectares Goal")
      },
      hectaresHistorical: {
        all: t("Hectares Restored")
      },
      treesGoal: {
        all: t("Trees Goal")
      },
      treesHistorical: {
        regenerated: t("Trees Regenerated"),
        grown: t("Trees Grown")
      }
    }),
    [t]
  );

  const collectionTitles = COLLECTION_TITLES[type];
  return collectionTitles?.[collection as keyof typeof collectionTitles] ?? t("Unknown");
};

const TrackingDisplay: FC<TrackingDisplayProps> = ({
  entity,
  uuid,
  domain,
  type,
  collection,
  variant = GRID_VARIANT_DEFAULT
}) => {
  const [loaded, { data: tracking }] = useTracking({
    entity,
    uuid,
    domain: kebabCase(domain),
    type: kebabCase(type),
    collection
  });
  const title = useGetTrackingTitle(type, collection);

  return !loaded ? null : (
    <TrackingCollapseGrid {...{ variant, domain, type, title }} entries={tracking?.entries ?? []} />
  );
};

export default TrackingDisplay;
