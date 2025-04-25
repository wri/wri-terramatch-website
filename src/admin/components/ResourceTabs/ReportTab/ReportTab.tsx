import { FC, Fragment, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useDataProvider, useShowContext } from "react-admin";
import { When } from "react-if";

import { ExtendedGetListResult } from "@/admin/apiProvider/utils/listing";
import Text from "@/components/elements/Text/Text";
import { usePlants } from "@/connections/EntityAssocation";

import AggregatedTreeSpeciesTable from "./AggregatedTreeSpeciesTable";
import { GrdTitleEmployment, GrdTitleSites, GridsContentReport, GridsTitleReport } from "./GridsReportContent";
import HeaderSecReportGemeration from "./HeaderSecReportGemeration";
import ReportDoughnutChart from "./ReportDoughnutChart";
import ReportPieChart from "./ReportPieChart";
import ResportTabHeader from "./ResportTabHeader";

// Print-specific styles - Complete redesign for reliable pagination
const printStyles = `
  @media print {
    /* Reset all visibility */
    * {
      visibility: visible !important;
    }
    
    /* Hide app UI elements */
    header, nav, footer, .MuiTabs-root, button, 
    .MuiAppBar-root, .MuiDrawer-root, .RaLayout-appFrame > div:not(.RaLayout-contentWithSidebar) {
      display: none !important;
    }
    
    /* Make sure content is visible */
    body, html, #root, .RaLayout-root, .RaLayout-content {
      height: auto !important;
      overflow: visible !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background-color: white !important;
      display: block !important;
    }
    
    /* Reset layout */
    #printable-report-content {
      width: 100% !important;
      margin: 0 !important;
      padding: 10px !important;
      position: static !important;
      overflow: visible !important;
      display: block !important;
      visibility: visible !important;
    }
    
    /* Make cards print properly */
    .MuiCard-root, .MuiPaper-root {
      box-shadow: none !important;
      background-color: white !important;
      border: 1px solid #ddd !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 10px !important;
      overflow: visible !important;
      display: block !important;
    }
    
    /* Format tables */
    table {
      width: 100% !important;
      max-width: 100% !important;
      border-collapse: collapse !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      display: table !important;
    }
    
    /* Fix grid layout for print */
    .MuiGrid-container, .MuiGrid-item {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      flex: 0 0 100% !important;
    }
    
    /* Make sure sections don't break */
    .section-container {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 20px !important;
      display: block !important;
    }
    
    /* Set specific page breaks */
    .print-page-break {
      page-break-before: always !important;
      padding-top: 20px !important;
    }
    
    /* Ensure headers don't break */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    
    /* Format text for print */
    p, span, div {
      color: black !important;
    }
    
    /* Set page size and margins */
    @page {
      size: A4 portrait;
      margin: 1cm;
    }
    
    /* Ensure all content is visible */
    .RaLayout-content, .RaLayout-contentWithSidebar {
      display: block !important;
      visibility: visible !important;
      overflow: visible !important;
      height: auto !important;
      width: 100% !important;
    }
    
    /* Fix for TabbedShowLayout */
    .RaTabbedShowLayout-tab {
      display: block !important;
      visibility: visible !important;
    }
    
    /* Ensure all content is rendered */
    .RaTabbedShowLayout-content {
      display: block !important;
      visibility: visible !important;
    }
  }
`;

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  type: string;
}

// Define a type for the project reports
interface ProjectReport {
  id: string;
  uuid: string;
  status: string;
  createdAt: string;
  reportTitle: string;
  [key: string]: any; // For other properties
}

// Define interface for demographic entries received from API
interface DemographicEntry {
  type: string;
  subtype: string;
  name: string | null;
  amount: number;
}

// Define interface for demographic data included in API response
interface IncludedDemographic {
  type: string;
  id: string;
  attributes: {
    entityType: string;
    entityUuid: string;
    uuid: string;
    type: string;
    collection: string;
    entries: DemographicEntry[];
  };
}

// Define interfaces for processed demographic data
interface DemographicCounts {
  total: number;
  male: number;
  female: number;
  youth: number;
  nonYouth: number;
}

interface EmploymentDemographicData {
  fullTimeJobs: DemographicCounts;
  partTimeJobs: DemographicCounts;
  volunteers: DemographicCounts;
}

interface BeneficiaryData {
  beneficiaries: number;
  farmers: number;
}

const ReportTab: FC<IProps> = ({ label, type, ...rest }) => {
  const ctx = useShowContext();
  const { record } = useShowContext();
  const dataProvider = useDataProvider();
  const [sites, setSites] = useState<any[]>([]);

  const [, { associations: plants }] = usePlants({ entity: "projects", uuid: record?.id, collection: "tree-planted" });
  console.log("Plants:", JSON.stringify(plants));

  // Add state for employment data and beneficiary data
  const [employmentData, setEmploymentData] = useState<EmploymentDemographicData>({
    fullTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
    partTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
    volunteers: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 }
  });

  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryData>({
    beneficiaries: 0,
    farmers: 0
  });

  // Process demographic data from included array
  const processDemographicData = (demographics: IncludedDemographic[]): EmploymentDemographicData => {
    // Initialize default data structure
    const result: EmploymentDemographicData = {
      fullTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
      partTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
      volunteers: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 }
    };

    // Process each demographic entry
    demographics.forEach(demographic => {
      if (demographic.attributes.type === "jobs" || demographic.attributes.type === "volunteers") {
        let targetCategory: keyof EmploymentDemographicData;

        if (demographic.attributes.type === "jobs") {
          if (demographic.attributes.collection === "full-time") {
            targetCategory = "fullTimeJobs";
          } else if (demographic.attributes.collection === "part-time") {
            targetCategory = "partTimeJobs";
          } else {
            return;
          }
        } else {
          targetCategory = "volunteers";
        }

        const genderEntries = demographic.attributes.entries.filter(entry => entry.type === "gender");
        const maleEntry = genderEntries.find(entry => entry.subtype === "male");
        const femaleEntry = genderEntries.find(entry => entry.subtype === "female");
        const ageEntries = demographic.attributes.entries.filter(entry => entry.type === "age");
        const youthEntry = ageEntries.find(entry => entry.subtype === "youth");
        const nonYouthEntry = ageEntries.find(entry => entry.subtype === "non-youth");
        const genderTotal = genderEntries.reduce((sum, entry) => sum + entry.amount, 0);
        result[targetCategory].male += maleEntry?.amount || 0;
        result[targetCategory].female += femaleEntry?.amount || 0;
        result[targetCategory].youth += youthEntry?.amount || 0;
        result[targetCategory].total += genderTotal;
        if (nonYouthEntry) {
          result[targetCategory].nonYouth += nonYouthEntry.amount;
        } else {
          if (youthEntry) {
            result[targetCategory].nonYouth = genderTotal - (youthEntry?.amount || 0);
          }
        }
      }
    });

    return result;
  };

  const processBeneficiaryData = (demographics: IncludedDemographic[]): BeneficiaryData => {
    const result: BeneficiaryData = {
      beneficiaries: 0,
      farmers: 0
    };

    // Find all beneficiary demographics
    const beneficiaryDemographics = demographics.filter(
      d => d.attributes.type === "all-beneficiaries" && d.attributes.collection === "all"
    );

    beneficiaryDemographics.forEach(demographic => {
      // Get gender entries for total beneficiaries
      const genderEntries = demographic.attributes.entries.filter(entry => entry.type === "gender");
      result.beneficiaries += genderEntries.reduce((sum, entry) => sum + entry.amount, 0);

      // Get smallholder farmer entries
      const smallholderEntries = demographic.attributes.entries.filter(
        entry => entry.type === "farmer" && entry.subtype === "smallholder"
      );
      result.farmers += smallholderEntries.reduce((sum, entry) => sum + entry.amount, 0);
    });

    return result;
  };

  useEffect(() => {
    const fetchReports = async () => {
      if (record?.id) {
        try {
          const { included } = (await dataProvider.getList<ProjectReport>("projectReport", {
            filter: { status: "approved", projectUuid: record?.id },
            pagination: { page: 1, perPage: 100 },
            sort: { field: "createdAt", order: "DESC" },
            meta: {
              sideloads: [{ entity: "demographics", pageSize: 100 }]
            }
          })) as ExtendedGetListResult<ProjectReport>;

          if (included && Array.isArray(included)) {
            const demographicsData = included.filter(item => item.type === "demographics");

            if (demographicsData.length > 0) {
              const processedEmploymentData = processDemographicData(demographicsData as IncludedDemographic[]);
              setEmploymentData(processedEmploymentData);
              const processedBeneficiaryData = processBeneficiaryData(demographicsData as IncludedDemographic[]);
              setBeneficiaryData(processedBeneficiaryData);
            } else {
              console.log("No demographic data found in included array");
            }
          }
        } catch (error) {
          console.error("Error fetching approved reports:", error);
        }
      }
    };

    const fetchSites = async () => {
      if (record?.id) {
        try {
          const { data } = await dataProvider.getList("site", {
            filter: {
              projectUuid: record?.id,
              status: ["approved", "restoration-in-progress"]
            },
            pagination: { page: 1, perPage: 100 },
            sort: { field: "createdAt", order: "DESC" }
          });
          setSites(data);
        } catch (error) {
          console.error("Error fetching sites:", error);
        }
      }
    };
    fetchReports();
    fetchSites();
  }, [record?.id, dataProvider]);

  // In a real implementation, you would fetch the report data
  // using a custom hook or API call similar to other tabs
  const reportData = {
    organization: {
      name: "Foundation"
    },
    project: {
      name: "Ecosystem and livelihoods enhancement for People, Nature and Climate in Marsabit County",
      trees: {
        planted: 34170,
        goal: 30000,
        percentage: 114
      },
      hectares: {
        restored: 13436,
        goal: 30,
        percentage: 45
      },
      jobs: {
        fullTime: employmentData.fullTimeJobs.total,
        partTime: employmentData.partTimeJobs.total
      }
    },
    metrics: {
      sites: 2,
      survivalRate: 72,
      beneficiaries: beneficiaryData.beneficiaries,
      smallholderFarmers: beneficiaryData.farmers
    },
    employment: {
      fullTimeJobs: employmentData.fullTimeJobs.total,
      partTimeJobs: employmentData.partTimeJobs.total,
      volunteers: employmentData.volunteers.total,
      demographics: {
        fullTime: employmentData.fullTimeJobs,
        partTime: employmentData.partTimeJobs,
        volunteers: employmentData.volunteers
      }
    },
    sites: [
      {
        name: "Agroforestry Marsabit",
        hectareGoal: 20,
        hectaresUnderRestoration: 4352,
        totalReportedDisturbances: 3,
        climaticDisturbances: 4,
        manmadeDisturbances: 1
      },
      {
        name: "Songa forest-Marsabit",
        hectareGoal: 10,
        hectaresUnderRestoration: 9085,
        totalReportedDisturbances: 9,
        climaticDisturbances: 3,
        manmadeDisturbances: 5
      }
    ]
  };

  // Add print handler to keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+P or Command+P
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        // Prevent default to handle printing ourselves
        e.preventDefault();

        // Force all content to be visible before printing
        const content = document.getElementById("printable-report-content");
        if (content) {
          // Ensure all content is visible
          content.style.display = "block";
          content.style.visibility = "visible";
          content.style.height = "auto";
          content.style.overflow = "visible";

          // Trigger print after a short delay to ensure styles are applied
          setTimeout(() => {
            window.print();
          }, 100);
        } else {
          // Fallback to default print if content not found
          window.print();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Inject print styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const ReportContent = () => (
    <div id="printable-report-content">
      <div className="p-4">
        <ResportTabHeader />
        <div className="grid grid-cols-2 gap-y-6 gap-x-2 py-6">
          <div>
            <HeaderSecReportGemeration title="General" />
            <div className="grid grid-cols-2 divide-y-2 divide-black/10 border-b-2 border-black/10">
              <GridsTitleReport title="Organization Name" />
              <GridsContentReport content={record.organisationName} />
              <GridsTitleReport title="Project Name" />
              <GridsContentReport content={record.name} />
              <GridsTitleReport title="Number of sites" />
              <GridsContentReport content={record.totalSites} />
              <GridsTitleReport title="Most recent survival rate" />
              <GridsContentReport content={80} />
              <GridsTitleReport title="Total direct beneficiaries" />
              <GridsContentReport content={beneficiaryData.beneficiaries} />
              <GridsTitleReport title="Total smallholder farmers engaged" />
              <GridsContentReport content={beneficiaryData.farmers} />
            </div>
          </div>

          <div className="h-full">
            <HeaderSecReportGemeration title="Project and Goals" />
            <div className="grid h-[calc(100%-2rem)] grid-cols-3 border-b-2 border-black/10">
              <div className="flex h-full items-center justify-center">
                <ReportDoughnutChart
                  label="Trees Planted"
                  currentValue={record.treesPlantedCount}
                  goalValue={record.treesGrownGoal}
                  description={
                    <div>
                      <Text variant="text-12-bold" as="span" className="text-center leading-[normal] text-darkCustom">
                        {record.treesPlantedCount.toLocaleString()}
                      </Text>
                      &nbsp;
                      <Text variant="text-10-light" as="span" className="text-center leading-[normal] text-darkCustom">
                        of {record.treesGrownGoal.toLocaleString()}
                      </Text>
                    </div>
                  }
                  color="#27A9E0"
                />
              </div>

              <div className="flex h-full items-center justify-center">
                <ReportDoughnutChart
                  label="Hectares Restored"
                  currentValue={record.totalHectaresRestoredSum}
                  goalValue={record.totalHectaresRestoredGoal}
                  description={
                    <div>
                      <Text variant="text-12-bold" as="span" className="text-center leading-[normal] text-darkCustom">
                        {record.totalHectaresRestoredSum.toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1
                        })}
                      </Text>
                      &nbsp;
                      <Text variant="text-10-light" as="span" className="text-center leading-[normal] text-darkCustom">
                        of{" "}
                        {record.totalHectaresRestoredGoal.toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1
                        })}{" "}
                        ha
                      </Text>
                    </div>
                  }
                  color="#27A9E0"
                />
              </div>

              <div className="flex h-full items-center justify-center">
                <ReportDoughnutChart
                  label="Jobs Created"
                  currentValue={record.totalJobsCreated}
                  goalValue={record.totalJobsCreated}
                  description={
                    <div>
                      <Text variant="text-10-bold" className="text-center leading-[normal] text-darkCustom">
                        {reportData.project.jobs.fullTime} Full-time
                      </Text>
                      <Text variant="text-10-bold" className="text-center leading-[normal] text-darkCustom">
                        {reportData.project.jobs.partTime} Part-time
                      </Text>
                    </div>
                  }
                  color="#27A9E0"
                  hidePercentage
                />
              </div>
            </div>
          </div>

          <div className="h-full grid-cols-3 border-b-2 border-black/10">
            <HeaderSecReportGemeration title="Employment Opportunities Created" />
            <div className="flex h-full items-center justify-center">
              <ReportPieChart
                data={{
                  fullTime: reportData.employment.fullTimeJobs,
                  partTime: reportData.employment.partTimeJobs,
                  volunteers: reportData.employment.volunteers
                }}
              />
            </div>
          </div>
          {/* Demographics Section */}
          <div>
            <HeaderSecReportGemeration title="Employment Opportunities Created by Demographics" />
            <div className="grid grid-cols-8 divide-y-2 divide-black/10 border-b-2 border-black/10">
              <GrdTitleEmployment />

              <GridsTitleReport title="Full Time Jobs created" className="col-span-3" />
              <GridsContentReport content={reportData.employment.demographics.fullTime.total} />
              <GridsContentReport content={reportData.employment.demographics.fullTime.male} />
              <GridsContentReport content={reportData.employment.demographics.fullTime.female} />
              <GridsContentReport content={reportData.employment.demographics.fullTime.youth} />
              <GridsContentReport content={reportData.employment.demographics.fullTime.nonYouth} />

              <GridsTitleReport title="Part Time Jobs created" className="col-span-3" />
              <GridsContentReport content={reportData.employment.demographics.partTime.total} />
              <GridsContentReport content={reportData.employment.demographics.partTime.male} />
              <GridsContentReport content={reportData.employment.demographics.partTime.female} />
              <GridsContentReport content={reportData.employment.demographics.partTime.youth} />
              <GridsContentReport content={reportData.employment.demographics.partTime.nonYouth} />

              <GridsTitleReport title="Volunteers created" className="col-span-3" />
              <GridsContentReport content={reportData.employment.demographics.volunteers.total} />
              <GridsContentReport content={reportData.employment.demographics.volunteers.male} />
              <GridsContentReport content={reportData.employment.demographics.volunteers.female} />
              <GridsContentReport content={reportData.employment.demographics.volunteers.youth} />
              <GridsContentReport content={reportData.employment.demographics.volunteers.nonYouth} />
            </div>
          </div>

          {/* Sites Section - explicit page break */}

          <div className="col-span-2 h-full">
            <HeaderSecReportGemeration title="Sites" />
            <div className="grid grid-cols-6 divide-y-2 divide-black/10 border-b-2 border-black/10">
              <GrdTitleSites />

              {reportData.sites.map((site, index) => (
                <Fragment key={index}>
                  <GridsContentReport content={site.name} />
                  <GridsContentReport content={site.hectareGoal} />
                  <GridsContentReport content={site.hectaresUnderRestoration} />
                  <GridsContentReport content={site.totalReportedDisturbances} />
                  <GridsContentReport content={site.climaticDisturbances} />
                  <GridsContentReport content={site.manmadeDisturbances} />
                </Fragment>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <HeaderSecReportGemeration title="Tree Species Analysis" />
            <AggregatedTreeSpeciesTable sites={sites} goalPlants={plants} />
          </div>
        </div>
      </div>
    </div>
  );

  // Add print button for testing (optional)
  useEffect(() => {
    // Add specific print button listener for debugging
    const printButton = document.createElement("button");
    printButton.textContent = "Print Report (Debug)";
    printButton.style.position = "fixed";
    printButton.style.bottom = "20px";
    printButton.style.right = "20px";
    printButton.style.zIndex = "9999";
    printButton.style.padding = "10px";
    printButton.style.backgroundColor = "#f0f0f0";
    printButton.style.border = "1px solid #ccc";
    printButton.style.borderRadius = "4px";
    printButton.style.cursor = "pointer";

    printButton.addEventListener("click", () => {
      // Force all content to be visible before printing
      const content = document.getElementById("printable-report-content");
      if (content) {
        // Ensure all content is visible
        content.style.display = "block";
        content.style.visibility = "visible";
        content.style.height = "auto";
        content.style.overflow = "visible";

        // Trigger print after a short delay to ensure styles are applied
        setTimeout(() => {
          window.print();
        }, 100);
      } else {
        // Fallback to default print if content not found
        window.print();
      }
    });

    // Only add in development mode
    if (process.env.NODE_ENV === "development") {
      document.body.appendChild(printButton);
    }

    return () => {
      if (process.env.NODE_ENV === "development" && document.body.contains(printButton)) {
        document.body.removeChild(printButton);
      }
    };
  }, []);

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab style={{ flexDirection: "row", minHeight: "unset" }} label={label ?? "Reports"} {...rest}>
        <ReportContent />
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default ReportTab;
