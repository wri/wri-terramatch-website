import { useT } from "@transifex/react";
import { useMemo } from "react";

const useLandTenureProjectAreaLabel = () => {
  const t = useT();

  return useMemo(
    () => ({
      "public-land": t("Public Land"),
      "private-land": t("Private Land"),
      "indigenous-land": t("Indigenous Land"),
      "communal-land": t("Communal Land"),
      "national-protected-area": t("National Protected Area"),
      "state-land": t("State Land"),
      "extractive-reserve-resex": t("Extractive Reserve (RESEX)"),
      "sustainable-development-reserve-rds": t("Sustainable Development Reserve (RDS)"),
      "national-forest-flona": t("National Forest (FLONA)"),
      "environmental-protection-area-apa": t("Environmental Protection Area (APA)"),
      "rural-settlements-pae-paex-or-pds": t("Rural Settlements (PAE, PAEX, or PDS)"),
      "quilombola-land": t("Quilombola Land"),
      "other-land": t("Other Land")
    }),
    [t]
  );
};

export const useFormatLandTenureProjectAreaDisplay = (slugs: string[] | null | undefined): string => {
  if (slugs == null || slugs.length === 0) {
    return "Under Review";
  }

  const landTenureProjectAreaLabel = useLandTenureProjectAreaLabel();

  return slugs
    .map(slug => landTenureProjectAreaLabel[slug as keyof typeof landTenureProjectAreaLabel] ?? slug)
    .join(", ");
};
