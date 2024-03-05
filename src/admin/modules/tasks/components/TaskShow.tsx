import { Typography } from "@mui/material";
import { FC } from "react";
import { Show } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import ShowTitle from "@/admin/components/ShowTitle";

const TaskShow: FC = () => {
  return (
    <Show
      title={<ShowTitle moduleName="Task" getTitle={record => record?.title} />}
      actions={<ShowActions titleSource="title" resourceName="task" />}
    >
      <Typography>Task Show</Typography>
    </Show>
  );
};

export default TaskShow;
