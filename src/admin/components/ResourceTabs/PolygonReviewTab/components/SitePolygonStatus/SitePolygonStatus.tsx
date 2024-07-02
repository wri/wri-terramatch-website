import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";

const polygonStatusLabels = [
  { id: "1", label: "Draft" },
  { id: "2", label: "Awaiting approval" },
  { id: "3", label: "Needs more information" },
  { id: "4", label: "Planting in progress" },
  { id: "5", label: "Approved" }
];

const SitePolygonStatus = ({ statusLabel }: { statusLabel: string }) => {
  const status = statusLabel === "Unknown" ? "Planting in progress" : statusLabel;
  const statusIndex = polygonStatusLabels.findIndex(({ label }) => label === status);
  const progress = statusIndex === -1 ? 0 : Math.min(100, statusIndex * 25);
  return <StepProgressbar color="primary" value={progress} labels={polygonStatusLabels} labelVariant="text-10" />;
};

export default SitePolygonStatus;
