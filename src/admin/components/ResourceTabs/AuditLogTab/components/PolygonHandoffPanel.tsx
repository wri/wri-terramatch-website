import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Text from "@/components/elements/Text/Text";
import { useFullProject } from "@/connections/Entity";
import {
  isPolygonDataSubmissionOption,
  POLYGON_DATA_SUBMISSION_OPTION_VALUES,
  PolygonDataSubmissionOption
} from "@/constants/polygonHandoff";
import { useNotificationContext } from "@/context/notification.provider";
import { ProjectUpdateAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";

type Props = {
  projectUuid: string;
  polygonDataSubmission: PolygonDataSubmissionOption | string | null | undefined;
  readyForBaseline: boolean | undefined;
  onSaved?: () => void;
  /** Sidebar on Project Overview: hide hero title copy. */
  variant?: "default" | "compact";
};

const PolygonHandoffPanel: FC<Props> = ({
  projectUuid,
  polygonDataSubmission,
  readyForBaseline,
  onSaved,
  variant = "default"
}) => {
  const t = useT();
  const { openNotification } = useNotificationContext();
  const [, { isUpdating, updateFailure, update }] = useFullProject({ id: projectUuid });

  const options = useMemo(
    () =>
      [...POLYGON_DATA_SUBMISSION_OPTION_VALUES].map(value => ({
        title: t(`Polygon submission: ${value.replace(/-/g, " ")}`),
        value
      })),
    [t]
  );

  const [submission, setSubmission] = useState<string>(polygonDataSubmission ?? "no-polygons-submitted");
  const [baseline, setBaseline] = useState(readyForBaseline === true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setSubmission(polygonDataSubmission ?? "no-polygons-submitted");
    setBaseline(readyForBaseline === true);
  }, [polygonDataSubmission, readyForBaseline]);

  const handleSubmit = useCallback(() => {
    const trimmed = comment.trim();
    const submissionValue: PolygonDataSubmissionOption = isPolygonDataSubmissionOption(submission)
      ? submission
      : "no-polygons-submitted";
    const attrs: ProjectUpdateAttributes = {
      polygonDataSubmission: submissionValue,
      readyForBaseline: baseline,
      ...(trimmed !== "" ? { polygonHandoffComment: trimmed } : {})
    };
    update(attrs);
  }, [submission, baseline, comment, update]);

  useRequestComplete(
    isUpdating,
    updateFailure,
    useCallback(
      failure => {
        if (failure == null) {
          openNotification("success", t("Saved"), t("Polygon handoff updated"));
          setComment("");
          onSaved?.();
        }
      },
      [onSaved, openNotification, t]
    )
  );

  return (
    <Stack gap={3} className={variant === "compact" ? "max-w-full" : "max-w-xl"}>
      {variant === "default" ? (
        <div>
          <Text variant="text-24-bold" className="mb-1">
            {t("Polygon Handoff")}
          </Text>
          <Text variant="text-14-light" className="mb-4">
            {t("Update polygon data submission and baseline readiness. Changes are recorded in the history below.")}
          </Text>
        </div>
      ) : null}
      <Dropdown
        labelVariant="text-16-bold"
        label={t("Polygon Data Submission")}
        options={options}
        value={[submission]}
        onChange={v => setSubmission(String(v[0] ?? "no-polygons-submitted"))}
      />
      <FormControlLabel
        control={<Switch checked={baseline} onChange={(_, checked) => setBaseline(checked)} color="primary" />}
        label={<Text variant="text-14-semibold">{t("Project ready for baseline")}</Text>}
      />
      <TextField
        label={t("Comment (optional)")}
        value={comment}
        onChange={e => setComment(e.target.value)}
        multiline
        minRows={2}
        fullWidth
      />
      <Button variant="primary" onClick={handleSubmit} disabled={isUpdating}>
        {t("Save")}
      </Button>
    </Stack>
  );
};

export default PolygonHandoffPanel;
