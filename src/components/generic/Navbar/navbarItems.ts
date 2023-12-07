import { useT } from "@transifex/react";

import { tourSelectors } from "@/components/extensive/WelcomeTour/useGetHomeTourItems";
import { V2MonitoringOrganisationRead } from "@/generated/apiSchemas";
import { zendeskSupportLink } from "@/utils/const";

interface INavbarItem {
  title: string;
  url: string;
  visibility: boolean;
  tourTarget?: string;
}
interface INavbarItems {
  public: INavbarItem[];
  private: INavbarItem[];
}

export const getNavbarItems = (t: typeof useT, myOrg?: V2MonitoringOrganisationRead | null): INavbarItems => {
  const visibility = Boolean(
    myOrg && myOrg?.status !== "rejected" && myOrg?.status !== "draft" && myOrg.users_status !== "requested"
  );

  return {
    public: [
      {
        title: t("Home"),
        url: "/",
        visibility: true
      },
      {
        title: t("Support"),
        url: zendeskSupportLink,
        visibility: true
      }
    ],
    private: [
      {
        title: t("Home"),
        url: "/home",
        visibility
      },
      {
        title: t("Opportunities"),
        url: "/opportunities",
        visibility,
        tourTarget: tourSelectors.OPPORTUNITIES
      },
      {
        title: t("My projects"),
        url: "/my-projects",
        visibility,
        tourTarget: tourSelectors.PROJECTS
      },
      {
        title: t("My Organization"),
        url: myOrg?.uuid ? `/organization/${myOrg?.uuid}` : "/",
        visibility,
        tourTarget: tourSelectors.ORGANIZATION
      },
      {
        title: t("Help Center"),
        url: zendeskSupportLink,
        visibility: true,
        tourTarget: tourSelectors.HELP
      }
    ]
  };
};
