import { SortingState } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { SitePolygonRow } from "../..";
import SiteAttributeTable from "./SiteAttributeTable";

// Mock the formatNumber utility
jest.mock("@/utils/dashboardUtils", () => ({
  formatNumber: (value: number | null | undefined) => {
    if (value == null || isNaN(value)) return "-";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}));

describe("SiteAttributeTable", () => {
  const mockProps = {
    setPolygonFromMap: jest.fn(),
    flyToPolygonBounds: jest.fn(),
    openFormModalHandlerConfirmDeletion: jest.fn(),
    setSorting: jest.fn(),
    sorting: [] as SortingState,
    paginatedData: [] as SitePolygonRow[],
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    setCurrentPage: jest.fn(),
    setPageSize: jest.fn(),
    containerRef: createRef<HTMLDivElement>(),
    totals: { totalTreesPlanted: 0, totalCalculatedArea: 0 },
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders summary cards with formatted totals", () => {
    const totals = { totalTreesPlanted: 12345, totalCalculatedArea: 6789.12 };
    render(<SiteAttributeTable {...mockProps} totals={totals} />);

    expect(screen.getByText("Trees Planted")).toBeInTheDocument();
    expect(screen.getByText("Calculated Area")).toBeInTheDocument();
    expect(screen.getByText("12,345")).toBeInTheDocument(); // formatted trees planted
    expect(screen.getByText("6,789.12 ha")).toBeInTheDocument(); // formatted calculated area with "ha"
  });

  test("shows loading indicator when isLoading is true", () => {
    render(<SiteAttributeTable {...mockProps} isLoading={true} />);

    const loadingIndicators = screen.getAllByText("...");
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(2); // Both cards should show "..."
  });

  test("renders table with polygon data including trees planted and calculated area", () => {
    const paginatedData: SitePolygonRow[] = [
      {
        "polygon-name": "Polygon 1",
        "restoration-practice": "tree-planting",
        "target-land-use-system": "silvopasture",
        "tree-distribution": "full",
        "planting-start-date": "2021-09-01",
        "trees-planted": 5000,
        "calculated-area": 1234.56,
        source: "uploaded",
        uuid: "test-uuid-1",
        ellipse: false
      },
      {
        "polygon-name": "Polygon 2",
        "restoration-practice": "",
        "target-land-use-system": "",
        "tree-distribution": "",
        "planting-start-date": "",
        "trees-planted": null,
        "calculated-area": null,
        source: "uploaded",
        uuid: "test-uuid-2",
        ellipse: false
      }
    ];

    render(<SiteAttributeTable {...mockProps} paginatedData={paginatedData} />);

    expect(screen.getByText("Polygon 1")).toBeInTheDocument();
    expect(screen.getByText("Polygon 2")).toBeInTheDocument();
  });

  test("displays zero for null values in totals", () => {
    const totals = { totalTreesPlanted: 0, totalCalculatedArea: 0 };
    render(<SiteAttributeTable {...mockProps} totals={totals} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("calculates totals correctly from multiple polygons", () => {
    const totals = {
      totalTreesPlanted: 15000, // sum of all polygons
      totalCalculatedArea: 5000.5
    };

    render(<SiteAttributeTable {...mockProps} totals={totals} />);

    expect(screen.getByText("15,000")).toBeInTheDocument();
    expect(screen.getByText("5,000.5 ha")).toBeInTheDocument(); // includes "ha" unit
  });
});
