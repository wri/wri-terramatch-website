import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";
import { When } from "react-if";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { SelectedItem } from "@/hooks/AuditStatus/useLoadEntityList";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay";
import { AuditLogEntity } from "../constants/types";

const SiteAuditLogEntityStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon,
  entityType = "Polygon",
  mutate,
  getValueForStatus,
  progressBarLabels,
  showChangeRequest = false,
  checkPolygonsSite,
  viewPD = false
}: {
  entityType: AuditLogEntity;
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
  const removeUnderscore = (title: string) => title.replace("_", " ");

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
      <Text variant="text-16-bold">{`${removeUnderscore(entityType)} Status`}</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus?.(record?.status) ?? 0}
        labels={progressBarLabels}
        classNameLabels="min-w-[99px] "
        className={classNames("w-[98%] pl-[1%]", entityType === "Polygon" && "pl-[6%]")}
      />
      <StatusDisplay
        titleStatus={entityType}
        name={entityType}
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
