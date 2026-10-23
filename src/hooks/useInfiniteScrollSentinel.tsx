import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

const ROOT_MARGIN = "0px 0px 400px 0px";

type UseInfiniteScrollSentinelArgs = {
  enabled: boolean;
  onLoadMore: () => void;
  resetKey?: number;
};

export const useInfiniteScrollSentinel = ({ enabled, onLoadMore, resetKey }: UseInfiniteScrollSentinelArgs) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (node == null || !enabled) return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        onLoadMoreRef.current();
      },
      { rootMargin: ROOT_MARGIN }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, resetKey]);

  return sentinelRef;
};

type InfiniteScrollSentinelProps = {
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  label: string;
  onLoadMore: () => void;
  resetKey?: number;
};

export const InfiniteScrollSentinel = ({
  hasMore,
  loading,
  loadingMore,
  label,
  onLoadMore,
  resetKey
}: InfiniteScrollSentinelProps) => {
  const sentinelRef = useInfiniteScrollSentinel({
    enabled: hasMore && !loading && !loadingMore,
    onLoadMore,
    resetKey
  });

  if (!hasMore) return null;

  return (
    <Flex ref={sentinelRef} minHeight="4rem" alignItems="center" justifyContent="center" gap={3}>
      {loadingMore ? (
        <>
          <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
          <Text textStyle="400" color="neutral.800">
            {label}
          </Text>
        </>
      ) : null}
    </Flex>
  );
};
