import { useRecordContext } from "react-admin";

const UserTitle = () => {
  const record = useRecordContext();
  return <>User {record ? `"${record.firstName} ${record.last_name}"` : ""}</>;
};

export default UserTitle;
