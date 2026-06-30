export const POLYGON_APPROVAL_TABLE_CSS = {
  "& >div>div": {
    maxHeight: "15rem",
    overflowY: "auto"
  },
  "& table tbody tr td:not(:last-child)": {
    borderRight: "0.06rem solid var(--chakra-colors-neutral-100)",
    marginRight: "0.06rem"
  },
  "& table tbody tr:hover": {
    backgroundColor: "var(--chakra-colors-neutral-100)"
  },
  "& table thead tr th": {
    backgroundColor: "var(--chakra-colors-neutral-200)",
    position: "sticky",
    top: 0,
    zIndex: 1
  },
  "& table thead tr": {
    backgroundColor: "var(--chakra-colors-neutral-200)",
    position: "sticky",
    top: 0,
    zIndex: 1
  },
  "& table thead tr th:not(:last-child)": {
    borderRight: "0.06rem solid var(--chakra-colors-neutral-100)",
    marginRight: "0.06rem"
  },
  "& table tbody tr:last-child": {
    borderBottom: "none !important"
  }
};
