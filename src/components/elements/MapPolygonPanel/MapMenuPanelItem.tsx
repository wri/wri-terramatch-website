import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import { When } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useGetV2TerrafundValidationCriteriaData } from "@/generated/apiComponents";
import { isValidCriteriaData, parseValidationData } from "@/helpers/polygonValidation";

import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";
import { StatusEnum } from "../Status/constants/statusMap";
import Status from "../Status/Status";
import ChecklistErrorsInformation from "./ChecklistErrorsInformation";

export interface MapMenuPanelItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  subtitle?: string;
  status: string;
  isSelected?: boolean;
  poly_id?: string;
  site_id?: string;
  setClickedButton: React.Dispatch<React.SetStateAction<string>>;
  refContainer: React.RefObject<HTMLDivElement> | null;
  type: string;
  poly_name?: string;
  primary_uuid?: string;
  isCollapsed?: boolean;
  isChecked?: boolean;
  onCheckboxChange: (uuid: string, isChecked: boolean) => void;
}

const MapMenuPanelItem = ({
  uuid,
  title,
  subtitle,
  status,
  poly_id = "",
  primary_uuid,
  isSelected,
  setClickedButton,
  className,
  refContainer,
  type,
  isCollapsed,
  isChecked = false,
  onCheckboxChange,
  ...props
}: MapMenuPanelItemProps) => {
  let imageStatus = `IC_${status.toUpperCase().replace(/-/g, "_")}`;
  const { openModal, closeModal } = useModalContext();
  const { isMonitoring, shouldRefetchValidation, setShouldRefetchValidation } = useMapAreaContext();
  const [openCollapse, setOpenCollapse] = useState(false);
  const [validationStatus, setValidationStatus] = useState<boolean | undefined>(undefined);
  const t = useT();
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>([]);
  const { data: criteriaData, refetch } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: {
        uuid: poly_id
      }
    },
    {
      enabled: !!poly_id
    }
  );

  useEffect(() => {
    refetch();
    setShouldRefetchValidation(false);
  }, [shouldRefetchValidation]);

  useEffect(() => {
    if (criteriaData?.criteria_list && criteriaData.criteria_list.length > 0) {
      setPolygonValidationData(parseValidationData(criteriaData));
      setValidationStatus(isValidCriteriaData(criteriaData));
    } else {
      setValidationStatus(undefined);
    }
  }, [criteriaData, setValidationStatus]);

  const handleCheckboxClick = () => {
    onCheckboxChange(poly_id, !isChecked);
  };

  const openFormModalHandlerConfirm = () => {
    openModal(
      ModalId.CONFIRM_POLYGON_DELETION,
      <ModalConfirm
        title={t("Confirm Polygon Deletion")}
        content={t("Do you want to delete this polygon?")}
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_DELETION)}
        onConfirm={() => {
          setClickedButton("delete");
          closeModal(ModalId.CONFIRM_POLYGON_DELETION);
        }}
      />
    );
  };

  const openFormModalHandlerAddCommentary = () => {
    openModal(
      ModalId.MODAL_WITH_LOGO,
      <ModalWithLogo
        uuid={uuid}
        title={title}
        onClose={() => closeModal(ModalId.MODAL_WITH_LOGO)}
        status={status as StatusEnum}
        primaryButtonText={t("Close")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => closeModal(ModalId.MODAL_WITH_LOGO)
        }}
      />,
      true
    );
  };

  const commonItems = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Zoom to")}
        </Text>
      ),
      onClick: () => setClickedButton("zoomTo")
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Download")}
        </Text>
      ),
      onClick: () => setClickedButton("download")
    }
  ];

  const monitoringItems = [
    {
      id: "0",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.IC_SITE_VIEW} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Edit Polygon")}
        </Text>
      ),
      onClick: () => setClickedButton("editPolygon")
    },
    ...commonItems,
    {
      id: "4",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.COMMENT} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Comment")}
        </Text>
      ),
      onClick: () => {
        setClickedButton("zoomTo");
        openFormModalHandlerAddCommentary();
      }
    },
    {
      id: "5",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.TRASH_PA} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Delete Polygon")}
        </Text>
      ),
      onClick: () => openFormModalHandlerConfirm()
    }
  ];

  const nonMonitoringItems = [
    ...(type !== "sites"
      ? [
          {
            id: "0",
            render: () => (
              <Text variant="text-14-semibold" className="flex items-center" onClick={() => setClickedButton("site")}>
                <Icon name={IconNames.IC_SITE_VIEW} className="h-4 w-4 lg:h-5 lg:w-5" />
                &nbsp; {t("View Site")}
              </Text>
            )
          }
        ]
      : []),
    ...commonItems
  ];
  const itemsPrimaryMenu = isMonitoring ? monitoringItems : nonMonitoringItems;
  return (
    <div
      {...props}
      className={classNames(
        className,
        "flex flex-col rounded-lg border-2 border-transparent bg-white p-2 hover:border-primary",
        {
          "border-primary-500": isSelected,
          "border-neutral-500 hover:border-neutral-800": !isSelected
        }
      )}
    >
      <div className="flex items-center gap-2">
        <Checkbox name="" checked={isChecked} onClick={handleCheckboxClick} />
        <div className="min-h-11 min-w-11">
          <Icon
            name={IconNames[imageStatus as keyof typeof IconNames]}
            className=" h-11 w-11 rounded-lg bg-neutral-300"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-2 overflow-hidden">
          <div className="flex flex-1 items-center gap-1">
            <Text variant="text-12-bold" className="overflow-hidden text-ellipsis whitespace-nowrap" title={t(title)}>
              {t(title)}
            </Text>
            <button className="min-w-3 min-h-3" onClick={() => setOpenCollapse(!openCollapse)}>
              <Icon
                name={IconNames.CHEVRON_DOWN_PA}
                className={`h-3 w-3 text-black transition-transform duration-300 ${
                  openCollapse ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <Menu
              className="ml-auto"
              container={refContainer?.current}
              placement={MENU_PLACEMENT_RIGHT_BOTTOM}
              menu={itemsPrimaryMenu}
              extraData={{
                uuid,
                title,
                subtitle,
                status
              }}
            >
              <Icon
                name={IconNames.IC_MORE_OUTLINED}
                className="h-4 w-4 rounded-lg hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
              />
            </Menu>
          </div>
          <div className="flex items-center justify-between">
            <Status status={status as StatusEnum} variant="small" textVariant="text-10" />
            <When condition={validationStatus == undefined}>
              <Text variant="text-10" className="flex items-center gap-1 whitespace-nowrap text-grey-700">
                <Icon name={IconNames.CROSS_CIRCLE} className="h-2 w-2" />
                {t("Not Checked")}
              </Text>
            </When>
            <When condition={validationStatus}>
              <Text variant="text-10" className="flex items-center gap-1 text-green">
                <Icon name={IconNames.STATUS_APPROVED} className="h-2 w-2" />
                {t("Passed")}
              </Text>
            </When>
            <When condition={validationStatus === false}>
              <Text variant="text-10" className="flex items-center gap-1 whitespace-nowrap text-red-200">
                <Icon name={IconNames.ROUND_RED_CROSS} className="h-2 w-2" />
                {t("Failed")}
              </Text>
            </When>
          </div>
        </div>
      </div>
      <When condition={openCollapse}>
        <When condition={validationStatus}>
          <Text variant="text-10-light" className="mt-4 text-blueCustom-900 opacity-80">
            {t(
              "This polygon passes even though both validations below have failed. It can still be approved by TerraMatch staff."
            )}
          </Text>
        </When>
        <ChecklistErrorsInformation polygonValidationData={polygonValidationData} />
      </When>
    </div>
  );
};

export default MapMenuPanelItem;
