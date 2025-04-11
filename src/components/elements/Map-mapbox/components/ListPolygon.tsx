import classNames from "classnames";
import { useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { fetchGetV2DashboardPolygonsPolyUuidCentroid } from "@/generated/apiComponents";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const ListPolygon = ({
  polygonsListData,
  setPolygonCentroid,
  handleZoomToBbox
}: {
  polygonsListData: any;
  setPolygonCentroid: any;
  handleZoomToBbox: any;
}) => {
  const [isOpenListPolygon, setIsOpenListPolygon] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);
  const handlePolygonClick = async (polygon: any) => {
    setSelectedPolygon(polygon);

    try {
      const response = await fetchGetV2DashboardPolygonsPolyUuidCentroid({
        pathParams: { polyUuid: polygon.poly_id }
      });
      if (response.centroid?.length) {
        setPolygonCentroid(response.centroid);
      }
    } catch (err) {
      console.error("Failed to fetch centroid.");
    }
  };

  const handleShowAllPolygons = () => {
    setSelectedPolygon(null);
    setPolygonCentroid(null);
    setIsOpenListPolygon(false);
    handleZoomToBbox();
  };

  return (
    <div className="relative">
      <Button
        variant="white-button-map"
        className="flex justify-between rounded-lg bg-white px-4 py-2 lg:py-2.5"
        onClick={() => setIsOpenListPolygon(!isOpenListPolygon)}
      >
        <div onClick={e => e.stopPropagation()} className="text-black hover:text-primary">
          <Icon name={IconNames.CHEVRON_DOWN} className="h-[14px] w-[14px] rotate-90" />
        </div>
        <Text variant="text-14" className="w-40 text-black">
          {selectedPolygon?.poly_name || "Select a polygon"}
        </Text>
        <div
          className={classNames("-rotate-90 text-black hover:text-primary", {
            "cursor-not-allowed text-neutral-450 hover:text-neutral-450": true
          })}
          onClick={e => e.stopPropagation()}
        >
          <Icon name={IconNames.CHEVRON_DOWN} className="h-[14px] w-[14px]" />
        </div>
      </Button>
      <When condition={isOpenListPolygon}>
        <div className="absolute left-0 top-full z-10 mt-2 flex h-96 w-full flex-col gap-2 overflow-y-auto overflow-x-hidden rounded-lg bg-white py-2">
          <Text
            variant="text-12"
            className="cursor-pointer px-4 py-1.5 text-black hover:text-primary"
            onClick={handleShowAllPolygons}
          >
            Show All Polygons
          </Text>
          <List
            items={polygonsListData}
            render={(item: any) => {
              return (
                <div key={item.uuid}>
                  <Text variant="text-12" className="px-4 text-black">
                    {item.name}
                  </Text>
                  <List
                    items={item.site_polygons}
                    render={(itemPolygon: any, index: number) => {
                      return (
                        <div
                          className="flex cursor-pointer items-center justify-between gap-2 px-4 hover:bg-primary/20"
                          onClick={() => setSelectedPolygon(itemPolygon)}
                          key={itemPolygon.uuid}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col items-center gap-1">
                              <hr
                                className={classNames("h-2 w-[1px] border-none bg-neutral-450", {
                                  "bg-transparent": index === 0
                                })}
                              ></hr>
                              <div
                                className={classNames("h-2 w-2 rounded-full", {
                                  "bg-primary": itemPolygon.uuid === selectedPolygon?.uuid,
                                  "bg-neutral-450": itemPolygon.uuid !== selectedPolygon?.uuid
                                })}
                              ></div>
                              <hr
                                className={classNames("h-2 w-[1px] border-none bg-neutral-450", {
                                  "bg-transparent": index === item.site_polygons.length - 1
                                })}
                              ></hr>
                            </div>
                            <Text
                              variant="text-12"
                              className={classNames("", {
                                "text-primary": itemPolygon.uuid === selectedPolygon?.uuid,
                                "text-black": itemPolygon.uuid !== selectedPolygon?.uuid
                              })}
                              onClick={() => handlePolygonClick(itemPolygon)}
                            >
                              {itemPolygon.poly_name}
                            </Text>
                          </div>
                          <When condition={itemPolygon.uuid === selectedPolygon?.uuid}>
                            <Icon
                              name={IconNames.CHECK}
                              className="h-[12px] min-h-[12px] w-[12px] min-w-[12px] text-primary"
                            />
                          </When>
                        </div>
                      );
                    }}
                  />
                </div>
              );
            }}
          />
        </div>
      </When>
    </div>
  );
};

export default ListPolygon;
