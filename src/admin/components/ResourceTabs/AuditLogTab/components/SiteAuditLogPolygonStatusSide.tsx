import classNames from "classnames";
import { Dispatch, SetStateAction, useState } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Notification from "@/components/elements/Notification/Notification";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { usePostV2AuditStatus } from "@/generated/apiComponents";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import { SelectedItem } from "@/hooks/useLoadEntityList";
import { Option } from "@/types/common";
import { recentRequestData } from "@/utils/statusUtils";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogPolygonStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon,
  auditLogData,
  recordType = "Polygon",
  mutate,
  getValueForStatus,
  progressBarLabels
}: {
  recordType?: "Polygon" | "Site";
  refresh?: () => void;
  record?: SelectedItem | null;
  polygonList?: SelectedItem[];
  selectedPolygon?: SelectedItem | null;
  setSelectedPolygon?: Dispatch<SetStateAction<SelectedItem | null>>;
  auditLogData?: AuditStatusResponse[];
  mutate?: any;
  getValueForStatus?: ((status: string) => number) | undefined;
  progressBarLabels?: Array<{ id: string; label: string }>;
}) => {
  const [open, setOpen] = useState(false);
  const recentRequest = auditLogData?.find(
    (item: AuditStatusResponse) => item.type == "change-request" && item.is_active
  );
  const { mutate: upload } = usePostV2AuditStatus();
  const deactivateRecentRequest = async () => {
    upload?.(
      {
        //@ts-ignore swagger issue
        body: {
          entity_uuid: record?.uuid,
          status: record?.status,
          entity: recordType === "Polygon" ? "SitePolygon" : recordType,
          comment: "",
          type: "change-request",
          is_active: false,
          request_removed: true
        }
      },
      {
        onSuccess: () => {
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 3000);
          refresh && refresh();
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 overflow-visible">
      <Dropdown
        label={`Select ${recordType}`}
        labelVariant="text-16-bold"
        labelClassName="capitalize"
        optionsClassName="max-w-full"
        value={[selectedPolygon?.uuid ?? ""]}
        placeholder={`Select ${recordType}`}
        options={polygonList! as Option[]}
        onChange={e => {
          console.log("onChange", e);
          setSelectedPolygon && setSelectedPolygon(polygonList?.find(item => item?.uuid === e[0]) as SelectedItem);
        }}
      />
      <Text variant="text-16-bold">{`${recordType} Status`}</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus ? getValueForStatus(record?.status ?? "") : 0}
        labels={progressBarLabels}
        classNameLabels="min-w-[99px] "
        className={classNames("w-[98%] pl-[1%]", recordType === "Polygon" && "pl-[6%]")}
      />
      {recentRequest && (
        <div className="flex flex-col gap-2 rounded-xl border border-yellow-500 bg-yellow p-3">
          <div>
            <div className="flex items-baseline justify-between">
              <Text variant="text-16-bold">Change Requested</Text>
              <button onClick={deactivateRecentRequest} className="text-14-bold text-tertiary-600">
                Remove
              </button>
            </div>
            <Text variant="text-14-light">{recentRequestData(recentRequest)}</Text>
          </div>
          <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
        </div>
      )}
      <StatusDisplay
        titleStatus={recordType}
        name={selectedPolygon?.title}
        refresh={refresh}
        mutate={mutate}
        record={record}
      />
      <Notification open={open} type="success" title="Success!" message="Your Change Request was just removed!" />
    </div>
  );
};

export default SiteAuditLogPolygonStatusSide;
