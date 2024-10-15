import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { fetchGetV2DashboardTotalSectionHeaderCountry } from "@/generated/apiComponents";
import TooltipGridMap from "@/pages/dashboard/components/TooltipGridMap";
import { createQueryParams } from "@/utils/dashboardUtils";

const client = new QueryClient();

export const DashboardPopup = (event: any) => {
  const isoCountry = event?.feature?.properties?.iso;
  const countryName = event?.feature?.properties?.country;
  const { addPopupToMap } = event;
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      const parsedFilters = {
        programmes: [],
        country: isoCountry,
        "organisations.type": [],
        landscapes: []
      };
      const queryParams: any = createQueryParams(parsedFilters);
      const response: any = await fetchGetV2DashboardTotalSectionHeaderCountry({ queryParams: queryParams });
      if (response) {
        const parsedItems = [
          {
            id: "1",
            title: "No. of Projects",
            value: ((response.total_enterprise_count || 0) + (response.total_non_profit_count || 0)).toString()
          },
          {
            id: "2",
            title: "Trees Planted",
            value: (response.total_trees_restored || 0).toString()
          },
          {
            id: "3",
            title: "Restoration Hectares",
            value: (response.total_hectares_restored || 0).toString()
          },
          {
            id: "4",
            title: "Jobs Created",
            value: (response.total_entries || 0).toString()
          }
        ];
        setItems(parsedItems);
        addPopupToMap();
      } else {
        console.error("No data returned from the API");
      }
    }
    fetchData();
  }, [isoCountry]);
  return (
    <>
      {items && (
        <QueryClientProvider client={client}>
          <TooltipGridMap label={countryName} learnMore={true} isoCountry={isoCountry} items={items} />
        </QueryClientProvider>
      )}
    </>
  );
};
