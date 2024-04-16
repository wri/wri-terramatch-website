import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, Fragment, HTMLAttributes, SetStateAction, useRef, useState } from "react";
import { Else, If, Then, When } from "react-if";

import MapPolygonPanelItem, {
  MapPolygonPanelItemProps
} from "@/components/elements/MapPolygonPanel/MapPolygonPanelItem";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { PolygonAvailableData, PolygonData } from "@/pages/site/[uuid]/components/MockecData";

import Button from "../Button/Button";
import Checkbox from "../Inputs/Checkbox/Checkbox";
import FilterSearchBox from "../TableFilters/Inputs/FilterSearchBox";
import AttributeInformation from "./AttributeInformation";
import ChecklistInformation from "./ChecklistInformation";
import MapPolygonCheckPanelItem from "./MapPolygonCheckPanelItem";
import VersionInformation from "./VersionInformation";

export interface MapPolygonPanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: MapPolygonPanelItemProps[];
  onSelectItem: (item: MapPolygonPanelItemProps) => void;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
  emptyText?: string;
  setStateViewPanel: Dispatch<SetStateAction<boolean>>;
  stateViewPanel: boolean;
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
  editPolygon: boolean;
  tabEditPolygon: string;
  setTabEditPolygon: Dispatch<SetStateAction<string>>;
}

const MapPolygonPanel = ({
  title,
  items,
  className,
  onSelectItem,
  onSearch,
  onLoadMore,
  emptyText,
  setStateViewPanel,
  stateViewPanel,
  setEditPolygon,
  editPolygon,
  tabEditPolygon,
  setTabEditPolygon,
  ...props
}: MapPolygonPanelProps) => {
  const t = useT();
  const [selected, setSelected] = useState<MapPolygonPanelItemProps>();
  const refContainer = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div {...props} className={classNames(className)}>
      <If condition={!!editPolygon}>
        <Then>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Text variant="text-12-light" className="text-white ">
                Faja Lobi Project
              </Text>
              <Text variant="text-20-bold" className="mb-4 text-white">
                Iseme Site
              </Text>
            </div>

            <Button variant="text" onClick={() => setEditPolygon(false)} className="text-white hover:text-primary">
              <Icon name={IconNames.CLEAR} className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex rounded-lg bg-white">
            <button
              className={classNames(
                "text-12-semibold w-1/3 rounded-l-lg border border-neutral-300 p-3 hover:bg-neutral-100",
                tabEditPolygon === "Attributes"
                  ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
                  : "border border-neutral-300"
              )}
              onClick={() => {
                setTabEditPolygon("Attributes");
              }}
            >
              Attributes
            </button>
            <button
              className={classNames(
                "text-12-semibold w-1/3 border border-neutral-300 p-3 hover:bg-neutral-100",
                tabEditPolygon === "Checklist"
                  ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
                  : "border border-neutral-300"
              )}
              onClick={() => {
                setTabEditPolygon("Checklist");
              }}
            >
              Checklist
            </button>
            <button
              className={classNames(
                "text-12-semibold w-1/3 rounded-r-lg border border-neutral-300 p-3 hover:bg-neutral-100",
                tabEditPolygon === "Version"
                  ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
                  : "border border-neutral-300"
              )}
              onClick={() => {
                setTabEditPolygon("Version");
              }}
            >
              Version
            </button>
          </div>
          <div className="mr-[-10px] mt-4 h-[calc(100%-132px)] overflow-y-auto pr-2">
            <When condition={tabEditPolygon === "Attributes"}>{AttributeInformation}</When>
            <When condition={tabEditPolygon === "Checklist"}>{ChecklistInformation}</When>
            <When condition={tabEditPolygon === "Version"}>{VersionInformation}</When>
          </div>
        </Then>
        <Else>
          <div className="mb-4 flex rounded-lg bg-neutral-100 p-1">
            <Button
              variant={stateViewPanel ? "group-active-polygon" : "group-polygon"}
              className="!w-2/4 text-blueCustom-600"
              onClick={() => setStateViewPanel(true)}
            >
              Polygon Check
            </Button>
            <Button
              variant={stateViewPanel ? "group-polygon" : "group-active-polygon"}
              className="!w-2/4 text-blueCustom-600"
              onClick={() => setStateViewPanel(false)}
            >
              Site Polygons
            </Button>
          </div>
          <When condition={!stateViewPanel}>
            <FilterSearchBox placeholder={"Search"} className="mb-4 w-full" onChange={() => {}} />
            <div className="mb-3 flex items-start justify-between rounded-tl-lg">
              <Text variant="text-14-bold" className="flex items-center uppercase text-white">
                <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
                &nbsp; new Polygon
              </Text>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="rounded bg-white p-1.5" onClick={() => setOpenMenu(!openMenu)}>
                    <Icon name={IconNames.IC_FILTER} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
                  </div>
                  <When condition={openMenu}>
                    <div className="absolute z-10 mt-1 grid w-max gap-3 rounded-lg bg-white p-3 shadow">
                      <Checkbox
                        name=""
                        label={t("Draft")}
                        className="flex-row-reverse items-center justify-end gap-3"
                        textClassName="text-10-semibold"
                      />
                      <Checkbox
                        name=""
                        label={t("Submitted")}
                        className="flex-row-reverse items-center justify-end gap-3"
                        textClassName="text-10-semibold"
                      />
                      <Checkbox
                        name=""
                        label={t("Approved")}
                        className="flex-row-reverse items-center justify-end gap-3"
                        textClassName="text-10-semibold"
                      />
                      <Checkbox
                        name=""
                        label={t("Needs More Info")}
                        className="flex-row-reverse items-center justify-end gap-3"
                        textClassName="text-10-semibold"
                      />
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
                  items={PolygonData}
                  itemAs={Fragment}
                  render={item => (
                    <MapPolygonPanelItem
                      uuid={item.uuid}
                      title={item.title}
                      subtitle={item.subtitle}
                      onClick={() => {
                        setSelected(item);
                        onSelectItem(item);
                      }}
                      isSelected={selected?.uuid === item.uuid}
                      refContainer={refContainer}
                      setEditPolygon={setEditPolygon}
                    />
                  )}
                />
              </div>
            </div>
          </When>
          <When condition={!!stateViewPanel}>
            <Text variant="text-14" className="mb-6 text-white">
              Available polygons
            </Text>
            <div className="h-[calc(100%-150px)] rounded-bl-lg">
              {PolygonAvailableData.length === 0 && (
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
                  items={PolygonAvailableData}
                  itemAs={Fragment}
                  render={item => (
                    <MapPolygonCheckPanelItem
                      uuid={item.uuid}
                      title={item.title}
                      isSelected={selected?.uuid === item.uuid}
                      refContainer={refContainer}
                      setEditPolygon={setEditPolygon}
                      status={item.status}
                    />
                  )}
                />
              </div>
            </div>
            <Text variant="text-14-bold" className="mt-6 flex items-center uppercase text-white">
              <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
              &nbsp; Add Polygon
            </Text>
          </When>
        </Else>
      </If>
    </div>
  );
};

export default MapPolygonPanel;
