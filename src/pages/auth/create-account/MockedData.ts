export const UserRolInfo = [
  {
    id: "project-developer",
    title: "I’m a Project Developer",
    description: "Visualize and share the progress of your project and other restoration champions."
  },
  {
    id: "government",
    title: "I’m a Government Official",
    description: "Monitor project performance to inform effective governance and resourcing.",
    menu: [],
    titleOption: "Select Country"
  },
  {
    id: "funder",
    title: "I’m a Funder/Investor",
    description: "Evaluate ROI, aid strategic investment decisions and guide funding priorities.",
    menu: [
      { id: "1", data: { label: "ppc" } },
      { id: "2", data: { label: "terraFund" } }
    ],
    titleOption: "Select Framework"
  }
  // {
  //   id: "4",
  //   title: "I’m an Interested User (Public)",
  //   description: "View the positive impacts of restoration efforts across AFR100 restoration initiatives."
  // }
];
