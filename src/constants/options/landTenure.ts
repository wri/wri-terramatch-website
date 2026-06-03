const LAND_TENURE_PROJECT_AREA_LABELS: Record<string, string> = {
  "public-land": "Public Land",
  "private-land": "Private Land",
  "indigenous-land": "Indigenous Land",
  "communal-land": "Communal Land",
  "national-protected-area": "National Protected Area",
  "state-land": "State Land",
  "extractive-reserve-resex": "Extractive Reserve (RESEX)",
  "sustainable-development-reserve-rds": "Sustainable Development Reserve (RDS)",
  "national-forest-flona": "National Forest (FLONA)",
  "environmental-protection-area-apa": "Environmental Protection Area (APA)",
  "rural-settlements-pae-paex-or-pds": "Rural Settlements (PAE, PAEX, or PDS)",
  "quilombola-land": "Quilombola Land",
  "other-land": "Other Land"
};

export const getLandTenureProjectAreaLabel = (slug: string): string => LAND_TENURE_PROJECT_AREA_LABELS[slug] ?? slug;

export const formatLandTenureProjectAreaDisplay = (slugs: string[] | null | undefined): string => {
  if (slugs == null || slugs.length === 0) {
    return "Under Review";
  }

  return slugs.map(getLandTenureProjectAreaLabel).join(", ");
};
