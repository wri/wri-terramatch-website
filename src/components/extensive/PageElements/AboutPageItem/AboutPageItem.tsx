import { FC } from "react";

import AboutPageItemDisplay, {
  AboutPageItemDisplayProps
} from "@/components/extensive/PageElements/AboutPageItem/AboutPageItemDisplay";
import { useAboutSection } from "@/connections/AboutSection";
import { useFrameworkContext } from "@/context/framework.provider";
import { AboutSectionIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";

type AboutPageItemProps = Omit<AboutPageItemDisplayProps, "aboutSection"> & {
  type: NonNullable<AboutSectionIndexQueryParams["type"]>;
};

const AboutPageItem: FC<AboutPageItemProps> = ({ type, ...props }) => {
  const { framework } = useFrameworkContext();
  const [loaded, { data: aboutSection }] = useAboutSection({ type, framework });
  return !loaded || aboutSection == null ? null : <AboutPageItemDisplay aboutSection={aboutSection} {...props} />;
};

export default AboutPageItem;
