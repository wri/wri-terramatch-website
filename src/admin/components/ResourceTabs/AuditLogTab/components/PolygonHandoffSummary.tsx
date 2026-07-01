import { Grid, Stack } from "@mui/material";
import { useT } from "@transifex/react";
import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { isPolygonDataSubmissionOption, PolygonDataSubmissionOption } from "@/constants/polygonHandoff";
import { usePolygonSubmissionStatusLabels } from "@/hooks/translation/usePolygonSubmissionStatusLabels";

type Props = {
  polygonDataSubmission: PolygonDataSubmissionOption | string | null | undefined;
  readyForBaseline: boolean | undefined;
};

const PolygonHandoffSummary: FC<Props> = ({ polygonDataSubmission, readyForBaseline }) => {
  const t = useT();
  const polygonSubmissionStatusLabels = usePolygonSubmissionStatusLabels();
  const submissionLabel =
    polygonDataSubmission != null && isPolygonDataSubmissionOption(polygonDataSubmission)
      ? polygonSubmissionStatusLabels[polygonDataSubmission]
      : "-";

  return (
    <Grid spacing={2} container>
      <Grid xs={4} item>
        <Stack gap={0.5}>
          <Text variant="text-16-bold" className="text-darkCustom">
            {t("Polygon Submission Status")}
          </Text>
          <Text variant="text-14-semibold" className="text-darkCustom">
            {submissionLabel}
          </Text>
        </Stack>
      </Grid>
      <Grid xs={4} item>
        <Stack gap={0.5}>
          <Text variant="text-16-bold" className="text-darkCustom">
            {t("Project Ready for Baseline")}
          </Text>
          <Text variant="text-14-semibold" className="text-darkCustom">
            {readyForBaseline === true ? t("Yes") : t("No")}
          </Text>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PolygonHandoffSummary;
