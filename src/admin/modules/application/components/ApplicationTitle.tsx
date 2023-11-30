import { useRecordContext } from "react-admin";

const ApplicationTitle = () => {
  const record = useRecordContext();
  return <>Application {record ? `"${record.name ?? "N/A"}"` : ""}</>;
};

export default ApplicationTitle;
