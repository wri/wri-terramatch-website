import { useRouter } from "next/router";
import {
  cloneElement,
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState
} from "react";

import { DashboardProvider } from "@/context/dashboard.provider";
import { useGetV2DashboardCountries } from "@/generated/apiComponents";
import HeaderDashboard from "@/pages/dashboard/components/HeaderDashboard";

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
  const { data: dashboardCountries } = useGetV2DashboardCountries<{ data: CountriesProps[] }>({
    queryParams: {}
  });

  const [selectedCountry, setSelectedCountry] = useState<CountriesProps | undefined>(undefined);

  useEffect(() => {
    if (dashboardCountries) {
      console.log("Dashboard Countries", dashboardCountries, router.asPath);
      const country = dashboardCountries.data.find((country: CountriesProps) => {
        const slugFromPath = router.asPath.split("/")[2];
        return country.country_slug === slugFromPath;
      });
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [dashboardCountries, router.asPath]);

  const isProjectInsightsPage = router.pathname.includes("dashboard/project-insights");
  const isProjectListPage = router.pathname === "/dashboard/project-list";
  const isProjectPage = router.pathname === "dashboard/project";
  const childrenWithProps = props.children ? cloneElement(props.children as ReactElement, { selectedCountry }) : null;

  return (
    <DashboardProvider>
      <div className="flex max-h-screen min-h-screen w-full bg-neutral-70">
        <Sidebar />
        <main className={`flex flex-[1_1_0] flex-col overflow-hidden ${props.className}`}>
          {dashboardCountries && (
            <>
              <HeaderDashboard
                isProjectInsightsPage={isProjectInsightsPage}
                isProjectListPage={isProjectListPage}
                isProjectPage={isProjectPage}
                dashboardCountries={dashboardCountries.data}
                defaultSelectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
              />
              {childrenWithProps}
            </>
          )}
        </main>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
