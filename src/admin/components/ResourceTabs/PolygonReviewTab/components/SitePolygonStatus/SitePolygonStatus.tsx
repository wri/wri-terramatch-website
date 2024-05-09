import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";

const polygonStatusLabels = [
  { id: "1", label: "Draft" },
  { id: "2", label: "Awaiting Approval" },
  { id: "3", label: "Needs More Information" },
  { id: "4", label: "Planting In Progress" },
  { id: "5", label: "Approved" }
];

const SitePolygonStatus = ({ statusLabel }: { statusLabel: string }) => {
  const statusIndex = polygonStatusLabels.findIndex(({ label }) => label === statusLabel);
  const progress = statusIndex === -1 ? 0 : (statusIndex + 1) * 20;
  return <StepProgressbar color="primary" value={progress} labels={polygonStatusLabels} labelVariant="text-10" />;
};

export default SitePolygonStatus;
