import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";
import { When } from "react-if";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { AuditStatusEntityType, formatAuditStatusEntityForDisplay } from "@/connections/AuditStatus";
import { SelectedItem } from "@/hooks/AuditStatus/useLoadEntityList";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay";

const SiteAuditLogEntityStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon,
  entityType = "sitePolygons",
  mutate,
  getValueForStatus,
  progressBarLabels,
  showChangeRequest = false,
  checkPolygonsSite,
  viewPD = false
}: {
  entityType: AuditStatusEntityType;
  refresh?: () => void;
  record?: any;
  polygonList?: any[];
  selectedPolygon?: SelectedItem | null;
  setSelectedPolygon?: Dispatch<SetStateAction<SelectedItem | null>> | null;
  mutate?: any;
  getValueForStatus?: (status: string) => number;
  progressBarLabels?: Array<{ id: string; label: string }>;
  showChangeRequest?: boolean;
  checkPolygonsSite?: boolean | undefined;
  viewPD?: boolean;
}) => {
  const displayEntityName = formatAuditStatusEntityForDisplay(entityType);

  return (
    <div className="flex flex-col gap-6 overflow-visible">
      <When condition={polygonList?.length}>
        <Dropdown
          label={`Select ${displayEntityName}`}
          labelVariant="text-16-bold"
          labelClassName="capitalize"
          optionsClassName="max-w-full"
          value={[selectedPolygon?.uuid ?? ""]}
          placeholder={`Select ${displayEntityName}`}
          options={polygonList!}
          onChange={e => {
            setSelectedPolygon && setSelectedPolygon(polygonList?.find(item => item?.uuid === e[0]));
          }}
        />
      </When>
      <Text variant="text-16-bold">{`${displayEntityName} Status`}</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus?.(record?.status) ?? 0}
        labels={progressBarLabels}
        classNameLabels="min-w-[52px] lg:min-w-[99px] !text-[9.5px] md:!text-[11px] lg:!text-[12px] wide:!text-[14px]"
        className={classNames("w-[98%] pl-[1%]", entityType === "sitePolygons" && "pl-[6%]")}
      />
      <StatusDisplay
        titleStatus={entityType}
        name={displayEntityName}
        refresh={refresh}
        mutate={mutate}
        record={record}
        showChangeRequest={showChangeRequest}
        checkPolygonsSite={checkPolygonsSite}
        viewPD={viewPD}
      />
    </div>
  );
};

export default SiteAuditLogEntityStatusSide;
