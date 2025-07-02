import { Box, LinearProgress } from "@mui/material";
import { useT } from "@transifex/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Drawer from "@/components/elements/Drawer/Drawer";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { formatFileName } from "@/components/elements/Map-mapbox/utils";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_LEFT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import { MENU_ITEM_VARIANT_DIVIDER } from "@/components/elements/MenuItem/MenuItemVariant";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useBoundingBox } from "@/connections/BoundingBox";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchDeleteV2TerrafundPolygonUuid,
  fetchGetV2TerrafundGeojsonComplete,
  useGetV2TerrafundValidationSite
} from "@/generated/apiComponents";
import { OptionValue } from "@/types/common";

import PolygonDrawer from "./PolygonDrawer/PolygonDrawer";
import PolygonItem from "./PolygonItem";

export interface IPolygonItem {
  id: string;
  status: "draft" | "submitted" | "approved" | "needs-more-information";
  label: string;
  uuid: string;
  validationStatus?: string;
}

export interface IpolygonFromMap {
  isOpen: boolean;
  uuid: string;
}

export interface IPolygonProps {
  menu: IPolygonItem[];
  polygonFromMap?: IpolygonFromMap;
  setPolygonFromMap?: any;
  refresh?: () => void;
  mapFunctions: any;
  totalPolygons?: number;
  siteUuid?: string;
}

export const polygonData = [
  { id: "1", name: "Site-polygon001.geojson", status: "We are processing your polygon", isUploaded: false },
  { id: "2", name: "Site-polygon002.geojson", status: "We are processing your polygon", isUploaded: false },
  { id: "3", name: "Site-polygon003.geojson", status: "We are processing your polygon", isUploaded: true },
  { id: "4", name: "Site-polygon004.geojson", status: "We are processing your polygon", isUploaded: true },
  { id: "5", name: "Site-polygon005.geojson", status: "We are processing your polygon", isUploaded: true }
];

const Polygons = (props: IPolygonProps) => {
  const t = useT();
  const [isOpenPolygonDrawer, setIsOpenPolygonDrawer] = useState(false);
  const [polygonMenu, setPolygonMenu] = useState<IPolygonItem[]>(props.menu);
  const { polygonFromMap, setPolygonFromMap, mapFunctions, siteUuid } = props;
  const { map } = mapFunctions;
  const containerRef = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useModalContext();
  const [selectedPolygon, setSelectedPolygon] = useState<IPolygonItem>();
  const [isPolygonStatusOpen, setIsPolygonStatusOpen] = useState(false);
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const reloadSiteData = context?.reloadSiteData;
  const sitePolygonData = context?.sitePolygonData;
  const {
    setSelectedPolygonsInCheckbox,
    selectedPolygonsInCheckbox,
    setValidFilter,
    validationData,
    setValidationData,
    validationDataTimestamp,
    setValidationDataTimestamp,
    isFetchingValidationData,
    setIsFetchingValidationData
  } = contextMapArea;
  const [openCollapseAll, setOpenCollapseAll] = useState(false);
  const [currentPolygonUuid, setCurrentPolygonUuid] = useState<string | undefined>(undefined);
  const bbox = useBoundingBox({ polygonUuid: currentPolygonUuid });

  const { refetch: fetchValidationData } = useGetV2TerrafundValidationSite(
    {
      queryParams: {
        uuid: siteUuid ?? ""
      }
    },
    {
      enabled: false, // Don't fetch on mount, only when explicitly called
      staleTime: 5 * 60 * 1000,
      onSuccess: data => {
        if (data && siteUuid) {
          setValidationData((prev: any) => ({
            ...prev,
            [siteUuid]: data
          }));
          setValidationDataTimestamp(Date.now());
        }
        setIsFetchingValidationData(false);
      }
    }
  );

  useEffect(() => {
    setPolygonMenu(props.menu);
  }, [props.menu]);
  useEffect(() => {
    if (polygonFromMap?.isOpen) {
      const newSelectedPolygon = polygonMenu.find(polygon => polygon.uuid === polygonFromMap.uuid);
      setSelectedPolygon(newSelectedPolygon);
      setIsOpenPolygonDrawer(true);
    } else {
      setIsOpenPolygonDrawer(false);
      setSelectedPolygon(undefined);
    }
  }, [polygonFromMap, polygonMenu]);

  // If bbox is loaded, use it to fit the map
  useEffect(() => {
    if (bbox != null && map.current) {
      map.current.fitBounds(bbox, {
        padding: 100,
        linear: false
      });
      setCurrentPolygonUuid(undefined);
    }
  }, [bbox, map]);

  const handleExpandCollapseToggle = useCallback(() => {
    if (
      !openCollapseAll &&
      siteUuid &&
      (!validationData[siteUuid] || Date.now() - validationDataTimestamp > 5 * 60 * 1000)
    ) {
      setIsFetchingValidationData(true);
      fetchValidationData();
    }
    setOpenCollapseAll(!openCollapseAll);
  }, [
    openCollapseAll,
    siteUuid,
    validationData,
    validationDataTimestamp,
    setIsFetchingValidationData,
    fetchValidationData
  ]);

  const downloadGeoJsonPolygon = async (polygon: IPolygonItem) => {
    const polygonGeojson = await fetchGetV2TerrafundGeojsonComplete({
      queryParams: { uuid: polygon.uuid }
    });
    const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formatFileName(polygon?.label === "Unnamed Polygon" ? "polygon" : polygon?.label)}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const flyToPolygonBounds = (polygon: IPolygonItem) => {
    setCurrentPolygonUuid(polygon.uuid);
  };

  const deletePolygon = async (polygon: IPolygonItem) => {
    const response: any = await fetchDeleteV2TerrafundPolygonUuid({ pathParams: { uuid: polygon.uuid } });
    if (response?.uuid) {
      reloadSiteData?.();
      closeModal(ModalId.CONFIRM_POLYGON_DELETION);
    }
  };

  const openFormModalHandlerConfirm = (item: any) => {
    openModal(
      ModalId.CONFIRM_POLYGON_DELETION,
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polygon?"
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_DELETION)}
        onConfirm={() => {
          deletePolygon(item);
        }}
      />
    );
  };

  const polygonMenuItems = (item: any) => [
    {
      id: "1",
      render: () => (
        <div className="flex w-full items-center gap-2">
          <Icon name={IconNames.POLYGON} className="h-6 w-6" />
          <Text variant="text-12-bold">Edit Polygon</Text>
        </div>
      ),
      onClick: () => {
        setSelectedPolygon(item);
        flyToPolygonBounds(item);
        setPolygonFromMap({ isOpen: true, uuid: item.uuid });
        setIsOpenPolygonDrawer(true);
        setIsPolygonStatusOpen(false);
        setSelectedPolygonsInCheckbox([]);
      }
    },
    {
      id: "2",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.SEARCH_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Zoom to</Text>
        </div>
      ),
      onClick: () => {
        flyToPolygonBounds(item);
      }
    },
    {
      id: "3",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.DOWNLOAD_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Download</Text>
        </div>
      ),
      onClick: () => {
        downloadGeoJsonPolygon(item);
      }
    },
    {
      id: "4",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.COMMENT} className="h-6 w-6" />
          <Text variant="text-12-bold">Comment</Text>
        </div>
      ),
      onClick: () => {
        setSelectedPolygon(item);
        flyToPolygonBounds(item);
        setPolygonFromMap({ isOpen: true, uuid: item.uuid });
        setIsOpenPolygonDrawer(true);
        setIsPolygonStatusOpen(false);
        setSelectedPolygonsInCheckbox([]);
      }
    },
    {
      id: "5",
      render: () => <div className="h-[1px] w-full bg-grey-750" />,
      MenuItemVariant: MENU_ITEM_VARIANT_DIVIDER
    },
    {
      id: "6",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.TRASH_PA} className="h-5 w-5" />
          <Text variant="text-12-bold">Delete Polygon</Text>
        </div>
      ),
      onClick: () => {
        openFormModalHandlerConfirm(item);
      }
    }
  ];

  const handleCheckboxChange = (uuid: string, isChecked: boolean) => {
    const polygonsChecked: any = (prevCheckedUuids: string[]) => {
      if (isChecked) {
        return [...prevCheckedUuids, uuid];
      } else {
        return prevCheckedUuids.filter((id: string) => id !== uuid);
      }
    };
    const checkedUuids = polygonsChecked(selectedPolygonsInCheckbox);
    setSelectedPolygonsInCheckbox(checkedUuids);
  };

  const polygonSitePolygonCount = sitePolygonData?.length ?? 0;
  return (
    <div>
      <Drawer isOpen={isOpenPolygonDrawer} setIsOpen={setIsOpenPolygonDrawer} setPolygonFromMap={setPolygonFromMap}>
        {isOpenPolygonDrawer && (
          <PolygonDrawer
            polygonSelected={selectedPolygon?.uuid ?? ""}
            isPolygonStatusOpen={isPolygonStatusOpen}
            refresh={props?.refresh}
            isOpenPolygonDrawer={isOpenPolygonDrawer}
            setSelectedPolygonToDrawer={setSelectedPolygon as any}
            selectedPolygonIndex={selectedPolygon?.id}
            setPolygonFromMap={setPolygonFromMap}
            polygonFromMap={polygonFromMap}
            setIsOpenPolygonDrawer={setIsOpenPolygonDrawer}
          />
        )}
      </Drawer>
      <div className="mb-4 flex items-center justify-between gap-0.5">
        <Text variant="text-16-bold" className="text-darkCustom">
          Polygons
        </Text>
        <div className="flex items-center justify-start gap-2">
          <div className="flex flex-col gap-1">
            <When condition={props.totalPolygons ?? 0 > 0}>
              <Text variant={window.innerWidth > 1900 ? "text-14" : "text-12"} className="text-darkCustom">
                <span className="font-bold">{polygonSitePolygonCount}</span> of{" "}
                <span className="font-bold">{props.totalPolygons}</span> polygons loaded
              </Text>
              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="determinate"
                  value={(polygonSitePolygonCount / (props.totalPolygons ?? 1)) * 100}
                  sx={{ borderRadius: 5 }}
                />
              </Box>
            </When>
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Dropdown
          options={[
            { title: t("All validation statuses"), value: "all" },
            { title: t("Not checked"), value: "not_checked" },
            { title: t("Failed"), value: "failed" },
            { title: t("Partial Passed"), value: "partial" },
            { title: t("Passed"), value: "passed" }
          ]}
          defaultValue={["all"]}
          value={["all"]}
          onChange={(value: OptionValue[]) => {
            setValidFilter(value[0] as string);
          }}
          titleClassname="leading-[normal] !text-darkCustom"
          inputVariant={window.innerWidth > 1900 ? "text-14-semibold" : "text-12-semibold"}
          className="h-9 min-w-[120px] px-2 py-1 lg:px-3"
        />
        <Button
          variant="white-border"
          onClick={handleExpandCollapseToggle}
          className="flex h-9 gap-1.5 !rounded-lg px-2 !capitalize !text-darkCustom lg:px-3"
          disabled={isFetchingValidationData}
        >
          {openCollapseAll ? (
            <Icon name={IconNames.IC_SHINK} className="mr-1 h-[0.8rem] w-[0.8rem] !text-darkCustom" />
          ) : (
            <Icon name={IconNames.IC_EXPAND} className="mr-1 h-[0.8rem] w-[0.8rem] !text-darkCustom" />
          )}
          <span
            className={window.innerWidth > 1900 ? "text-14-bold !text-darkCustom" : "text-12-bold !text-darkCustom"}
          >
            {isFetchingValidationData ? "Loading..." : openCollapseAll ? "Shrink  " : "Expand"}
          </span>
        </Button>
      </div>
      <div ref={containerRef} className="-m-2 flex max-h-[150vh] flex-col gap-2 overflow-auto p-2">
        {polygonMenu.map(item => (
          <div key={item.id}>
            <PolygonItem
              uuid={item.uuid}
              title={item.label}
              status={item.status}
              validationStatus={item.validationStatus}
              isChecked={selectedPolygonsInCheckbox.includes(item.uuid)}
              onCheckboxChange={handleCheckboxChange}
              menu={
                <Menu
                  className="ml-auto"
                  container={containerRef.current}
                  menu={polygonMenuItems(item)}
                  placement={MENU_PLACEMENT_LEFT_BOTTOM}
                >
                  <Icon name={IconNames.ELIPSES} className="h-4 w-4" />
                </Menu>
              }
              isCollapsed={openCollapseAll}
              siteId={siteUuid}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polygons;
