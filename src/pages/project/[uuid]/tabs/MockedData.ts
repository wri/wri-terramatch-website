import { IconNames } from "@/components/extensive/Icon/Icon";

export const ProjectMonitoring = [
  {
    uuid: "1",
    title: "Tree Count",
    titleColor: "text-tertiary-550",
    value: "462"
  },
  {
    uuid: "2",
    title: "Tree Cover 2024",
    value: "53.23%"
  },
  {
    uuid: "3",
    title: "Total Area (ha)",
    titleColor: "text-success-450",
    value: "300.12"
  },
  {
    uuid: "5",
    title: "Lookback Disturbance",
    titleColor: "text-neutral-500",
    value: "2.1%"
  },
  {
    uuid: "6",
    title: "Lookback Disturbance",
    titleColor: "text-neutral-500",
    value: "2.1%"
  },
  {
    uuid: "7",
    title: "Tree Count",
    type: "graph",
    img: IconNames.GRAPH1,
    leyends: [
      {
        color: "bg-blueCustom",
        title: "Average Number of Trees per hectare"
      },
      {
        color: "bg-primary",
        title: "Number of Trees"
      }
    ]
  },
  {
    uuid: "8",
    title: "EMA SNOVO",
    type: "graph",
    img: IconNames.GRAPH2
  },
  {
    uuid: "9",
    title: "Tree Cover Loss (ha)",
    type: "graph",
    img: IconNames.GRAPH3
  },
  {
    uuid: "10",
    title: "Interventions (ha)",
    type: "graph",
    img: IconNames.GRAPH4,
    leyends: [
      {
        color: "bg-black",
        title: "Agroforestry"
      },
      {
        color: "bg-blueCustom",
        title: "Silvipasture"
      },
      {
        color: "bg-primary",
        title: "Tree Planting"
      }
    ]
  },
  {
    uuid: "11",
    title: "Tree Cover Loss",
    type: "graph",
    img: IconNames.GRAPH5,
    leyends: [
      {
        color: "bg-blueCustom",
        title: "Tree Cover Loss by Fires (ha)"
      },
      {
        color: "bg-primary",
        title: "Tree Cover Loss by Non-Fires (ha)"
      }
    ]
  }
];
