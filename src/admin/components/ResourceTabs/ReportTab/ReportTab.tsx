import { Card, Grid, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { TabbedShowLayout, TabProps, useDataProvider, useShowContext } from "react-admin";
import { When } from "react-if";

import ReportDoughnutChart from "./ReportDoughnutChart";
import ReportPieChart from "./ReportPieChart";

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

const ReportTab: FC<IProps> = ({ label, type, ...rest }) => {
  const ctx = useShowContext();
  const { record } = useShowContext();
  const dataProvider = useDataProvider();
  useEffect(() => {
    const fetchReports = async () => {
      if (record?.id) {
        try {
          const { data } = await dataProvider.getList<ProjectReport>("projectReport", {
            filter: { status: "approved", projectUuid: record?.id },
            pagination: { page: 1, perPage: 100 },
            sort: { field: "createdAt", order: "DESC" }
          });
          console.log("Approved reports:", data);
        } catch (error) {
          console.error("Error fetching approved reports:", error);
        }
      }
    };

    fetchReports();
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
        fullTime: 43,
        partTime: 12
      }
    },
    metrics: {
      sites: 2,
      survivalRate: 72,
      beneficiaries: 441,
      smallholderFarmers: 265
    },
    employment: {
      fullTimeJobs: 5,
      partTimeJobs: 37,
      volunteers: 67,
      demographics: {
        fullTime: { total: 5, male: 4, female: 2, youth: 10, nonYouth: 6 },
        partTime: { total: 37, male: 22, female: 12, youth: 10, nonYouth: 6 },
        volunteers: { total: 67, male: 11, female: 56, youth: 10, nonYouth: 6 }
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
      <div className="section-container">
        <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>
          Background Information for site visit
        </Typography>

        {/* General Information Section */}
        <div className="section-container">
          <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
            General
          </Typography>

          <table style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px", width: "25%", fontWeight: "bold" }}>Organization Name:</td>
                <td style={{ padding: "8px" }}>{record.organisationName}</td>
                <td style={{ padding: "8px", width: "25%", fontWeight: "bold" }}>Project name:</td>
                <td style={{ padding: "8px" }}>{record.name}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Number of sites:</td>
                <td style={{ padding: "8px" }}>{record.totalSites}</td>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Most recent survival rate:</td>
                <td style={{ padding: "8px" }}>{80}%</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Total direct beneficiaries:</td>
                {/* <td style={{ padding: "8px" }}>{reportData.metrics.beneficiaries}</td> */}
                <td style={{ padding: "8px", fontWeight: "bold" }}>Total smallholder farmers engaged:</td>
                {/* <td style={{ padding: "8px" }}>{reportData.metrics.smallholderFarmers}</td> */}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Project and Goals Section - UPDATED with ReportDoughnutChart */}
        <div className="section-container">
          <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
            Project and Goals
          </Typography>

          {/* Using Grid for responsive layout, with fallback to table display for printing */}
          <Grid container spacing={3} className="metrics-container">
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ReportDoughnutChart
                  label="Trees Planted"
                  currentValue={record.treesPlantedCount}
                  goalValue={record.treesGrownGoal}
                  description={`${record.treesPlantedCount.toLocaleString()} of ${record.treesGrownGoal.toLocaleString()}`}
                  color="#2196F3"
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ReportDoughnutChart
                  label="Hectares Restored"
                  currentValue={record.totalHectaresRestoredSum}
                  goalValue={record.totalHectaresRestoredGoal}
                  description={`${record.totalHectaresRestoredSum.toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })} of ${record.totalHectaresRestoredGoal.toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })} ha`}
                  color="#2196F3"
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ReportDoughnutChart
                  label="Jobs Created"
                  currentValue={record.totalJobsCreated}
                  goalValue={record.totalJobsCreated}
                  description={`FT: ${reportData.project.jobs.fullTime} / PT: ${reportData.project.jobs.partTime}`}
                  color="#2196F3"
                  hidePercentage
                />
              </Card>
            </Grid>
          </Grid>

          {/* Hidden table for print layout only - this ensures the data is displayed properly when printing */}
          <table
            style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse", display: "none" }}
            className="print-only-table"
          >
            <thead>
              <tr>
                <th style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>Trees Planted</th>
                <th style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>Hectares Restored</th>
                <th style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>Jobs Created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "15px", textAlign: "center", border: "1px solid #ddd" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>{reportData.project.trees.percentage}%</div>
                  <div>
                    {reportData.project.trees.planted} / {reportData.project.trees.goal}
                  </div>
                </td>
                <td style={{ padding: "15px", textAlign: "center", border: "1px solid #ddd" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>{reportData.project.hectares.percentage}%</div>
                  <div>
                    {reportData.project.hectares.restored} / {reportData.project.hectares.goal}
                  </div>
                </td>
                <td style={{ padding: "15px", textAlign: "center", border: "1px solid #ddd" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {reportData.project.jobs.fullTime + reportData.project.jobs.partTime}
                  </div>
                  <div>
                    FT: {reportData.project.jobs.fullTime} / PT: {reportData.project.jobs.partTime}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Employment Opportunities Section - explicit page break */}
      <div className="print-page-break section-container">
        <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
          Employment Opportunities Created
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: "100%" }}>
              <ReportPieChart
                data={{
                  fullTime: reportData.employment.fullTimeJobs,
                  partTime: reportData.employment.partTimeJobs,
                  volunteers: reportData.employment.volunteers
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}></Grid>
        </Grid>

        {/* Demographics Section */}
        <div style={{ marginTop: "30px" }}>
          <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
            Employment Opportunities Created by Demographics
          </Typography>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", backgroundColor: "#f2f2f2" }}>
                  Category
                </th>
                <th
                  style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}
                >
                  Total
                </th>
                <th
                  style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}
                >
                  Male
                </th>
                <th
                  style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}
                >
                  Female
                </th>
                <th
                  style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}
                >
                  Youth
                </th>
                <th
                  style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}
                >
                  Non-Youth
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>Full-time</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.fullTime.total}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.fullTime.male}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.fullTime.female}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.fullTime.youth}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.fullTime.nonYouth}
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>Part-time</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.partTime.total}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.partTime.male}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.partTime.female}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.partTime.youth}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.partTime.nonYouth}
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>Volunteers</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.volunteers.total}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.volunteers.male}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.volunteers.female}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.volunteers.youth}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {reportData.employment.demographics.volunteers.nonYouth}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sites Section - explicit page break */}
      <div className="print-page-break section-container">
        <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
          Sites
        </Typography>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", backgroundColor: "#f2f2f2" }}>
                Site Name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}>
                Hectare Goal
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}>
                Hectares Under Restoration
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}>
                Total Disturbances
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}>
                Climatic
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", backgroundColor: "#f2f2f2" }}>
                Man-made
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.sites.map((site, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{site.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{site.hectareGoal}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {site.hectaresUnderRestoration}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {site.totalReportedDisturbances}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {site.climaticDisturbances}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                  {site.manmadeDisturbances}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
