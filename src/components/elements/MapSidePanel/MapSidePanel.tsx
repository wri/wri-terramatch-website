import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Fragment, HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useBoundingBox } from "@/connections/BoundingBox";
import { STATUSES } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { fetchDeleteV2TerrafundPolygonUuid, fetchGetV2TerrafundGeojsonComplete } from "@/generated/apiComponents";

import Button from "../Button/Button";
import Checkbox from "../Inputs/Checkbox/Checkbox";
import MapMenuPanelItem, { MapMenuPanelItemProps } from "../MapPolygonPanel/MapMenuPanelItem";
import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_BOTTOM } from "../Menu/MenuVariant";

export interface MapSidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: MapMenuPanelItemProps[];
  onSearch?: (query: string) => void;
  onLoadMore?: () => void;
  emptyText?: string;
  mapFunctions: any;
  checkedValues: string[];
  onCheckboxChange: (value: string, checked: boolean) => void;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
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
  type,
  recallEntityData,
  entityUuid,
  ...props
}: MapSidePanelProps) => {
  const t = useT();
  const menuCheckboxRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<MapMenuPanelItemProps>();
  const refContainer = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [clickedButton, setClickedButton] = useState<string>("");
  const checkboxRefs = useRef<HTMLInputElement[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { isMonitoring, setEditPolygon, setIsUserDrawingEnabled } = useMapAreaContext();
  const { map } = mapFunctions;

  const filteredItems = useMemo(() => {
    if (checkedValues.length === 0) {
      return items;
    }
    return items.filter(item => checkedValues.includes(item.status));
  }, [items, checkedValues]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [checkedValues]);

  const selectedPolygonBbox = useBoundingBox({ polygonUuid: selected?.poly_id });

  const flyToPolygonBounds = async () => {
    if (!map.current || !selectedPolygonBbox) {
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
      const siteUrl = `/site/${selected?.site_id}`;
      window.open(siteUrl, "_blank");
      setClickedButton("");
    } else if (clickedButton === "zoomTo") {
      flyToPolygonBounds();
      setClickedButton("");
    } else if (clickedButton === "download") {
      downloadGeoJsonPolygon(
        selected?.poly_id ?? "",
        selected?.poly_name ? formatStringName(selected.poly_name) : "polygon"
      );
      setClickedButton("");
    } else if (clickedButton === "delete") {
      deletePolygon(selected?.poly_id ?? "");
      setClickedButton("");
    } else if (clickedButton === "editPolygon") {
      setEditPolygon?.({ isOpen: true, uuid: selected?.poly_id ?? "", primary_uuid: selected?.primary_uuid ?? "" });
      if (selected?.poly_id) {
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
        <Text variant="text-14-semibold" className="flex items-center" onClick={() => setSortOrder("poly_name")}>
          Name
        </Text>
      )
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center" onClick={() => setSortOrder("status")}>
          Status
        </Text>
      )
    },
    {
      id: "3",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center" onClick={() => setSortOrder("created_at")}>
          Date Created
        </Text>
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
            {emptyText || t("No result")}
          </Text>
        )}
        <div ref={refContainer} className="h-full space-y-4 overflow-y-auto pr-1">
          <List
            as={Fragment}
            items={currentPageItems}
            itemAs={Fragment}
            render={item => (
              <MapMenuPanelItem
                key={item.uuid}
                uuid={item.uuid}
                title={item.title}
                subtitle={item.subtitle}
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
                poly_id={item.poly_id}
                site_id={entityUuid}
                validationStatus={item.validationStatus}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MapSidePanel;
