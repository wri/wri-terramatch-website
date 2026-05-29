import { Grid } from "@mui/material";
import { useT } from "@transifex/react";
import { FC } from "react";
import { Labeled } from "react-admin";

import { getPolygonSubmissionStatusLabel, PolygonDataSubmissionOption } from "@/constants/polygonHandoff";

type Props = {
  polygonDataSubmission: PolygonDataSubmissionOption | string | null | undefined;
  readyForBaseline: boolean | undefined;
};

const PolygonHandoffSummary: FC<Props> = ({ polygonDataSubmission, readyForBaseline }) => {
  const t = useT();

  return (
    <Grid spacing={2} container>
      <Grid xs={4} item>
        <Labeled label={t("Polygon Submission Status")}>
          <span>{t(getPolygonSubmissionStatusLabel(polygonDataSubmission))}</span>
        </Labeled>
      </Grid>
      <Grid xs={4} item>
        <Labeled label={t("Project ready for baseline")}>
          <span>{readyForBaseline === true ? t("Yes") : t("No")}</span>
        </Labeled>
      </Grid>
    </Grid>
  );
};

export default PolygonHandoffSummary;
