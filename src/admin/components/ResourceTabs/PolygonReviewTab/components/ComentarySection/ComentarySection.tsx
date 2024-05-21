import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";
import Text from "@/components/elements/Text/Text";
import Loader from "@/components/generic/Loading/Loader";
import {
  GetV2AuditStatusResponse,
  useGetAuthMe,
  useGetV2Attachment,
  useGetV2AuditStatus
} from "@/generated/apiComponents";

const ComentarySection = ({
  mutate,
  refresh,
  record,
  entity
}: {
  mutate?: any;
  refresh?: any;
  record?: any;
  entity?: string;
}) => {
  const { data: authMe } = useGetAuthMe({}) as {
    data: {
      data: any;
      first_name: string;
      last_name: string;
    };
  };
  const { data: attachment, refetch: attachmentRefetch } = useGetV2Attachment<any>({});
  const [items, setItems] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [newElement, setNewElement] = useState<boolean>(false);
  const perPage = 10;
  const { data: auditLogData, refetch } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse; total: number }>({
    queryParams: {
      entity: entity as string,
      uuid: record.uuid,
      page: page as any,
      per_page: perPage as any
    }
  });

  const fetchData = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (newElement) {
      setPage(1);
      setItems([]);
      setHasMore(true);
      refetch();
      setNewElement(false);
    }
  }, [newElement, refetch]);

  useEffect(() => {
    if (auditLogData) {
      const newData = auditLogData.data;
      setItems((prevItems: any) => (page === 1 ? newData : [...prevItems, ...newData]));
      setHasMore(items.length + newData.length < auditLogData.total);
    }
  }, [auditLogData, page, record.uuid, newElement]);

  useEffect(() => {
    if (entity && newElement) {
      setPage(1);
      setItems([]);
      setHasMore(true);
      refresh();
      refetch();
      attachmentRefetch();
    }
  }, [entity]);

  useEffect(() => {
    setPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Text variant="text-16-bold">Send Comment</Text>
      <ComentaryBox
        name={authMe?.data.first_name}
        lastName={authMe?.data.last_name}
        mutate={mutate}
        refresh={refetch}
        record={record}
        entity={entity}
        attachmentRefetch={attachmentRefetch}
        setNewElement={setNewElement}
      />
      <div className="max-h-[70vh] min-h-[10vh] grid-cols-[14%_20%_18%_15%_33%] overflow-auto" id="scrollableDiv">
        <InfiniteScroll
          dataLength={items.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<Loader />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          refreshFunction={fetchData}
          pullDownToRefreshThreshold={50}
          pullDownToRefresh
          pullDownToRefreshContent={<h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>}
          releaseToRefreshContent={<h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>}
          scrollableTarget="scrollableDiv"
        >
          {items.map((item: any) => (
            <Comentary
              key={item.id}
              name={item?.first_name || item.created_by}
              lastName={item?.last_name}
              date={item.date_created}
              comentary={item.comment}
              files={attachment?.data?.filter((attachment: any) => attachment.entity_id == item.id)}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ComentarySection;
