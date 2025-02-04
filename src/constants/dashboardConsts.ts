export const CHART_TYPES = {
  multiLineChart: "multiLineChart",
  treesPlantedBarChart: "treesPlantedBarChart",
  groupedBarChart: "groupedBarChart",
  doughnutChart: "doughnutChart",
  barChart: "barChart",
  simpleBarChart: "simpleBarChart"
};

export const JOBS_CREATED_CHART_TYPE = {
  gender: "gender",
  age: "age"
};

export const COLORS: Record<string, string> = {
  Enterprise: "#27A9E0",
  "Non Profit": "#7BBD31",
  Total: "#053D38"
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const ORGANIZATIONS_TYPES = {
  "non-profit-organization": "Non-Profit",
  "for-profit-organization": "Enterprise"
};

export const TERRAFUND_MONITORING_LINK = "https://www.wri.org/update/land-degradation-project-recipe-for-restoration";

export const TEXT_TYPES = {
  LOGGED_USER: "textForLoggedUser",
  NOT_LOGGED_USER: "textForNotLoggedUser",
  NO_DATA: "noData",
  NO_GRAPH: "noGraph"
};

export const TERRAFUND_MRV_LINK = `<a href=${TERRAFUND_MONITORING_LINK} class="underline !text-black" target="_blank">TerraFund's MRV framework</a>`;

export const DEFAULT_POLYGONS_DATA = {
  graphicTargetLandUseTypes: [],
  totalSection: {
    totalHectaresRestored: 0
  }
};

export const DEFAULT_POLYGONS_DATA_STRATEGIES = [
  { label: "Direct Seeding", value: 0 },
  { label: "Assisted Natural Regeneration", value: 0 },
  { label: "Tree Planting", value: 0 },
  { label: "Multiple Strategies", value: 0 }
];

export const DEFAULT_POLYGONS_DATA_ECOREGIONS = {
  chartData: [],
  total: 0
};

export const DUMMY_DATA_FOR_CHART_MULTI_LINE_CHART = [
  {
    name: "Total",
    values: [
      { time: "2022-09-01T00:00:00.000Z", value: 3800000, name: "Total" },
      { time: "2022-10-01T00:00:00.000Z", value: 3850000, name: "Total" },
      { time: "2022-12-01T00:00:00.000Z", value: 3900000, name: "Total" },
      { time: "2023-01-01T00:00:00.000Z", value: 6700000, name: "Total" },
      { time: "2023-07-01T00:00:00.000Z", value: 11200000, name: "Total" },
      { time: "2024-02-01T00:00:00.000Z", value: 17100000, name: "Total" },
      { time: "2024-07-01T00:00:00.000Z", value: 22400000, name: "Total" }
    ]
  },
  {
    name: "Enterprise",
    values: [
      { time: "2022-09-01T00:00:00.000Z", value: 620000, name: "Enterprise" },
      { time: "2022-10-01T00:00:00.000Z", value: 625000, name: "Enterprise" },
      { time: "2022-12-01T00:00:00.000Z", value: 630000, name: "Enterprise" },
      { time: "2023-01-01T00:00:00.000Z", value: 800000, name: "Enterprise" },
      { time: "2023-07-01T00:00:00.000Z", value: 1100000, name: "Enterprise" },
      { time: "2024-02-01T00:00:00.000Z", value: 1600000, name: "Enterprise" },
      { time: "2024-07-01T00:00:00.000Z", value: 2100000, name: "Enterprise" }
    ]
  },
  {
    name: "Non Profit",
    values: [
      { time: "2022-09-01T00:00:00.000Z", value: 3180000, name: "Non Profit" },
      { time: "2022-10-01T00:00:00.000Z", value: 3225000, name: "Non Profit" },
      { time: "2022-12-01T00:00:00.000Z", value: 3270000, name: "Non Profit" },
      { time: "2023-01-01T00:00:00.000Z", value: 5900000, name: "Non Profit" },
      { time: "2023-07-01T00:00:00.000Z", value: 10100000, name: "Non Profit" },
      { time: "2024-02-01T00:00:00.000Z", value: 15500000, name: "Non Profit" },
      { time: "2024-07-01T00:00:00.000Z", value: 20300000, name: "Non Profit" }
    ]
  }
];

export const DUMMY_DATA_FOR_CHART_GROUPED_BAR_CHART_GENDER = {
  type: "gender",
  chartData: [
    { name: "Part-Time", Women: 27500, Men: 26000 },
    { name: "Full-Time", Women: 4500, Men: 2600 }
  ],
  total: 60600,
  maxValue: 30000
};

export const DUMMY_DATA_FOR_CHART_GROUPED_BAR_CHART_AGE = {
  type: "age",
  chartData: [
    { name: "Part-Time", Youth: 30000, "Non-Youth": 18000 },
    { name: "Full-Time", Youth: 4700, "Non-Youth": 1200 }
  ],
  total: 60600,
  maxValue: 30000
};

export const DUMMY_DATA_FOR_CHART_DOUGHNUT_CHART_GENDER = {
  type: "gender",
  chartData: [
    { name: "Women", value: 34000 },
    { name: "Men", value: 34500 }
  ],
  total: 47000
};

export const DUMMY_DATA_FOR_CHART_DOUGHNUT_CHART_AGE = {
  type: "age",
  chartData: [
    { name: "Youth", value: 32500 },
    { name: "Non-Youth", value: 21500 }
  ],
  total: 47000
};

export const DUMMY_DATA_FOR_CHART_SIMPLE_BAR_CHART = [
  { label: "Tree Planting", value: 0.9 },
  { label: "direct-seeding", value: 8.6 },
  { label: "assisted-natural-regeneration", value: 5.6 }
];

export const DUMMY_DATA_TARGET_LAND_USE_TYPES_REPRESENTED = {
  graphicTargetLandUseTypes: [
    {
      label: "Agroforest",
      value: 60,
      valueText: "212 ha 60%"
    },
    {
      label: "Natural Forest",
      value: 25,
      valueText: "205 ha 30%"
    },
    {
      label: "Mangrove",
      value: 2,
      valueText: "158 ha 2%"
    },
    {
      label: "Woodlot / Plantation",
      value: 6,
      valueText: "127 ha 5%"
    },
    {
      label: "Open Natural Ecosystem",
      value: 3,
      valueText: "89 ha 3%"
    },
    {
      label: "Riparian Area / Wetland",
      value: 1,
      valueText: "76 ha <1%"
    },
    {
      label: "Urban Forest",
      value: 1,
      valueText: "43 ha <1%"
    },
    {
      label: "Silvopasture",
      value: 1,
      valueText: "34 ha <1%"
    },
    {
      label: "Peatland",
      value: 1,
      valueText: "11 ha <1%"
    }
  ]
};
