import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Fragment, HTMLAttributes, useEffect, useRef, useState } from "react";
import { When } from "react-if";

import MapSidePanelItem, { MapSidePanelItemProps } from "@/components/elements/MapSidePanel/MapSidePanelItem";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { fetchGetV2TerrafundGeojsonComplete, fetchGetV2TerrafundPolygonBboxUuid } from "@/generated/apiComponents";

import Button from "../Button/Button";
import Checkbox from "../Inputs/Checkbox/Checkbox";
import { MenuItem } from "../MenuItem/MenuItem";

export interface MapSidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: MapSidePanelItemProps[];
  onSelectItem: (item: MapSidePanelItemProps) => void;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
  emptyText?: string;
  mapFunctions: any;
}

const MapSidePanel = ({
  title,
  items,
  className,
  onSelectItem,
  onSearch,
  onLoadMore,
  emptyText,
  mapFunctions,
  ...props
}: MapSidePanelProps) => {
  const t = useT();
  const [selected, setSelected] = useState<MapSidePanelItemProps>();
  const refContainer = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [clickedButton, setClickedButton] = useState<string>("");
  const checkboxRefs = useRef<HTMLInputElement[]>([]);
  const { map } = mapFunctions;

  const flyToPolygonBounds = async (polygonUuid: string) => {
    const bbox = await fetchGetV2TerrafundPolygonBboxUuid({ pathParams: { uuid: polygonUuid } });
    const bounds: any = bbox.bbox;
    if (!map.current) {
      return;
    }
    map.current.fitBounds(bounds, {
      padding: 100,
      linear: false
    });
  };

  const downloadGeoJsonPolygon = async (polygonUuid: string) => {
    const polygonGeojson = await fetchGetV2TerrafundGeojsonComplete({
      queryParams: { uuid: polygonUuid }
    });
    const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `polygon.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    console.log("clickedButton", clickedButton);
    if (clickedButton === "site") {
      console.log("Site");
      setClickedButton("");
    } else if (clickedButton === "zoomTo") {
      flyToPolygonBounds(selected?.poly_id ?? "");
      setClickedButton("");
    } else if (clickedButton === "download") {
      downloadGeoJsonPolygon(selected?.poly_id ?? "");
      setClickedButton("");
    }
  }, [clickedButton, selected]);

  useEffect(() => {
    const handleChange = () => {
      const checked = checkboxRefs.current.some(ref => ref.checked);
      setOpenSubMenu(checked);
    };

    const checkbox = checkboxRefs.current;

    checkbox.forEach(ref => {
      if (ref) {
        ref.addEventListener("change", handleChange);
      }
    });

    handleChange();

    return () => {
      checkbox.forEach(ref => {
        if (ref) {
          ref.removeEventListener("change", handleChange);
        }
      });
    };
  }, [openMenu]);

  return (
    <div {...props} className={classNames(className)}>
      <div className="absolute top-0 left-0 -z-10 h-full w-full backdrop-blur-md" />
      <div className="mb-3 flex items-start justify-between rounded-tl-lg">
        <Text variant="text-16-bold" className="text-white">
          {title}
        </Text>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="rounded bg-white p-1.5" onClick={() => setOpenMenu(!openMenu)}>
              <Icon name={IconNames.IC_FILTER} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
            </div>
            <When condition={openMenu}>
              <div className="absolute z-10 mt-1 grid w-max gap-3 rounded-lg bg-white p-3 shadow">
                <Checkbox
                  ref={ref => ref && checkboxRefs.current.push(ref as HTMLInputElement)}
                  name=""
                  label={t("Draft")}
                  className="flex w-full flex-row-reverse items-center justify-end gap-3"
                  textClassName="text-10-semibold"
                />
                <Checkbox
                  ref={ref => ref && checkboxRefs.current.push(ref as HTMLInputElement)}
                  name=""
                  label={t("Submitted")}
                  className="flex w-full flex-row-reverse items-center justify-end gap-3"
                  textClassName="text-10-semibold"
                />
                <Checkbox
                  ref={ref => ref && checkboxRefs.current.push(ref as HTMLInputElement)}
                  name=""
                  label={t("Approved")}
                  className="flex w-full flex-row-reverse items-center justify-end gap-3"
                  textClassName="text-10-semibold"
                />
                <Checkbox
                  ref={ref => ref && checkboxRefs.current.push(ref as HTMLInputElement)}
                  name=""
                  label={t("Needs More Info")}
                  className="flex w-full flex-row-reverse items-center justify-end gap-3"
                  textClassName="text-10-semibold"
                />
                <When condition={openSubMenu}>
                  <div className="absolute left-full top-0 ml-2 rounded-lg bg-white p-1">
                    <MenuItem
                      render="Sort by date"
                      className="text-10-semibold"
                      onClick={() => {
                        setOpenSubMenu(false);
                      }}
                    ></MenuItem>
                    <MenuItem
                      render="Status"
                      className="text-10-semibold"
                      onClick={() => {
                        setOpenSubMenu(false);
                      }}
                    ></MenuItem>
                  </div>
                </When>
              </div>
            </When>
          </div>
          <div className="rounded bg-white p-1.5">
            <Button variant="text" onClick={() => {}}>
              <Icon name={IconNames.IC_SORT} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[calc(100%-38px)] rounded-bl-lg">
        {items.length === 0 && (
          <Text variant="text-16-light" className="mt-8 text-white">
            {emptyText || t("No result")}
          </Text>
        )}
        <div
          ref={refContainer}
          className="mr-[-12px] h-full space-y-4 overflow-y-auto pr-3"
          onScroll={e => {
            //@ts-ignore
            const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
            if (bottom) onLoadMore();
          }}
        >
          <List
            as={Fragment}
            items={items}
            itemAs={Fragment}
            render={item => (
              <MapSidePanelItem
                uuid={item.uuid}
                title={item.title}
                subtitle={item.subtitle}
                status={item.status}
                onClick={() => {
                  setSelected(item);
                  onSelectItem(item);
                }}
                setClickedButton={setClickedButton}
                isSelected={selected?.uuid === item.uuid}
                refContainer={refContainer}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MapSidePanel;
