export function getValueForStatusPolygon(status: string): number {
  switch (status) {
    case "draft":
      return 0;
    case "submitted":
      return 34;
    case "needs-more-information":
      return 67;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export function getValueForStatusSite(status: string): number {
  switch (status) {
    case "started":
      return 0;
    case "awaiting-approval":
      return 25;
    case "needs-more-information":
      return 50;
    case "restoration-in-progress":
      return 75;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export function getValueForStatusProject(status: string): number {
  switch (status) {
    case "started":
      return 0;
    case "awaiting-approval":
      return 34;
    case "needs-more-information":
      return 67;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export function getValueForStatusEntityReport(status: string): number {
  switch (status) {
    case "due":
      return 0;
    case "started":
      return 25;
    case "needs-more-information":
      return 50;
    case "awaiting-approval":
      return 75;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export function getValueForStatusNursery(status: string): number {
  switch (status) {
    case "started":
      return 0;
    case "awaiting-approval":
      return 34;
    case "needs-more-information":
      return 67;
    case "approved":
      return 100;
    default:
      return 0;
  }
}
