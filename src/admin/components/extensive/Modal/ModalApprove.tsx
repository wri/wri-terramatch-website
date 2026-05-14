import { useT } from "@transifex/react";
import { InlineMessage } from "@worldresources/wri-design-systems";
import { FC, useEffect, useMemo, useState } from "react";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import CollapsibleRow from "@/components/extensive/Modal/components/CollapsibleRow";
import { ModalProps } from "@/components/extensive/Modal/Modal";
import { ModalBaseSubmit } from "@/components/extensive/Modal/ModalsBases";
import { pruneEntityCache, useFullProject } from "@/connections/Entity";
import { SiteFullDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

export interface ModalApproveProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toogleButton?: boolean;
  status?: StatusEnum;
  onClose?: () => void;
  site: SiteFullDto | SiteLightDto | null;
  polygonList: SitePolygonLightDto[] | null;
}

interface AreaStats {
  message: string;
  type: "info" | "warning";
  currentArea: number;
  areaBeingApproved: number;
  newTotalArea: number;
  currentPercentage: number;
  newPercentage: number;
  projectGoal: number;
}

export interface DisplayedPolygonType {
  id: string | undefined;
  name: string | undefined;
  checked: boolean | undefined;
  canBeApproved: boolean | undefined;
  failingCriterias: string[] | undefined;
  status: StatusEnum | undefined;
  validationStatus?: string | null;
}

const checkCriteriaCanBeApproved = (validationStatus: string | null, checked: boolean, canBeApproved?: boolean) => {
  if (!checked) {
    return false;
  }

  if (canBeApproved !== undefined) {
    return canBeApproved;
  }

  if (validationStatus === "passed" || validationStatus === "partial") {
    return true;
  }

  return false;
};

interface InlineMessageCustomProps {
  label: string;
  type: "warning" | "info-grey";
  message: string;
}

const InlineMessageCustom: FC<InlineMessageCustomProps> = ({ label, type, message }) => {
  return (
    <div className="inline-message-full-width w-full">
      <InlineMessage caption={message} label={label} variant={type} />
    </div>
  );
};

const ModalApprove: FC<ModalApproveProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  toogleButton,
  children,
  status,
  site,
  onClose,
  polygonList,
  ...rest
}) => {
  const t = useT();
  const [displayedPolygons, setDisplayedPolygons] = useState<DisplayedPolygonType[]>([]);
  const [polygonsSelected, setPolygonsSelected] = useState<boolean[]>([]);

  const projectUuid = site !== null && "projectUuid" in site ? site.projectUuid : null;

  const [isProjectLoaded, { data: project }] = useFullProject({
    id: projectUuid ?? ""
  });

  useEffect(() => {
    if (projectUuid) {
      pruneEntityCache("projects", projectUuid);
    }
  }, [projectUuid]);

  useEffect(() => {
    if (!polygonList) {
      return;
    }
    setPolygonsSelected(polygonList.map(() => false));
  }, [polygonList]);

  useEffect(() => {
    if (!polygonList) {
      return;
    }

    setPolygonsSelected(polygonList.map(() => false));

    setDisplayedPolygons(
      polygonList.map((polygon: SitePolygonLightDto) => {
        const checked =
          polygon.validationStatus === "passed" ||
          polygon.validationStatus === "partial" ||
          polygon.validationStatus === "failed";

        const canBeApproved = checkCriteriaCanBeApproved(
          polygon.validationStatus,
          checked,
          (polygon as SitePolygonLightDto & { canBeApproved?: boolean }).canBeApproved
        );

        return {
          id: polygon.polygonUuid ?? undefined,
          checked,
          name: polygon.name ?? "Unnamed Polygon",
          canBeApproved,
          failingCriterias: [],
          status: polygon.status as StatusEnum,
          validationStatus: polygon.validationStatus
        };
      })
    );
  }, [polygonList]);

  const areaStats = useMemo<AreaStats | null>(() => {
    if (project === null || project === undefined || !isProjectLoaded) {
      return null;
    }

    const projectGoal = project.totalHectaresRestoredGoal ?? null;
    const currentApprovedArea = project.totalHectaresRestoredSum ?? null;

    if (projectGoal === null || currentApprovedArea === null) {
      return null;
    }

    if (polygonList === null || polygonList === undefined) {
      return null;
    }

    const selectedPolygons: SitePolygonLightDto[] = polygonsSelected
      .map((selected, index) => (selected && polygonList[index] ? polygonList[index] : null))
      .filter((polygon): polygon is SitePolygonLightDto => polygon !== null);

    if (selectedPolygons.length === 0) {
      return null;
    }

    const areaBeingApproved = selectedPolygons.reduce((sum, polygon) => {
      const area = polygon.calcArea ?? null;
      return sum + (area !== null ? area : 0);
    }, 0);

    if (areaBeingApproved === 0) {
      return null;
    }

    const newTotalArea = currentApprovedArea + areaBeingApproved;
    const currentPercentage = projectGoal > 0 ? (currentApprovedArea / projectGoal) * 100 : 0;
    const newPercentage = projectGoal > 0 ? (newTotalArea / projectGoal) * 100 : 0;

    const wouldExceed125 = newPercentage > 125;
    const messageType: "info" | "warning" = wouldExceed125 ? "warning" : "info";

    const formatNumber = (num: number): string => {
      return num.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 });
    };

    const polygonCount = selectedPolygons.length;
    const polygonText = polygonCount === 1 ? "polygon" : "polygons";
    const getVerb = polygonCount === 1 ? "gets" : "get";

    const message = t(
      "Approving {count} {polygonText} will change the total approved area for the project. Approved polygons currently sum to {currentArea} ha ({currentPercentage}%). If {count} {polygonText} ({areaBeingApproved} ha) {get} approved, the total would be {newTotalArea} ha ({newPercentage}%) of the total hectares to be restored ({projectGoal} ha).",
      {
        count: polygonCount,
        polygonText,
        currentArea: formatNumber(currentApprovedArea),
        currentPercentage: formatNumber(currentPercentage),
        areaBeingApproved: formatNumber(areaBeingApproved),
        get: getVerb,
        newTotalArea: formatNumber(newTotalArea),
        newPercentage: formatNumber(newPercentage),
        projectGoal: formatNumber(projectGoal)
      }
    );

    return {
      message,
      type: messageType,
      currentArea: currentApprovedArea,
      areaBeingApproved,
      newTotalArea,
      currentPercentage,
      newPercentage,
      projectGoal
    };
  }, [project, polygonList, polygonsSelected, isProjectLoaded, t]);

  const handleSelectAll = (isChecked: boolean) => {
    if (displayedPolygons.length > 0) {
      const newSelected: boolean[] = displayedPolygons.map((polygon, index) => {
        if (isChecked) {
          const currentValue = polygonsSelected[index] ?? false;
          return currentValue || (polygon.canBeApproved === true && polygon.status !== StatusEnum.APPROVED);
        }
        return false;
      });
      setPolygonsSelected(newSelected);
    }
  };

  return (
    <ModalBaseSubmit {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        {iconProps && (
          <Icon
            {...iconProps}
            width={iconProps.width ?? 40}
            className={tw("mb-8", iconProps.className)}
            style={{ minHeight: iconProps.height ?? iconProps.width ?? 40 }}
          />
        )}
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{title}</Text>
        </div>
        {areaStats && (
          <InlineMessageCustom
            label={areaStats.newPercentage > 125 ? "Warning" : "Info"}
            type={areaStats.newPercentage > 125 ? "warning" : "info-grey"}
            message={areaStats.message}
          />
        )}
        <div className="mb-2 flex items-center">
          {content && (
            <Text as="div" variant="text-12-light" className="my-1" containHtml>
              {content}
            </Text>
          )}
          <Text variant="text-14-bold" className="ml-auto flex items-center justify-end gap-2">
            <Checkbox
              className="flex h-min items-center"
              name="Select All"
              onClick={e => handleSelectAll((e.target as HTMLInputElement).checked)}
            />
            <span className="text-14-bold leading-[normal]">Select All</span>
          </Text>
        </div>

        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {"Name"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {"Status"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {"Polygon Check"}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {"Approve"}
            </Text>
          </header>
          {displayedPolygons?.map((item, index) => (
            <CollapsibleRow
              key={item.id}
              type="modalApprove"
              item={item}
              index={index}
              polygonsSelected={polygonsSelected}
              setPolygonsSelected={setPolygonsSelected}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        {secondaryButtonProps && (
          <Button {...secondaryButtonProps} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        )}
        <Button
          {...primaryButtonProps}
          onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
            if (polygonList === null || polygonList === undefined) {
              if (primaryButtonProps?.onClick) {
                (primaryButtonProps.onClick as unknown as (polygons: SitePolygonLightDto[]) => void)([]);
              }
              return;
            }

            const polygons: SitePolygonLightDto[] = polygonsSelected
              .map((polygonSelected, index: number) => {
                if (polygonSelected && polygonList[index]) {
                  return polygonList[index];
                }
                return null;
              })
              .filter((polygon): polygon is SitePolygonLightDto => polygon !== null);

            if (primaryButtonProps?.onClick) {
              (primaryButtonProps.onClick as unknown as (polygons: SitePolygonLightDto[]) => void)(polygons);
            }
          }}
        >
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalApprove;
