import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Fragment, HTMLAttributes, useRef, useState } from "react";

import MapSidePanelItem, { MapSidePanelItemProps } from "@/components/elements/MapSidePanel/MapSidePanelItem";
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
  const refContainer = useRef<HTMLDivElement>(null);

  return (
    <div {...props} className={classNames(className)}>
      <div className="mb-3 rounded-tl-lg">
        <Text variant="text-16-bold" className="text-white">
          {title}
        </Text>
      </div>
      <div className="h-[calc(100%-38px)] rounded-bl-lg">
        {items.length === 0 && (
          <Text variant="text-light-subtitle-400" className="mt-8 text-center">
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
                onClick={() => {
                  setSelected(item);
                  onSelectItem(item);
                }}
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
