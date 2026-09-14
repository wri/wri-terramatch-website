// Breadcrumb labels are truncated at the STRING level (not with CSS) so a long crumb — e.g. a long
// project or site name — never wraps the single-line design-system Breadcrumb onto multiple lines.
// This is the convention every breadcrumb in the product already follows via ResponsiveBreadcrumbToolbar;
// keeping the cap and the helper here gives both call sites one source of truth.
export const DESKTOP_MAX_LABEL_LENGTH = 25;

export const truncateBreadcrumbLabel = (label: string, maxLength: number): string =>
  label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
