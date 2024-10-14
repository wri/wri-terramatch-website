import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import TooltipGridMap from "@/pages/dashboard/components/TooltipGridMap";

const client = new QueryClient();

export const DashboardPopup = (event: any) => {
  const isoCountry = event?.feature?.properties?.iso;
  const countryName = event?.feature?.properties?.country;
  return (
    <QueryClientProvider client={client}>
      <TooltipGridMap label={countryName} learnMore={true} isoCountry={isoCountry} />
    </QueryClientProvider>
  );
};
