import { Stack } from "@mui/material";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Text from "@/components/elements/Text/Text";
import { useFullProject } from "@/connections/Entity";
import {
  isProjectQaStatusOption,
  PROJECT_QA_STATUS_FIELDS,
  PROJECT_QA_STATUS_OPTION_VALUES,
  ProjectQaStatusField,
  ProjectQaStatusOption
} from "@/constants/polygonHandoff";
import { useNotificationContext } from "@/context/notification.provider";
import { ProjectUpdateAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { useProjectQaStatusFieldLabels, useProjectQaStatusLabels } from "@/hooks/translation/useProjectQaStatusLabels";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import ApiSlice from "@/store/apiSlice";

type ProjectQaStatusValues = Record<ProjectQaStatusField, ProjectQaStatusOption | string | null | undefined>;

type Props = {
  projectUuid: string;
  statuses: ProjectQaStatusValues;
  onSaved?: () => void;
};

const resolveQaStatus = (value: string | null | undefined): ProjectQaStatusOption | null =>
  value != null && isProjectQaStatusOption(value) ? value : null;

const OverallPolygonQaStatusPanel: FC<Props> = ({ projectUuid, statuses, onSaved }) => {
  const t = useT();
  const { openNotification } = useNotificationContext();
  const [, { isUpdating, updateFailure, update }] = useFullProject({ id: projectUuid });
  const [isQaStatusNotification, setIsQaStatusNotification] = useState(false);
  const projectQaStatusLabels = useProjectQaStatusLabels();
  const projectQaStatusFieldLabels = useProjectQaStatusFieldLabels();

  const options = useMemo(
    () =>
      PROJECT_QA_STATUS_OPTION_VALUES.map(value => ({
        title: projectQaStatusLabels[value],
        value
      })),
    [projectQaStatusLabels]
  );

  const fieldLabels = useMemo(
    (): Record<ProjectQaStatusField, string> => ({
      projectQaStatus1: projectQaStatusFieldLabels[1],
      projectQaStatus2: projectQaStatusFieldLabels[2],
      projectQaStatus3: projectQaStatusFieldLabels[3],
      projectQaStatus4: projectQaStatusFieldLabels[4],
      projectQaStatus5: projectQaStatusFieldLabels[5]
    }),
    [projectQaStatusFieldLabels]
  );

  const [values, setValues] = useState<Record<ProjectQaStatusField, ProjectQaStatusOption | null>>(() =>
    PROJECT_QA_STATUS_FIELDS.reduce((acc, field) => {
      acc[field] = resolveQaStatus(statuses[field]);
      return acc;
    }, {} as Record<ProjectQaStatusField, ProjectQaStatusOption | null>)
  );

  useEffect(() => {
    setValues(
      PROJECT_QA_STATUS_FIELDS.reduce((acc, field) => {
        acc[field] = resolveQaStatus(statuses[field]);
        return acc;
      }, {} as Record<ProjectQaStatusField, ProjectQaStatusOption | null>)
    );
  }, [statuses]);

  const handleChange = useCallback((field: ProjectQaStatusField, next: ProjectQaStatusOption | null) => {
    setValues(prev => ({ ...prev, [field]: next }));
  }, []);

  const handleSubmit = useCallback(() => {
    const attrs = PROJECT_QA_STATUS_FIELDS.reduce((acc, field) => {
      acc[field] = resolveQaStatus(values[field]);
      return acc;
    }, {} as Record<ProjectQaStatusField, ProjectQaStatusOption | null>) as ProjectUpdateAttributes;

    setIsQaStatusNotification(true);
    update(attrs);
    ApiSlice.pruneCache("auditStatuses");
  }, [update, values]);

  useRequestComplete(
    isUpdating,
    updateFailure,
    useCallback(
      failure => {
        if (failure == null && isQaStatusNotification) {
          setIsQaStatusNotification(false);
          openNotification("success", t("Saved"), t("Overall polygon QA status updated"));
          onSaved?.();
        }
      },
      [isQaStatusNotification, onSaved, openNotification, t]
    )
  );

  return (
    <Stack gap={3} className="max-w-xl">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          {t("Overall Polygon QA Status")}
        </Text>
        <Text variant="text-14-light" className="mb-4">
          {t("Update overall polygon QA statuses per {cycle}. Changes are recorded in the history below.", {
            cycle: <b>{t("reporting cycle")}</b>
          })}
        </Text>
      </div>
      {PROJECT_QA_STATUS_FIELDS.map(field => (
        <div key={field} className="flex items-center gap-3">
          <Text variant="text-16-bold" className="w-44 shrink-0 whitespace-nowrap">
            {fieldLabels[field]}
          </Text>
          <Dropdown
            containerClassName="min-w-0 flex-1"
            options={options}
            value={values[field] == null ? [] : [values[field]!]}
            onChange={v => handleChange(field, resolveQaStatus(v[0] != null ? String(v[0]) : null))}
          />
        </div>
      ))}
      <Button variant="primary" onClick={handleSubmit} disabled={isUpdating}>
        {t("Save")}
      </Button>
    </Stack>
  );
};

export default OverallPolygonQaStatusPanel;
