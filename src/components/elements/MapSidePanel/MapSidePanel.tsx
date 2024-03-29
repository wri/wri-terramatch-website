import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Fragment, HTMLAttributes, useState } from "react";

import MapSidePanelItem, { MapSidePanelItemProps } from "@/components/elements/MapSidePanel/MapSidePanelItem";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";

export interface MapSidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: MapSidePanelItemProps[];
  onSelectItem: (item: MapSidePanelItemProps) => void;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
  emptyText?: string;
}

const MapSidePanel = ({
  title,
  items,
  className,
  onSelectItem,
  onSearch,
  onLoadMore,
  emptyText,
  ...props
}: MapSidePanelProps) => {
  const t = useT();
  const [selected, setSelected] = useState<MapSidePanelItemProps>();

  return (
    <div {...props} className={classNames(className)}>
      <div className="rounded-tl-lg bg-primary-200 px-5 py-4">
        <Text variant="text-bold-subtitle-400">{title}</Text>
      </div>
      <div className="h-[calc(100%-59px)] rounded-bl-lg border-2 border-t-0 border-neutral-100 p-4">
        <FilterSearchBox onChange={onSearch} className="w-full flex-shrink-0" placeholder={t("Search")} />
        {items.length === 0 && (
          <Text variant="text-light-subtitle-400" className="mt-8 text-center">
            {emptyText || t("No result")}
          </Text>
        )}
        <div
          className="h-[calc(100%-16px)] space-y-4 overflow-y-auto py-4"
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
                onClick={() => {
                  setSelected(item);
                  onSelectItem(item);
                }}
                isSelected={selected?.uuid === item.uuid}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MapSidePanel;
