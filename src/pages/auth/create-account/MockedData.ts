import { IconNames } from "@/components/extensive/Icon/Icon";

export const UserRoleInfo = [
  {
    id: "project-developer",
    title: "I’m a Project Developer",
    description: "Visualize and share the progress of your project and other restoration champions.",
    menu: [],
    icon: IconNames.USER_PROJECT_DEVELOPER
  },
  {
    id: "government",
    title: "I’m a Government Official",
    description: "Monitor project performance to inform effective governance and resourcing.",
    menu: [],
    titleOption: "Select Country",
    icon: IconNames.USER_GOVERNMENT
  },
  {
    id: "funder",
    title: "I’m a Funder/Investor",
    description: "Evaluate ROI, aid strategic investment decisions and guide funding priorities.",
    menu: [],
    icon: IconNames.USER_INVESTOR
  }
];
