export function getValueForStatusPolygon(status: string): number {
  switch (status) {
    case "draft":
      return 0;
    case "pending-approval":
      return 34;
    case "information-required":
      return 67;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export function getValueForStatusSite(status: string): number {
  switch (status) {
    case "draft":
      return 0;
    case "pending-approval":
      return 34;
    case "information-required":
      return 67;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export function getValueForStatusProject(status: string): number {
  switch (status) {
    case "draft":
      return 0;
    case "pending-approval":
      return 34;
    case "information-required":
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
    case "draft":
      return 25;
    case "information-required":
      return 50;
    case "pending-approval":
      return 75;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export function getValueForStatusDisturbanceReport(status: string): number {
  switch (status) {
    case "draft":
      return 0;
    case "information-required":
      return 34;
    case "pending-approval":
      return 67;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export function getValueForStatusNursery(status: string): number {
  switch (status) {
    case "draft":
      return 0;
    case "pending-approval":
      return 34;
    case "information-required":
      return 67;
    case "approved":
      return 100;
    default:
      return 0;
  }
}
