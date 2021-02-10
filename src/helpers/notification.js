export const NOTIFICATION_ACTIONS = {
  INTEREST_SHOWN_ACTION: 'interest_shown',
  MATCH_ACTION: 'match',
  UNMATCH_ACTION: 'unmatch',
  VERSION_CREATED_ACTION: 'version_created',
  VERSION_APPROVED_ACTION: 'version_approved',
  VERSION_REJECTED_ACTION: 'version_rejected',
  UPDATE_VISIBILITY_ACTION: 'update_visibility',
  PROJECT_CHANGED: 'project_changed'
};

export const TYPES = {
  PITCH_VERSION: 'PitchVersion',
  PITCH: 'Pitch',
  OFFER: 'Offer',
  ORGANISATION_VERSION: 'OrganisationVersion',
  ORGANISATION: 'Organisation'
};

export const getNotificationURL = (notification) => {
  switch (notification.action) {
    case NOTIFICATION_ACTIONS.INTEREST_SHOWN_ACTION:
    case NOTIFICATION_ACTIONS.MATCH_ACTION:
    case NOTIFICATION_ACTIONS.UNMATCH_ACTION:
      return `connections`;
    case NOTIFICATION_ACTIONS.VERSION_CREATED_ACTION:
      switch (notification.referenced_model) {
        case TYPES.PITCH_VERSION:
          return `admin/pitches/previewVersion/${notification.referenced_model_id}`;
        case TYPES.PITCH:
          return `admin/pitches/preview/${notification.referenced_model_id}`;
        case TYPES.ORGANISATION_VERSION:
          return `admin/organization/previewVersion/${notification.referenced_model_id}`;
        case TYPES.ORGANISATION:
          return `admin/organization/preview/${notification.referenced_model_id}`;
        default:
          return '#'
      }
    case NOTIFICATION_ACTIONS.VERSION_APPROVED_ACTION:
    case NOTIFICATION_ACTIONS.VERSION_REJECTED_ACTION:
      switch (notification.referenced_model) {
        case TYPES.PITCH:
          return `projects/${notification.referenced_model_id}`
        default:
          return `profile`;
      }
    case NOTIFICATION_ACTIONS.PROJECT_CHANGED:
    case NOTIFICATION_ACTIONS.UPDATE_VISIBILITY_ACTION:
      switch (notification.referenced_model) {
        case TYPES.PITCH:
          return `projects/${notification.referenced_model_id}`;
        case TYPES.OFFER:
          return `funding/${notification.referenced_model_id}`;
        default:
          return `connections`;
      }
    default:
      return '#';
  }
};
