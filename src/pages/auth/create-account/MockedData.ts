export const UserRolInfo = [
  {
    id: "1",
    title: "I’m a Project Developer",
    description: "Visualize and share the progress of your project and other restoration champions."
  },
  {
    id: "2",
    title: "I’m a Government Official",
    description: "Monitor project performance to inform effective governance and resourcing.",
    options: [
      {
        id: "1",
        render: () => "Kenya"
      },
      {
        id: "2",
        render: () => "Nigeria"
      },
      {
        id: "3",
        render: () => "Mozambique"
      },
      {
        id: "4",
        render: () => "Sierra Leone"
      },
      {
        id: "5",
        render: () => "Tanzania"
      }
    ],
    titleOption: "Select Country"
  },
  {
    id: "3",
    title: "I’m a Funder/Investor",
    description: "Evaluate ROI, aid strategic investment decisions and guide funding priorities.",
    options: [
      {
        id: "1",
        render: () => "PPC"
      },
      {
        id: "2",
        render: () => "TerraFund"
      }
    ],
    titleOption: "Select Framework"
  },
  {
    id: "4",
    title: "I’m an Interested User (Public)",
    description: "View the positive impacts of restoration efforts across AFR100 restoration initiatives."
  }
];
