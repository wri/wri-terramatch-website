import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
export interface ComentaryFilesProps {
  id: string;
  file: string;
}
export interface ComentaryProps {
  name: string;
  lastName: string;
  date: string;
  comentary: string;
  status?: "draft" | "submitted";
  files?: ComentaryFilesProps[];
}

const statusStyle = {
  submitted: { container: "bg-primary-200", textColor: "text-primary" },
  draft: { container: "bg-pinkCustom-200", textColor: "text-pinkCustom" }
};

const Comentary = (props: ComentaryProps) => {
  const { name, lastName, date, comentary, files = [], status } = props;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="ml-3 flex h-fit min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-primary-500">
            <Text variant="text-14-semibold" className="uppercase text-white">
              {name[0]}
              {lastName[0]}
            </Text>
          </div>
          <div className="flex w-full flex-col gap-1">
            <Text variant="text-12-semibold" className="text-blueCustom-250">
              {name} {lastName}
            </Text>
            <Text variant="text-10-light" className="text-blueCustom-250 opacity-50">
              {date}
            </Text>
          </div>
        </div>
        <When condition={status}>
          <div
            className={`flex h-fit w-[92px] items-center justify-center rounded-xl py-2 ${
              status ? statusStyle[status].container : ""
            }`}
          >
            <Text variant="text-12-semibold" className={`${status ? statusStyle[status].textColor : ""}`}>
              {status}
            </Text>
          </div>
        </When>
      </div>

      <Text
        variant="text-12-light"
        className="max-h-72 overflow-auto rounded-2xl border border-grey-750 p-3 leading-[175%] text-blueCustom-250 opacity-50"
      >
        {comentary}
      </Text>
      <div className="flex flex-wrap gap-2">
        {files.map(file => (
          <div key={file.id} className="rounded-xl bg-neutral-150 px-2 py-1">
            <Text variant="text-14-light" className="text-grey-700">
              {file.file}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comentary;
