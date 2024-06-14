import { useT } from "@transifex/react";
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { PolygonData } from "@/pages/site/[uuid]/components/MockedData";

import Checkbox from "../Inputs/Checkbox/Checkbox";
import { MenuItem } from "../MenuItem/MenuItem";
import Text from "../Text/Text";
import MapMenuPanelItem, { MapMenuPanelItemProps } from "./MapMenuPanelItem";

export interface MapPolygonSitePanelProps {
  emptyText?: string;
  onLoadMore: () => void;
  onSelectItem: (item: MapMenuPanelItemProps) => void;
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
  selected: MapMenuPanelItemProps | undefined;
  setSelected: Dispatch<SetStateAction<MapMenuPanelItemProps | undefined>>;
}

const MapPolygonSitePanel = ({
  emptyText,
  onLoadMore,
  onSelectItem,
  setEditPolygon,
  selected,
  setSelected
}: MapPolygonSitePanelProps) => {
  const t = useT();
  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const refContainer = useRef<HTMLDivElement>(null);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const checkboxRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current?.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

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
    <>
      <div className="mb-3 flex items-start justify-between rounded-tl-lg">
        <Text variant="text-14-bold" className="flex items-center uppercase text-white">
          <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
          &nbsp; {t("new Polygon")}
        </Text>
        <div className="flex items-center gap-2">
          <div className="relative" ref={menuRef}>
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
                  <div className="absolute top-0 left-full ml-2 rounded-lg bg-white p-1">
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
            <Icon name={IconNames.IC_SORT} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-159px)] rounded-bl-lg">
        {PolygonData.length === 0 && (
          <Text variant="text-16-light" className="mt-8 text-white">
            {emptyText ?? t("No result")}
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
            items={PolygonData}
            itemAs={Fragment}
            render={item => (
              <MapMenuPanelItem
                uuid={item.uuid}
                title={item.title}
                subtitle={item.subtitle}
                onClick={() => {
                  setSelected(item);
                  onSelectItem(item);
                }}
                isSelected={selected?.uuid === item.uuid}
                refContainer={refContainer}
                setClickedButton={() => {}}
                type="sites"
                status="draft"
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default MapPolygonSitePanel;
