import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { cloneElement, DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactElement, useState } from "react";
import { When } from "react-if";

import { useGadmChoices } from "@/connections/Gadm";
import { DashboardProvider } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import HeaderDashboard from "@/pages/dashboard/components/HeaderDashboard";

import Loader from "../Loading/Loader";
import Sidebar from "../Sidebar/Sidebar";

interface DashboardLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLoggedIn?: boolean;
  user?: { name: string; email: string }; // Example data to pass
}

export interface CountriesProps {
  data: {
    label: string;
    icon: string;
  };
  id: number;
  country_slug: string;
}

const DashboardLayout = (props: PropsWithChildren<DashboardLayoutProps>) => {
  const router = useRouter();
  const countryChoices = useGadmChoices({ level: 0 });
  const [selectedCountry, setSelectedCountry] = useState<CountriesProps | undefined>(undefined);
  const { loading } = useLoading();

  const isImpactStoryPage = router.pathname.includes("dashboard/impact-story");
  const isProjectInsightsPage = router.pathname.includes("dashboard/project-insights");
  const isProjectListPage = router.pathname === "/dashboard/project-list";
  const isProjectPage = router.pathname === "dashboard/project";
  const isHomepage = router.pathname === "/dashboard/learn-more";
  const childrenWithProps = props.children ? cloneElement(props.children as ReactElement, { selectedCountry }) : null;
  const isMobile = useMediaQuery("(max-width: 1200px)");
  return (
    <DashboardProvider>
      {loading && (
        <div className="fixed z-50 flex h-screen w-full items-center justify-center backdrop-brightness-50">
          <Loader />
        </div>
      )}
      <div className="flex max-h-screen min-h-screen w-full bg-neutral-70 mobile:h-[100dvh] mobile:max-h-[100dvh] mobile:min-h-[100dvh] mobile:w-full mobile:flex-col">
        <Sidebar />
        <main className={`flex flex-[1_1_0] flex-col overflow-hidden ${props.className} mobile:bg-white`}>
          <>
            <When condition={!isImpactStoryPage || isMobile}>
              <HeaderDashboard
                isProjectInsightsPage={isProjectInsightsPage}
                isProjectListPage={isProjectListPage}
                isProjectPage={isProjectPage}
                isHomepage={isHomepage}
                isImpactStoryPage={isImpactStoryPage}
                gadmCountries={countryChoices}
                defaultSelectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
              />
            </When>
            {childrenWithProps}
          </>
        </main>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
