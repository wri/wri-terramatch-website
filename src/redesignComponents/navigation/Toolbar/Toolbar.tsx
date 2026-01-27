import { FC } from "react";

const Toolbar: FC<{ contentLeft: React.ReactNode; contentRight: React.ReactNode }> = ({
  contentLeft,
  contentRight
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>{contentLeft}</div>
      <div>{contentRight}</div>
    </div>
  );
};

export default Toolbar;
