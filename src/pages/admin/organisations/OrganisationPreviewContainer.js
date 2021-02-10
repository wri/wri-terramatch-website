import { connect } from 'react-redux'
import OrganisationPreview from './OrganisationPreview';
import { getOrganisation,
  getOrganisationVersions,
  getOrganisationVersion
} from '../../../redux/modules/organisation';

import {
  approveOrganisationTasks,
  rejectOrganisationTasks
} from '../../../redux/modules/admin';

const mapStateToProps = ({ organisations, admin, documentAwards }) => ({
  organisationVersions: organisations.getOrganisationVersions,
  organisationVersion: organisations.getOrganisationVersion,
  documentsVersions: documentAwards.getDocumentsInspect,
  approveState: admin.approveOrganisationTasks,
  rejectState: admin.rejectOrganisationTasks
});

const mapDispatchToProps = (dispatch) => {
  return {
    getOrganisation: (id) => {
      dispatch(getOrganisation(id));
    },
    getOrganisationVersions: (id) => {
      dispatch(getOrganisationVersions(id));
    },
    getOrganisationVersion: (id) => {
      dispatch(getOrganisationVersion(id));
    },
    approveOrganisation: (approvals) => {
      dispatch(approveOrganisationTasks(approvals));
    },
    rejectOrganisation: (rejections) => {
      dispatch(rejectOrganisationTasks(rejections));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationPreview);
