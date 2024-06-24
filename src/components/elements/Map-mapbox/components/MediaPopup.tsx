import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Text from "@/components/elements/Text/Text";

const client = new QueryClient();

export const MediaPopup = ({
  name,
  created_date,
  file_url
}: {
  name: string;
  created_date: string;
  file_url: string;
}) => {
  return (
    <QueryClientProvider client={client}>
      <div>
        <div className={"rounded-lg bg-white p-2"}>
          <img className="h-full" alt="" src={file_url} />
        </div>
        <div>
          <Text variant="text-12-bold">{name}</Text>
          <Text variant="text-12-light">
            {new Date(created_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC"
            })}
          </Text>
        </div>
      </div>
    </QueryClientProvider>
  );
};
