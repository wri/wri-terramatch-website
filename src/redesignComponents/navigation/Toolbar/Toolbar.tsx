const Toolbar = ({ contentLeft, contentRight }: { contentLeft: React.ReactNode; contentRight: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between">
      <div>{contentLeft}</div>
      <div>{contentRight}</div>
    </div>
  );
};

export default Toolbar;
