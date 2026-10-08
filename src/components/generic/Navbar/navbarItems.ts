import { useT } from "@transifex/react";

import { tourSelectors } from "@/components/extensive/WelcomeTour/useGetHomeTourItems";
import { MyOrganisationConnection } from "@/connections/Organisation";
import { zendeskSupportLink } from "@/constants/links";

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

export const getNavbarItems = (t: typeof useT, myOrg?: MyOrganisationConnection): INavbarItems => {
  const { userStatus, organisation } = myOrg ?? {};
  const { status } = organisation ?? {};
  const visibility = Boolean(organisation && status !== "rejected" && status !== "draft" && userStatus !== "requested");

  return {
    public: [
      {
        title: t("Home"),
        url: "/",
        visibility: true
      },
      {
        title: t("Dashboards"),
        url: "/dashboard",
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
        title: t("Help"),
        url: zendeskSupportLink,
        visibility: true,
        tourTarget: tourSelectors.HELP
      }
    ]
  };
};
