import { useRecordContext } from "react-admin";

const UserTitle = () => {
  const record = useRecordContext();
  return <>User {record ? `"${record.firstName} ${record.lastName}"` : ""}</>;
};

export default UserTitle;
