import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { DetailedHTMLProps, Fragment, HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useBoundingBox } from "@/connections/BoundingBox";
import { STATUSES } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { fetchDeleteV2TerrafundPolygonUuid, fetchGetV2TerrafundGeojsonComplete } from "@/generated/apiComponents";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useDate } from "@/hooks/useDate";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { usePolygonsPagination } from "@/hooks/usePolygonsPagination";

import Button from "../Button/Button";
import Checkbox from "../Inputs/Checkbox/Checkbox";
import MapMenuPanelItem from "../MapPolygonPanel/MapMenuPanelItem";
import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_BOTTOM } from "../Menu/MenuVariant";

export interface MapSidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: SitePolygonLightDto[];
  onSearch?: (query: string) => void;
  onLoadMore?: () => void;
  emptyText?: string;
  mapFunctions: any;
  checkedValues: string[];
  onCheckboxChange: (value: string, checked: boolean) => void;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
  sortField: string;
  sortDirection: "ASC" | "DESC";
  setSortDirection: React.Dispatch<React.SetStateAction<"ASC" | "DESC">>;
  type: string;
  recallEntityData?: any;
  entityUuid?: string;
}

const MapSidePanel = ({
  title,
  items = [],
  className,
  onSearch,
  onLoadMore,
  emptyText,
  mapFunctions,
  checkedValues,
  onCheckboxChange,
  setSortOrder,
  sortField,
  sortDirection,
  setSortDirection,
  type,
  recallEntityData,
  entityUuid,
  ...props
}: MapSidePanelProps) => {
  const t = useT();
  const { format } = useDate();
  const menuCheckboxRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<SitePolygonLightDto>();
  const refContainer = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [clickedButton, setClickedButton] = useState<string>("");
  const checkboxRefs = useRef<HTMLInputElement[]>([]);

  const filteredItems = useMemo(() => {
    if (checkedValues.length === 0) {
      return items;
    }
    return items.filter(item => checkedValues.includes(item.status));
  }, [items, checkedValues]);

  const { currentPage, setCurrentPage, totalPages, startIndex, endIndex, currentPageItems } = usePolygonsPagination(
    filteredItems,
    [checkedValues]
  );

  const { isMonitoring, setEditPolygon, setIsUserDrawingEnabled } = useMapAreaContext();
  const { map } = mapFunctions;
  const isAdmin = useIsAdmin();

  const selectedPolygonBbox = useBoundingBox({ polygonUuid: selected?.polygonUuid ?? "" });

  const flyToPolygonBounds = async () => {
    if (!map.current || selectedPolygonBbox == null) {
      return;
    }
    map.current.fitBounds(selectedPolygonBbox, {
      padding: 100,
      linear: false
    });
  };

  const downloadGeoJsonPolygon = async (polygonUuid: string, polygon_name: string) => {
    const polygonGeojson = await fetchGetV2TerrafundGeojsonComplete({
      queryParams: { uuid: polygonUuid }
    });
    const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${polygon_name}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deletePolygon = async (polygonUuid: string) => {
    await fetchDeleteV2TerrafundPolygonUuid({ pathParams: { uuid: polygonUuid } });
    recallEntityData?.();
  };
  const formatStringName = (name: string) => {
    return name.replace(/ /g, "_");
  };

  useEffect(() => {
    if (clickedButton === "site") {
      const siteUrl = `/site/${entityUuid}`;
      window.open(siteUrl, "_blank");
      setClickedButton("");
    } else if (clickedButton === "zoomTo") {
      flyToPolygonBounds();
      setClickedButton("");
    } else if (clickedButton === "download") {
      downloadGeoJsonPolygon(selected?.polygonUuid ?? "", selected?.name ? formatStringName(selected.name) : "polygon");
      setClickedButton("");
    } else if (clickedButton === "delete") {
      deletePolygon(selected?.polygonUuid ?? "");
      setClickedButton("");
    } else if (clickedButton === "editPolygon") {
      setEditPolygon?.({ isOpen: true, uuid: selected?.polygonUuid ?? "", primary_uuid: selected?.primaryUuid ?? "" });
      if (selected?.polygonUuid) {
        flyToPolygonBounds();
      }
      setClickedButton("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedButton, selected, selectedPolygonBbox]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuCheckboxRef.current && !menuCheckboxRef.current?.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const itemsPrimaryMenu = [
    {
      id: "1",
      render: () => (
        <div className="flex w-full items-center justify-between">
          <Text variant="text-14-semibold" className="flex items-center" onClick={() => setSortOrder("name")}>
            Name
          </Text>
          {sortField === "name" && (
            <Button
              variant="text"
              onClick={() => setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC")}
              className="ml-2 p-1"
            >
              <Icon
                name={sortDirection === "ASC" ? IconNames.IC_A_TO_Z_CUSTOM : IconNames.IC_Z_TO_A_CUSTOM}
                className="h-3 w-3"
              />
            </Button>
          )}
        </div>
      )
    },
    {
      id: "2",
      render: () => (
        <div className="flex w-full items-center justify-between">
          <Text variant="text-14-semibold" className="flex items-center" onClick={() => setSortOrder("status")}>
            Status
          </Text>
          {sortField === "status" && (
            <Button
              variant="text"
              onClick={() => setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC")}
              className="ml-2 p-1"
            >
              <Icon
                name={sortDirection === "ASC" ? IconNames.IC_A_TO_Z_CUSTOM : IconNames.IC_Z_TO_A_CUSTOM}
                className="h-3 w-3"
              />
            </Button>
          )}
        </div>
      )
    },
    {
      id: "3",
      render: () => (
        <div className="flex w-full items-center justify-between">
          <Text variant="text-14-semibold" className="flex items-center" onClick={() => setSortOrder("createdAt")}>
            Date Created
          </Text>
          {sortField === "createdAt" && (
            <Button
              variant="text"
              onClick={() => setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC")}
              className="ml-2 p-1"
            >
              <Icon
                name={sortDirection === "ASC" ? IconNames.IC_A_TO_Z_CUSTOM : IconNames.IC_Z_TO_A_CUSTOM}
                className="h-3 w-3"
              />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div {...props} className={classNames("flex h-[250px] flex-1 flex-col", className)}>
      <div className="absolute top-0 left-0 -z-10 h-full w-full backdrop-blur-md" />
      <div className="mb-4 flex items-center justify-between rounded-tl-lg">
        {isMonitoring ? (
          <button className="text-white hover:text-primary-300" onClick={() => setIsUserDrawingEnabled(true)}>
            <Text variant="text-14-bold" className="flex items-center uppercase ">
              <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
              &nbsp; {t("new Polygon")}
            </Text>
          </button>
        ) : (
          <Text variant="text-16-bold" className="text-white">
            {t(title)}
          </Text>
        )}
        <div className="flex items-center gap-2">
          <div className="relative" ref={menuCheckboxRef}>
            <div className="rounded bg-white p-1.5" onClick={() => setOpenMenu(!openMenu)}>
              <Icon name={IconNames.IC_FILTER} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
            </div>
            <When condition={openMenu}>
              <div className="absolute z-10 mt-1 grid w-max gap-3 rounded-lg bg-white p-3 shadow">
                {STATUSES.map((status, index) => (
                  <Checkbox
                    ref={ref => ref && checkboxRefs.current.push(ref as HTMLInputElement)}
                    key={index}
                    name=""
                    label={t(status.label)}
                    className="flex w-full flex-row-reverse items-center justify-end gap-3"
                    textClassName="text-10-semibold"
                    checked={checkedValues.includes(status.value)}
                    onChange={e => onCheckboxChange(status.value, e.target.checked)}
                  />
                ))}
              </div>
            </When>
          </div>
          <div className="rounded bg-white p-1.5">
            <Menu
              container={refContainer?.current}
              placement={MENU_PLACEMENT_BOTTOM_BOTTOM}
              menu={itemsPrimaryMenu}
              classNameContentMenu="!mt-3 ml-[-7px]"
            >
              <Button variant="text" onClick={() => {}}>
                <Icon name={IconNames.IC_SORT} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
              </Button>
            </Menu>
          </div>
        </div>
      </div>
      {filteredItems.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <Text variant="text-12" className="text-white">
            Showing {(startIndex + 1).toLocaleString()}-{Math.min(endIndex, filteredItems.length).toLocaleString()} of{" "}
            {filteredItems.length.toLocaleString()} polygons
          </Text>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="flex h-6 w-6 items-center justify-center rounded border border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name={IconNames.CHEVRON_LEFT} className="h-3 w-3 text-white" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="flex h-6 w-6 items-center justify-center rounded border border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name={IconNames.CHEVRON_RIGHT} className="h-3 w-3 text-white" />
            </button>
          </div>
        </div>
      )}
      <div className="min-h-0 grow overflow-auto rounded-bl-lg">
        {items.length === 0 && (
          <Text variant="text-16-light" className="mt-8 text-white">
            {emptyText ?? t("No result")}
          </Text>
        )}
        <div ref={refContainer} className="h-full space-y-4 overflow-y-auto pr-1">
          <List
            as={Fragment}
            items={currentPageItems}
            itemAs={Fragment}
            uniqueId="uuid"
            render={item => (
              <MapMenuPanelItem
                key={item.uuid}
                uuid={item.uuid}
                title={item.name ?? t("Unnamed Polygon")}
                subtitle={t("Created {date}", { date: format(item.plantStart ?? "") })}
                status={item.status}
                onClick={() => {
                  setSelected(item);
                }}
                onClickCapture={() => {
                  setSelected(item);
                }}
                setClickedButton={setClickedButton}
                isSelected={selected?.uuid === item.uuid}
                refContainer={refContainer}
                type={type}
                poly_id={item.polygonUuid ?? ""}
                site_id={entityUuid}
                validationStatus={item.validationStatus ?? "notChecked"}
                isAdmin={isAdmin}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MapSidePanel;
