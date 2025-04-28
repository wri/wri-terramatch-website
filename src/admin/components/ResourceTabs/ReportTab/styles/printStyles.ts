export const printStyles = `
  @media print {
    * {
      visibility: visible !important;
    }
    
    header, nav, footer, .MuiTabs-root, button, 
    .MuiAppBar-root, .MuiDrawer-root, .RaLayout-appFrame > div:not(.RaLayout-contentWithSidebar) {
      display: none !important;
    }
    
    body, html, #root, .RaLayout-root, .RaLayout-content {
      height: auto !important;
      overflow: visible !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;

      display: block !important;
    }
    
    #printable-report-content {
      width: 100% !important;
      margin: 0 !important;
      padding: 50px 0px 0px 0px !important;
      position: static !important;
      overflow: visible !important;
      display: block !important;
      visibility: visible !important;
    }
    
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
    
    table {
      width: 100% !important;
      max-width: 100% !important;
      border-collapse: collapse !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      display: table !important;
    }
    
    .MuiGrid-container, .MuiGrid-item {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      flex: 0 0 100% !important;
    }
    
    .section-container {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      display: block !important;
    }
    
    .print-page-break {
      page-break-before: always !important;
      padding-top: 20px !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    
    p, span, div {
      color: black !important;
    }
    
    @page {
      size: A4 portrait;
      margin: 0cm;
    }
    
    .RaLayout-content, .RaLayout-contentWithSidebar {
      display: block !important;
      visibility: visible !important;
      overflow: visible !important;
      height: auto !important;
      width: 100% !important;
    }
    
    .RaTabbedShowLayout-tab {
      display: block !important;
      visibility: visible !important;
    }
    
    .RaTabbedShowLayout-content {
      display: block !important;
      visibility: visible !important;
    }

    .print-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: white;
      text-align: center;
      font-weight: bold;
      padding: 20px 20px;
      border-bottom: 1px solid #ccc;
      z-index: 9999;
    }
    .MuiAppBar-root {
      display: none !important;
    }

    .MuiBox-root {
      display: none !important;
    }

    .MuiLinearProgress-bar1 {
      background-color: #27A9E0 !important;
    }

    .header-section-report {
      border-bottom: 2px solid black !important;
      box-shadow: #CECECE 0px 40px 70px -22px inset, #CECECE 0px 28px 46px -28px inset;
    }
  }
`;

export const tableStyles = {
  table: {
    width: "100%",
    marginBottom: "20px",
    borderCollapse: "collapse"
  },
  headerCell: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f2f2f2"
  },
  cell: {
    border: "1px solid #ddd",
    padding: "8px"
  },
  rightAlignedCell: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "right"
  },
  boldCell: {
    border: "1px solid #ddd",
    padding: "8px",
    fontWeight: "bold"
  }
};
