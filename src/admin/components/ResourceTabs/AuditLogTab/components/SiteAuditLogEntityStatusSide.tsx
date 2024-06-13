import classNames from "classnames";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { When } from "react-if";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Notification from "@/components/elements/Notification/Notification";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { usePostV2AuditStatusENTITYUUID } from "@/generated/apiComponents";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import { SelectedItem } from "@/hooks/AuditStatus/useLoadEntityList";
import { recentRequestData } from "@/utils/statusUtils";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay";
import { AuditLogEntity } from "../constants/types";
import { getRequestPathParam } from "../utils/util";

const SiteAuditLogEntityStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon,
  auditLogData,
  entityType = "Polygon",
  mutate,
  getValueForStatus,
  progressBarLabels,
  tab,
  checkPolygonsSite
}: {
  entityType: AuditLogEntity;
  refresh?: () => void;
  record?: any;
  polygonList?: any[];
  selectedPolygon?: SelectedItem | null;
  setSelectedPolygon?: Dispatch<SetStateAction<SelectedItem | null>> | null;
  auditLogData?: AuditStatusResponse[];
  mutate?: any;
  getValueForStatus?: (status: string) => number;
  progressBarLabels?: Array<{ id: string; label: string }>;
  tab?: string;
  checkPolygonsSite?: boolean | undefined;
}) => {
  const [open, setOpen] = useState(false);

  const recentRequest = useMemo(() => {
    return auditLogData?.find((item: AuditStatusResponse) => item.type == "change-request" && item.is_active);
  }, [auditLogData]);

  const mutateUpload = entityType === "Project" ? usePostV2AuditStatusENTITYUUID : usePostV2AuditStatusENTITYUUID;
  const { mutate: upload } = mutateUpload({
    onSuccess: () => {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      refresh?.();
    }
  });

  const deactivateRecentRequest = async () => {
    upload?.({
      pathParams: {
        uuid: record?.uuid,
        entity: getRequestPathParam(entityType)
      },
      body: {
        status: "",
        comment: "",
        type: "change-request",
        request_removed: true
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 overflow-visible">
      <When condition={polygonList?.length}>
        <Dropdown
          label={`Select ${entityType}`}
          labelVariant="text-16-bold"
          labelClassName="capitalize"
          optionsClassName="max-w-full"
          value={[selectedPolygon?.uuid ?? ""]}
          placeholder={`Select ${entityType}`}
          options={polygonList!}
          onChange={e => {
            setSelectedPolygon && setSelectedPolygon(polygonList?.find(item => item?.uuid === e[0]));
          }}
        />
      </When>
      <Text variant="text-16-bold">{`${entityType} Status`}</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus?.(record?.status) ?? 0}
        labels={progressBarLabels}
        classNameLabels="min-w-[99px] "
        className={classNames("w-[98%] pl-[1%]", entityType === "Polygon" && "pl-[6%]")}
      />
      <When condition={!!recentRequest}>
        <div className="flex flex-col gap-2 rounded-xl border border-yellow-500 bg-yellow p-3">
          <div>
            <div className="flex items-baseline justify-between">
              <Text variant="text-16-bold">Change Requested</Text>
              <button onClick={deactivateRecentRequest} className="text-14-bold text-tertiary-600">
                Remove
              </button>
            </div>
            <Text variant="text-14-light">{recentRequestData(recentRequest!)}</Text>
          </div>
          <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
        </div>
      </When>
      <StatusDisplay
        titleStatus={entityType}
        name={entityType}
        refresh={refresh}
        mutate={mutate}
        record={record}
        tab={tab}
        checkPolygonsSite={checkPolygonsSite}
      />
      <Notification open={open} type="success" title="Success!" message="Your Change Request was just removed!" />
    </div>
  );
};

export default SiteAuditLogEntityStatusSide;
