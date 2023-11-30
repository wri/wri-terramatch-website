import { useRecordContext } from "react-admin";

const UserTitle = () => {
  const record = useRecordContext();
  return <>User {record ? `"${record.first_name} ${record.last_name}"` : ""}</>;
};

export default UserTitle;
